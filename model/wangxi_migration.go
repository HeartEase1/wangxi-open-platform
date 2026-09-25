package model

import (
	"fmt"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/relaykit/dto"
	"gorm.io/gorm"
)

// migrateWangxiChannels disambiguates the fork's old AstrBot ID from upstream
// Sub2API. Only records carrying an AstrBot configuration are migrated. It runs
// before the channel cache starts and is safe to repeat after a restart.
func migrateWangxiChannels(db *gorm.DB) error {
	return db.Transaction(func(tx *gorm.DB) error {
		var channels []Channel
		if err := tx.Select("id", "settings").Where("type = ?", constant.ChannelTypeSub2API).Find(&channels).Error; err != nil {
			return err
		}
		for _, channel := range channels {
			if strings.TrimSpace(channel.OtherSettings) == "" {
				continue
			}
			var settings dto.ChannelOtherSettings
			if err := common.UnmarshalJsonStr(channel.OtherSettings, &settings); err != nil {
				return fmt.Errorf("cannot classify legacy channel %d: %w", channel.Id, err)
			}
			if strings.TrimSpace(settings.AstrBotConfigID) == "" && strings.TrimSpace(settings.AstrBotConfigName) == "" {
				continue
			}
			if err := tx.Model(&Channel{}).Where("id = ? AND type = ?", channel.Id, constant.ChannelTypeSub2API).Update("type", constant.ChannelTypeAstrBot).Error; err != nil {
				return err
			}
		}
		return nil
	})
}
