package model

type UsageOverviewLeaderboardItem struct {
	Username string `json:"username"`
	Tokens   int64  `json:"tokens"`
	Requests int64  `json:"requests"`
}

type UsageOverviewPeriod struct {
	Tokens   int64                        `json:"tokens"`
	Requests int64                        `json:"requests"`
	TopUsers []UsageOverviewLeaderboardItem `json:"top_users"`
}

func GetUsageOverviewPeriod(startTimestamp int64, endTimestamp int64, limit int) (UsageOverviewPeriod, error) {
	if limit <= 0 {
		limit = 10
	}

	period := UsageOverviewPeriod{
		TopUsers: make([]UsageOverviewLeaderboardItem, 0),
	}

	var summary struct {
		Tokens   int64 `gorm:"column:tokens"`
		Requests int64 `gorm:"column:requests"`
	}

	if err := DB.Table("quota_data").
		Select("COALESCE(SUM(token_used), 0) AS tokens, COALESCE(SUM(count), 0) AS requests").
		Where("created_at >= ? AND created_at <= ?", startTimestamp, endTimestamp).
		Scan(&summary).Error; err != nil {
		return period, err
	}

	period.Tokens = summary.Tokens
	period.Requests = summary.Requests

	if err := DB.Table("quota_data").
		Select("username, COALESCE(SUM(token_used), 0) AS tokens, COALESCE(SUM(count), 0) AS requests").
		Where("created_at >= ? AND created_at <= ? AND username <> ''", startTimestamp, endTimestamp).
		Group("username").
		Order("SUM(token_used) DESC").
		Order("SUM(count) DESC").
		Order("username ASC").
		Limit(limit).
		Scan(&period.TopUsers).Error; err != nil {
		return period, err
	}

	return period, nil
}

func CountRegisteredUsers() (int64, error) {
	var total int64
	err := DB.Model(&User{}).Count(&total).Error
	return total, err
}
