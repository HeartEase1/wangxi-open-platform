package astrbot

type ChatRequest struct {
	Username         string `json:"username,omitempty"`
	SessionID        string `json:"session_id"`
	Message          string `json:"message"`
	ConfigID         string `json:"config_id,omitempty"`
	ConfigName       string `json:"config_name,omitempty"`
	SelectedProvider string `json:"selected_provider,omitempty"`
	SelectedModel    string `json:"selected_model,omitempty"`
	EnableStreaming  bool   `json:"enable_streaming"`
}
