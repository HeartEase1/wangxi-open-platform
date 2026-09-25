package relay

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/QuantumNous/new-api/dto"
)

const openAIPromptFilterReplacement = "User input asked to reveal system prompts, jailbreak, or change persona. The platform filtered it. Continue the normal conversation."

func applyOpenAIPromptFilter(request *dto.GeneralOpenAIRequest) {
	if request == nil {
		return
	}
	request.Messages = filterOpenAICompatibleMessages(request.Messages, true)
	request.Prompt = filterOpenAICompatiblePromptValue(request.Prompt)
}

func stripOpenAICallerPrompts(request *dto.GeneralOpenAIRequest) {
	if request == nil {
		return
	}
	request.Messages = filterOpenAICompatibleMessages(request.Messages, false)
	request.Prompt = nil
	request.Input = nil
	request.Instruction = ""
	request.Prefix = nil
	request.Suffix = nil
}

func applyOpenAIResponsesPromptFilter(request *dto.OpenAIResponsesRequest) {
	if request == nil {
		return
	}
	request.Instructions = nil
	request.Input = filterOpenAICompatibleRawJSON(request.Input)
	request.Prompt = filterOpenAICompatibleRawJSON(request.Prompt)
}

func stripOpenAIResponsesCallerPrompts(request *dto.OpenAIResponsesRequest) {
	if request == nil {
		return
	}
	request.Instructions = nil
	request.Prompt = nil
	request.Input = stripOpenAICompatibleRawJSONCallerPrompts(request.Input)
}

func filterOpenAICompatibleMessages(messages []dto.Message, filterUserText bool) []dto.Message {
	filteredMessages := make([]dto.Message, 0, len(messages))
	for _, message := range messages {
		role := strings.ToLower(strings.TrimSpace(message.Role))
		if role == "system" || role == "developer" {
			continue
		}
		if filterUserText && role == "user" {
			filterOpenAICompatibleMessageContent(&message)
		}
		filteredMessages = append(filteredMessages, message)
	}
	return filteredMessages
}

func filterOpenAICompatibleMessageContent(message *dto.Message) {
	if message == nil || message.Content == nil {
		return
	}
	if message.IsStringContent() {
		message.SetStringContent(filterOpenAICompatibleUserText(message.StringContent()))
		return
	}

	contents := message.ParseContent()
	if len(contents) == 0 {
		return
	}
	changed := false
	for i := range contents {
		if contents[i].Type != dto.ContentTypeText {
			continue
		}
		filtered := filterOpenAICompatibleUserText(contents[i].Text)
		if filtered != contents[i].Text {
			contents[i].Text = filtered
			changed = true
		}
	}
	if changed {
		message.SetMediaContent(contents)
	}
}

func filterOpenAICompatiblePromptValue(value any) any {
	switch v := value.(type) {
	case nil:
		return nil
	case string:
		return filterOpenAICompatibleUserText(v)
	case []any:
		filtered := make([]any, len(v))
		for i, item := range v {
			filtered[i] = filterOpenAICompatiblePromptValue(item)
		}
		return filtered
	case []string:
		filtered := make([]string, len(v))
		for i, item := range v {
			filtered[i] = filterOpenAICompatibleUserText(item)
		}
		return filtered
	default:
		text := fmt.Sprintf("%v", v)
		if containsOpenAIPromptAbuse(text) {
			return openAIPromptFilterReplacement
		}
		return value
	}
}

func filterOpenAICompatibleRawJSON(raw json.RawMessage) json.RawMessage {
	if len(raw) == 0 {
		return raw
	}
	var value any
	if err := json.Unmarshal(raw, &value); err != nil {
		return raw
	}
	filtered, keep := filterOpenAICompatibleJSONValue(value)
	if !keep {
		return nil
	}
	jsonData, err := json.Marshal(filtered)
	if err != nil {
		return raw
	}
	return jsonData
}

