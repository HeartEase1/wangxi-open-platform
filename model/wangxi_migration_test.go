package model

import (
	"path/filepath"
	"testing"

	"github.com/QuantumNous/new-api/constant"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestMigrateWangxiChannelsPreservesRouting(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(filepath.Join(t.TempDir(), "channels.db")), &gorm.Config{})
	require.NoError(t, err)
	sqlDB, err := db.DB()
	require.NoError(t, err)
	t.Cleanup(func() { assert.NoError(t, sqlDB.Close()) })
	require.NoError(t, db.AutoMigrate(&Channel{}))
	channels := []Channel{
		{Id: 1, Type: 59, Key: "test-key", OtherSettings: `{"astrbot_config_id":"role-1"}`},
		{Id: 2, Type: 59, Key: "test-key", OtherSettings: `{"astrbot_config_name":"role-2"}`},
		{Id: 3, Type: 59, Key: "test-key", OtherSettings: `{"allow_service_tier":true}`},
		{Id: 4, Type: 1, Key: "test-key", OtherSettings: `{"astrbot_config_id":"unused"}`},
	}
	require.NoError(t, db.Create(&channels).Error)
	for range 2 {
		require.NoError(t, migrateWangxiChannels(db))
		var actual []Channel
		require.NoError(t, db.Order("id").Find(&actual).Error)
		require.Len(t, actual, 4)
		for i, expectedType := range []int{constant.ChannelTypeAstrBot, constant.ChannelTypeAstrBot, constant.ChannelTypeSub2API, constant.ChannelTypeOpenAI} {
			assert.Equal(t, expectedType, actual[i].Type)
			assert.Equal(t, channels[i].OtherSettings, actual[i].OtherSettings)
			assert.Equal(t, channels[i].Key, actual[i].Key)
		}
	}
	invalid := Channel{Id: 5, Type: 59, Key: "test-key", OtherSettings: "invalid-json"}
	require.NoError(t, db.Create(&invalid).Error)
	assert.ErrorContains(t, migrateWangxiChannels(db), "cannot classify legacy channel 5")
}
