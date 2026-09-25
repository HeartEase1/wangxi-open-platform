package controller

import (
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
)

type HomeStatsResponse struct {
	Today                model.UsageOverviewPeriod `json:"today"`
	Last30Days           model.UsageOverviewPeriod `json:"last_30_days"`
	TotalRegisteredUsers int64                     `json:"total_registered_users"`
}

func GetHomeStats(c *gin.Context) {
	now := time.Now()
	todayStart := time.Date(
		now.Year(),
		now.Month(),
		now.Day(),
		0,
		0,
		0,
		0,
		now.Location(),
	)
	last30DaysStart := todayStart.AddDate(0, 0, -29)

	today, err := model.GetUsageOverviewPeriod(todayStart.Unix(), now.Unix(), 10)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	last30Days, err := model.GetUsageOverviewPeriod(last30DaysStart.Unix(), now.Unix(), 10)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	totalRegisteredUsers, err := model.CountRegisteredUsers()
	if err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, HomeStatsResponse{
		Today:                today,
		Last30Days:           last30Days,
		TotalRegisteredUsers: totalRegisteredUsers,
	})
}