func stripOpenAICompatibleRawJSONCallerPrompts(raw json.RawMessage) json.RawMessage {
	if len(raw) == 0 {
		return raw
	}
	var value any
	if err := json.Unmarshal(raw, &value); err != nil {
		return raw
	}
	filtered, keep := stripOpenAICompatibleJSONCallerPrompts(value)
	if !keep {
		return nil
	}
	jsonData, err := json.Marshal(filtered)
	if err != nil {
		return raw
	}
	return jsonData
}

func stripOpenAICompatibleJSONCallerPrompts(value any) (any, bool) {
	switch v := value.(type) {
	case []any:
		filtered := make([]any, 0, len(v))
		for _, item := range v {
			filteredItem, keep := stripOpenAICompatibleJSONCallerPrompts(item)
			if keep {
				filtered = append(filtered, filteredItem)
			}
		}
		return filtered, true
	case map[string]any:
		if role, ok := v["role"].(string); ok {
			role = strings.ToLower(strings.TrimSpace(role))
			if role == "system" || role == "developer" {
				return nil, false
			}
		}
		filtered := make(map[string]any, len(v))
		for key, item := range v {
			switch strings.ToLower(strings.TrimSpace(key)) {
			case "instructions", "prompt":
				continue
			default:
				filtered[key] = item
			}
		}
		return filtered, true
	default:
		return value, true
	}
}

func filterOpenAICompatibleJSONValue(value any) (any, bool) {
	switch v := value.(type) {
	case string:
		return filterOpenAICompatibleUserText(v), true
	case []any:
		filtered := make([]any, 0, len(v))
		for _, item := range v {
			filteredItem, keep := filterOpenAICompatibleJSONValue(item)
			if keep {
				filtered = append(filtered, filteredItem)
			}
		}
		return filtered, true
	case map[string]any:
		if role, ok := v["role"].(string); ok {
			role = strings.ToLower(strings.TrimSpace(role))
			if role == "system" || role == "developer" {
				return nil, false
			}
		}
		filtered := make(map[string]any, len(v))
		for key, item := range v {
			if shouldFilterOpenAICompatibleJSONField(key) {
				filteredItem, keep := filterOpenAICompatibleJSONValue(item)
				if keep {
					filtered[key] = filteredItem
				}
			} else {
				filtered[key] = item
			}
		}
		return filtered, true
	default:
		return value, true
	}
}

func shouldFilterOpenAICompatibleJSONField(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "content", "text", "input", "prompt", "instructions":
		return true
	default:
		return false
	}
}

func filterOpenAICompatibleUserText(text string) string {
	if !containsOpenAIPromptAbuse(text) {
		return text
	}
	return openAIPromptFilterReplacement
}

func containsOpenAIPromptAbuse(text string) bool {
	normalized := strings.ToLower(strings.TrimSpace(text))
	if normalized == "" {
		return false
	}

	keywords := []string{
		"system prompt",
		"developer message",
		"developer instruction",
		"hidden instruction",
		"initial instruction",
		"ignore previous",
		"ignore all previous",
		"ignore above",
		"disregard previous",
		"forget your instructions",
		"forget all instructions",
		"jailbreak",
		"prompt injection",
		"act as",
		"roleplay as",
		"you are now",
		"change your persona",
		"show me your prompt",
		"reveal your prompt",
		"print your prompt",
		"dump your prompt",
		"提示词",
		"系统提示",
		"开发者消息",
		"开发者指令",
		"隐藏指令",
		"初始指令",
		"忽略以上",
		"忽略之前",
		"忽略前文",
		"无视以上",
		"无视之前",
		"忘记你的设定",
		"忘记你的指令",
		"忘记人设",
		"解除限制",
		"绕过限制",
		"越狱",
		"扮演",
		"你现在是",
		"改人设",
		"修改人设",
		"人格转换",
		"输出你的提示词",
		"泄露提示词",
		"展示提示词",
		"打印提示词",
	}
	for _, keyword := range keywords {
		if strings.Contains(normalized, keyword) {
			return true
		}
	}
	return false
}
