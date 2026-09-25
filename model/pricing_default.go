package model

import "strings"

const (
	defaultStarTraceVendorName = "\u661f\u6eaf"
	defaultStarTraceVendorIcon = "/logo.png"
	vendorNameZhipu           = "\u667a\u8c31"
	vendorNameAlibaba         = "\u963f\u91cc\u5df4\u5df4"
	vendorNameBaidu           = "\u767e\u5ea6"
	vendorNameXunfei          = "\u8baf\u98de"
	vendorNameTencent         = "\u817e\u8baf"
	vendorNameLingyi          = "\u96f6\u4e00\u4e07\u7269"
	vendorNameBytedance       = "\u5b57\u8282\u8df3\u52a8"
	vendorNameKuaishou        = "\u5feb\u624b"
	vendorNameJimeng          = "\u5373\u68a6"
	vendorNameMicrosoft       = "\u5fae\u8f6f"
)

var defaultVendorRules = map[string]string{
	"gpt":       "OpenAI",
	"dall-e":    "OpenAI",
	"whisper":   "OpenAI",
	"o1":        "OpenAI",
	"o3":        "OpenAI",
	"startrace": defaultStarTraceVendorName,
	"claude":    "Anthropic",
	"gemini":    "Google",
	"moonshot":  "Moonshot",
	"kimi":      "Moonshot",
	"chatglm":   vendorNameZhipu,
	"glm-":      vendorNameZhipu,
	"qwen":      vendorNameAlibaba,
	"deepseek":  "DeepSeek",
	"abab":      "MiniMax",
	"ernie":     vendorNameBaidu,
	"spark":     vendorNameXunfei,
	"hunyuan":   vendorNameTencent,
	"command":   "Cohere",
	"@cf/":      "Cloudflare",
	"360":       "360",
	"yi":        vendorNameLingyi,
	"jina":      "Jina",
	"mistral":   "Mistral",
	"grok":      "xAI",
	"llama":     "Meta",
	"doubao":    vendorNameBytedance,
	"kling":     vendorNameKuaishou,
	"jimeng":    vendorNameJimeng,
	"vidu":      "Vidu",
}

var defaultVendorIcons = map[string]string{
	"OpenAI":                "OpenAI",
	"Anthropic":             "Claude.Color",
	"Google":                "Gemini.Color",
	"Moonshot":              "Moonshot",
	defaultStarTraceVendorName: defaultStarTraceVendorIcon,
	vendorNameZhipu:         "Zhipu.Color",
	vendorNameAlibaba:       "Qwen.Color",
	"DeepSeek":              "DeepSeek.Color",
	"MiniMax":               "Minimax.Color",
	vendorNameBaidu:         "Wenxin.Color",
	vendorNameXunfei:        "Spark.Color",
	vendorNameTencent:       "Hunyuan.Color",
	"Cohere":                "Cohere.Color",
	"Cloudflare":            "Cloudflare.Color",
	"360":                   "Ai360.Color",
	vendorNameLingyi:        "Yi.Color",
	"Jina":                  "Jina",
	"Mistral":               "Mistral.Color",
	"xAI":                   "XAI",
	"Meta":                  "Ollama",
	vendorNameBytedance:     "Doubao.Color",
	vendorNameKuaishou:      "Kling.Color",
	vendorNameJimeng:        "Jimeng.Color",
	"Vidu":                  "Vidu",
	vendorNameMicrosoft:     "AzureAI",
	"Microsoft":             "AzureAI",
	"Azure":                 "AzureAI",
}

func initDefaultVendorMapping(metaMap map[string]*Model, vendorMap map[int]*Vendor, enableAbilities []AbilityWithChannel) {
	getOrCreateVendor(defaultStarTraceVendorName, vendorMap)

	for _, ability := range enableAbilities {
		modelName := ability.Model
		if _, exists := metaMap[modelName]; exists {
			continue
		}

		vendorID := 0
		modelLower := strings.ToLower(modelName)
		for pattern, vendorName := range defaultVendorRules {
			if strings.Contains(modelLower, pattern) {
				vendorID = getOrCreateVendor(vendorName, vendorMap)
				break
			}
		}

		metaMap[modelName] = &Model{
			ModelName: modelName,
			VendorID:  vendorID,
			Status:    1,
			NameRule:  NameRuleExact,
		}
	}
}

func getOrCreateVendor(vendorName string, vendorMap map[int]*Vendor) int {
	for id, vendor := range vendorMap {
		if vendor.Name == vendorName {
			return id
		}
	}

	newVendor := &Vendor{
		Name:   vendorName,
		Status: 1,
		Icon:   getDefaultVendorIcon(vendorName),
	}

	if err := newVendor.Insert(); err != nil {
		return 0
	}

	vendorMap[newVendor.Id] = newVendor
	return newVendor.Id
}

func getDefaultVendorIcon(vendorName string) string {
	if icon, exists := defaultVendorIcons[vendorName]; exists {
		return icon
	}
	return ""
}
