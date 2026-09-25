package astrbot

import (
	"bufio"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/dto"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/relay/helper"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/types"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

var errStopAstrBotStream = errors.New("stop astrbot stream")

type astrBotStreamEvent struct {
	Text         string
	Usage        *dto.Usage
	Done         bool
	FinishReason string
	Err          *types.NewAPIError
}

func astrBotHandler(c *gin.Context, info *relaycommon.RelayInfo, resp *http.Response) (*dto.Usage, *types.NewAPIError) {
	defer service.CloseResponseBodyGracefully(resp)

	responseText := ""
	finishReason := "stop"
	var upstreamErr *types.NewAPIError
	usage := &dto.Usage{}

	err := scanAstrBotStream(resp.Body, func(event astrBotStreamEvent) error {
		if event.Err != nil {
			upstreamErr = event.Err
			return event.Err
		}
		if event.Usage != nil {
			usage = mergeAstrBotUsage(usage, event.Usage)
		}
		if event.Text != "" {
			appendAstrBotText(&responseText, event.Text)
		}
		if event.FinishReason != "" {
			finishReason = event.FinishReason
		}
		if event.Done {
			return errStopAstrBotStream
		}
		return nil
	})
	if upstreamErr != nil {
		return nil, upstreamErr
	}
	if err != nil {
		return nil, types.NewError(err, types.ErrorCodeBadResponseBody)
	}
	usage = finalizeAstrBotUsage(c, info, responseText, usage)
	if strings.TrimSpace(responseText) == "" && !hasAstrBotUsage(usage) {
		return nil, types.NewError(errors.New("AstrBot returned an empty response"), types.ErrorCodeEmptyResponse)
	}

	openAIResponse := dto.OpenAITextResponse{
		Id:      buildAstrBotResponseID(c, info),
		Object:  "chat.completion",
		Created: common.GetTimestamp(),
		Model:   resolveAstrBotModel(info, ""),
		Usage:   *usage,
		Choices: []dto.OpenAITextResponseChoice{
			{
				Index: 0,
				Message: dto.Message{
					Role:    "assistant",
					Content: responseText,
				},
				FinishReason: finishReason,
			},
		},
	}
	jsonResponse, err := common.Marshal(openAIResponse)
	if err != nil {
		return nil, types.NewError(err, types.ErrorCodeBadResponseBody)
	}
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(resp.StatusCode)
	_, _ = c.Writer.Write(jsonResponse)
	return usage, nil
}

func astrBotStreamHandler(c *gin.Context, info *relaycommon.RelayInfo, resp *http.Response) (*dto.Usage, *types.NewAPIError) {
	defer service.CloseResponseBodyGracefully(resp)

	helper.SetEventStreamHeaders(c)

	responseID := buildAstrBotResponseID(c, info)
	modelName := resolveAstrBotModel(info, "")
	createdAt := common.GetTimestamp()
	responseText := ""
	finishReason := "stop"
	started := false
	var upstreamErr *types.NewAPIError
	usage := &dto.Usage{}

	err := scanAstrBotStream(resp.Body, func(event astrBotStreamEvent) error {
		if event.Err != nil {
			upstreamErr = event.Err
			if !started {
				return event.Err
			}
			return errStopAstrBotStream
		}
		if event.Usage != nil {
			usage = mergeAstrBotUsage(usage, event.Usage)
		}
		if event.FinishReason != "" {
			finishReason = event.FinishReason
		}
		if event.Text != "" {
			delta := appendAstrBotText(&responseText, event.Text)
			if delta != "" {
				if !started {
					if err := helper.ObjectData(c, helper.GenerateStartEmptyResponse(responseID, createdAt, modelName, nil)); err != nil {
						return err
					}
					started = true
				}
				info.SetFirstResponseTime()
				info.ReceivedResponseCount++

				chunk := dto.ChatCompletionsStreamResponse{
					Id:      responseID,
					Object:  "chat.completion.chunk",
					Created: createdAt,
					Model:   modelName,
					Choices: []dto.ChatCompletionsStreamResponseChoice{
						{
							Index: 0,
						},
					},
				}
				chunk.Choices[0].Delta.SetContentString(delta)
				if err := helper.ObjectData(c, chunk); err != nil {
					return err
				}
			}
		}
		if event.Done {
			return errStopAstrBotStream
		}
		return nil
	})
	if upstreamErr != nil && !started {
		return nil, upstreamErr
	}
	if err != nil {
		return nil, types.NewError(err, types.ErrorCodeBadResponseBody)
	}

	usage = finalizeAstrBotUsage(c, info, responseText, usage)
	if !started && strings.TrimSpace(responseText) == "" && !hasAstrBotUsage(usage) {
		return nil, types.NewError(errors.New("AstrBot returned an empty response"), types.ErrorCodeEmptyResponse)
	}
	if !started {
		if err := helper.ObjectData(c, helper.GenerateStartEmptyResponse(responseID, createdAt, modelName, nil)); err != nil {
			return nil, types.NewError(err, types.ErrorCodeBadResponseBody)
		}
	}
	if err := helper.ObjectData(c, helper.GenerateStopResponse(responseID, createdAt, modelName, finishReason)); err != nil {
		return nil, types.NewError(err, types.ErrorCodeBadResponseBody)
	}
	if shouldIncludeAstrBotStreamUsage(info) {
		if err := helper.ObjectData(c, helper.GenerateFinalUsageResponse(responseID, createdAt, modelName, *usage)); err != nil {
			return nil, types.NewError(err, types.ErrorCodeBadResponseBody)
		}
	}
	helper.Done(c)
	return usage, nil
}

func scanAstrBotStream(body io.Reader, handle func(event astrBotStreamEvent) error) error {
	scanner := helper.NewStreamScanner(body)
	scanner.Split(bufio.ScanLines)

	var eventName string
	dataLines := make([]string, 0, 4)
	flush := func() error {
		if eventName == "" && len(dataLines) == 0 {
			return nil
		}
		event := parseAstrBotEvent(eventName, dataLines)
		eventName = ""
		dataLines = dataLines[:0]
		if handle == nil {
			return nil
		}
		if err := handle(event); err != nil {
			if errors.Is(err, errStopAstrBotStream) {
				return errStopAstrBotStream
			}
			return err
		}
		return nil
	}

	for scanner.Scan() {
		line := strings.TrimRight(scanner.Text(), "\r")
		if line == "" {
			if err := flush(); err != nil {
				if errors.Is(err, errStopAstrBotStream) {
					return nil
				}
				return err
			}
			continue
		}
		if strings.HasPrefix(line, ":") {
			continue
		}
		switch {
		case strings.HasPrefix(line, "event:"):
			eventName = strings.TrimSpace(line[len("event:"):])
		case strings.HasPrefix(line, "data:"):
			dataLine := line[len("data:"):]
			if strings.HasPrefix(dataLine, " ") {
				dataLine = dataLine[1:]
			}
			dataLines = append(dataLines, dataLine)
		default:
			dataLines = append(dataLines, line)
		}
	}
	if err := scanner.Err(); err != nil {
		return err
	}
	if err := flush(); err != nil {
		if errors.Is(err, errStopAstrBotStream) {
			return nil
		}
		return err
	}
	return nil
}

func parseAstrBotEvent(eventName string, dataLines []string) astrBotStreamEvent {
	payload := strings.Join(dataLines, "\n")
	trimmedPayload := strings.TrimSpace(payload)
	if trimmedPayload == "" && payload == "" {
		return astrBotStreamEvent{}
	}
	if trimmedPayload == "[DONE]" {
		return astrBotStreamEvent{
			Done:         true,
			FinishReason: "stop",
		}
	}
	if !json.Valid([]byte(trimmedPayload)) {
		return astrBotStreamEvent{
			Text: payload,
		}
	}

	result := gjson.Parse(trimmedPayload)
	if err := parseAstrBotError(eventName, result); err != nil {
		return astrBotStreamEvent{Err: err}
	}
	streamEvent := astrBotStreamEvent{
		Text:         parseAstrBotText(result),
		Usage:        parseAstrBotUsage(result),
		Done:         parseAstrBotDone(eventName, result),
		FinishReason: parseAstrBotFinishReason(result),
	}
	if streamEvent.Done && streamEvent.FinishReason == "" {
		streamEvent.FinishReason = "stop"
	}
	return streamEvent
}

func parseAstrBotError(eventName string, result gjson.Result) *types.NewAPIError {
	isErrorEvent := strings.Contains(strings.ToLower(strings.TrimSpace(eventName)), "error")
	if !isErrorEvent {
		eventType := strings.ToLower(strings.TrimSpace(result.Get("type").String()))
		if eventType == "error" || eventType == "failed" {
			isErrorEvent = true
		}
		if result.Get("error").Exists() {
			isErrorEvent = true
		}
		if result.Get("success").Exists() && !result.Get("success").Bool() {
			isErrorEvent = true
		}
		status := strings.ToLower(strings.TrimSpace(result.Get("status").String()))
		if status == "error" || status == "failed" {
			isErrorEvent = true
		}
	}
	if !isErrorEvent {
		return nil
	}

	messagePaths := []string{
		"error.message",
		"error.msg",
		"error",
		"message",
		"msg",
		"detail",
		"data.error.message",
		"data.error.msg",
		"data.error",
		"data",
		"data.message",
		"data.msg",
	}
	message := ""
	for _, path := range messagePaths {
		message = extractAstrBotTextValue(result.Get(path))
		if message != "" {
			break
		}
	}
	if message == "" {
		message = "AstrBot stream returned an error event"
	}
	return types.NewOpenAIError(errors.New(message), types.ErrorCodeBadResponseBody, http.StatusBadGateway)
}

func parseAstrBotText(result gjson.Result) string {
	paths := []string{
		"text",
		"content",
		"message",
		"delta",
		"data",
		"data.text",
		"data.content",
		"data.message",
		"data.delta",
		"data.output",
		"choices.0.delta.content",
		"choices.0.message.content",
	}
	for _, path := range paths {
		if text := extractAstrBotTextValue(result.Get(path)); text != "" {
			return text
		}
	}
	return ""
}

func extractAstrBotTextValue(result gjson.Result) string {
	if !result.Exists() || result.Type == gjson.Null {
		return ""
	}
	switch result.Type {
	case gjson.String:
		return result.String()
	case gjson.Number, gjson.True, gjson.False:
		return result.Raw
	}
	if result.IsArray() {
		items := result.Array()
		parts := make([]string, 0, len(items))
		for _, item := range items {
			if text := extractAstrBotTextValue(item); text != "" {
				parts = append(parts, text)
			}
		}
		return strings.Join(parts, "\n")
	}
	for _, path := range []string{"text", "content", "message", "delta"} {
		if text := extractAstrBotTextValue(result.Get(path)); text != "" {
			return text
		}
	}
	return ""
}

func parseAstrBotUsage(result gjson.Result) *dto.Usage {
	paths := []string{
		"usage",
		"data.usage",
		"meta.usage",
		"data.meta.usage",
	}
	for _, path := range paths {
		if usage := parseAstrBotUsageObject(result.Get(path)); hasAstrBotUsage(usage) {
			return usage
		}
	}
	for _, path := range []string{"token_usage", "data.token_usage", "meta.token_usage", "data.meta.token_usage"} {
		if usage := parseAstrBotTokenUsage(result.Get(path)); hasAstrBotUsage(usage) {
			return usage
		}
	}
	return nil
}

func parseAstrBotUsageObject(usageResult gjson.Result) *dto.Usage {
	if !usageResult.Exists() || !usageResult.IsObject() {
		return nil
	}
	usage := &dto.Usage{
		PromptTokens:     int(firstAstrBotInt(usageResult.Get("prompt_tokens"), usageResult.Get("input_tokens"), usageResult.Get("input_count"))),
		CompletionTokens: int(firstAstrBotInt(usageResult.Get("completion_tokens"), usageResult.Get("output_tokens"), usageResult.Get("output_count"))),
		TotalTokens:      int(firstAstrBotInt(usageResult.Get("total_tokens"), usageResult.Get("token_count"))),
	}
	if usage.TotalTokens == 0 {
		usage.TotalTokens = usage.PromptTokens + usage.CompletionTokens
	}
	return usage
}

func parseAstrBotTokenUsage(usageResult gjson.Result) *dto.Usage {
	if !usageResult.Exists() || !usageResult.IsObject() {
		return nil
	}
	promptTokens := firstAstrBotInt(
		usageResult.Get("prompt_tokens"),
		usageResult.Get("input_tokens"),
		usageResult.Get("input"),
		usageResult.Get("input_count"),
	)
	if promptTokens == 0 {
		for key, value := range usageResult.Map() {
			if strings.HasPrefix(strings.ToLower(strings.TrimSpace(key)), "input_") {
				promptTokens += value.Int()
			}
		}
	}
	completionTokens := firstAstrBotInt(
		usageResult.Get("completion_tokens"),
		usageResult.Get("output_tokens"),
		usageResult.Get("output"),
		usageResult.Get("output_count"),
	)
	if completionTokens == 0 {
		for key, value := range usageResult.Map() {
			if strings.HasPrefix(strings.ToLower(strings.TrimSpace(key)), "output_") {
				completionTokens += value.Int()
			}
		}
	}
	totalTokens := firstAstrBotInt(
		usageResult.Get("total_tokens"),
		usageResult.Get("total"),
		usageResult.Get("token_count"),
	)
	if totalTokens == 0 {
		totalTokens = promptTokens + completionTokens
	}
	return &dto.Usage{
		PromptTokens:     int(promptTokens),
		CompletionTokens: int(completionTokens),
		TotalTokens:      int(totalTokens),
	}
}

func firstAstrBotInt(values ...gjson.Result) int64 {
	for _, value := range values {
		if value.Exists() {
			return value.Int()
		}
	}
	return 0
}

func parseAstrBotDone(eventName string, result gjson.Result) bool {
	if result.Get("done").Bool() || result.Get("finished").Bool() || result.Get("data.done").Bool() || result.Get("data.finished").Bool() {
		return true
	}
	switch strings.ToLower(strings.TrimSpace(result.Get("type").String())) {
	case "complete", "completed", "end", "done", "finish", "finished":
		return true
	}
	if parseAstrBotFinishReason(result) != "" {
		return true
	}
	eventName = strings.ToLower(strings.TrimSpace(eventName))
	return strings.Contains(eventName, "done") || strings.Contains(eventName, "finish") || strings.Contains(eventName, "complete") || strings.Contains(eventName, "end")
}

func parseAstrBotFinishReason(result gjson.Result) string {
	for _, path := range []string{"finish_reason", "data.finish_reason", "reason", "data.reason"} {
		if value := strings.TrimSpace(result.Get(path).String()); value != "" {
			return value
		}
	}
	return ""
}

func appendAstrBotText(accumulator *string, chunk string) string {
	if chunk == "" {
		return ""
	}
	current := *accumulator
	if current != "" {
		if strings.HasPrefix(chunk, current) {
			chunk = strings.TrimPrefix(chunk, current)
		} else if strings.HasPrefix(current, chunk) {
			return ""
		}
	}
	*accumulator += chunk
	return chunk
}

func mergeAstrBotUsage(current *dto.Usage, next *dto.Usage) *dto.Usage {
	if current == nil {
		current = &dto.Usage{}
	}
	if next == nil {
		return current
	}
	if next.PromptTokens != 0 {
		current.PromptTokens = next.PromptTokens
	}
	if next.CompletionTokens != 0 {
		current.CompletionTokens = next.CompletionTokens
	}
	if next.TotalTokens != 0 {
		current.TotalTokens = next.TotalTokens
	}
	if current.TotalTokens == 0 {
		current.TotalTokens = current.PromptTokens + current.CompletionTokens
	}
	return current
}

func finalizeAstrBotUsage(c *gin.Context, info *relaycommon.RelayInfo, responseText string, usage *dto.Usage) *dto.Usage {
	modelName := resolveAstrBotModel(info, "")
	estimatePromptTokens := 0
	if info != nil {
		estimatePromptTokens = info.GetEstimatePromptTokens()
	}
	if !hasAstrBotUsage(usage) {
		return service.ResponseText2Usage(c, responseText, modelName, estimatePromptTokens)
	}
	if usage.PromptTokens == 0 && estimatePromptTokens > 0 {
		usage.PromptTokens = estimatePromptTokens
	}
	if usage.TotalTokens == 0 {
		usage.TotalTokens = usage.PromptTokens + usage.CompletionTokens
	}
	return usage
}

func hasAstrBotUsage(usage *dto.Usage) bool {
	return usage != nil && (usage.PromptTokens > 0 || usage.CompletionTokens > 0 || usage.TotalTokens > 0)
}

func shouldIncludeAstrBotStreamUsage(info *relaycommon.RelayInfo) bool {
	if info == nil {
		return false
	}
	if info.ShouldIncludeUsage {
		return true
	}
	request, ok := info.Request.(*dto.GeneralOpenAIRequest)
	return ok && request.StreamOptions != nil && request.StreamOptions.IncludeUsage
}

func buildAstrBotResponseID(c *gin.Context, info *relaycommon.RelayInfo) string {
	requestID := ""
	if info != nil {
		requestID = strings.TrimSpace(info.RequestId)
	}
	if requestID == "" && c != nil {
		requestID = strings.TrimSpace(c.GetString(common.RequestIdKey))
	}
	if requestID == "" {
		requestID = common.NewRequestId()
	}
	return "chatcmpl-" + requestID
}
