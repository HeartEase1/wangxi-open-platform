/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney as MjProxyIcon,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text } = Typography;

const EMPTY_HOME_STATS = {
  today: { tokens: 0, requests: 0, top_users: [] },
  last_30_days: { tokens: 0, requests: 0, top_users: [] },
  total_registered_users: 0,
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [homeStats, setHomeStats] = useState(EMPTY_HOME_STATS);
  const [homeStatsLoading, setHomeStatsLoading] = useState(true);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');
  const tr = (zh, en) => (isChinese ? zh : t(en));
  const formatStatNumber = (value) =>
    Intl.NumberFormat().format(Number(value) || 0);
  const starTraceArchitecture = [
    {
      title: tr('\u57fa\u5ea7\u6a21\u578b', 'Base model'),
      value: 'Qwen3.5-27B',
    },
    {
      title: tr('\u5fae\u8c03\u65b9\u6848', 'Fine-tuning'),
      value: tr(
        '\u57fa\u4e8e LoRA\uff08\u4f4e\u79e9\u9002\u914d\uff09\u6280\u672f\uff0c\u5bf9\u6bcf\u4e2a\u89d2\u8272\u72ec\u7acb\u8bad\u7ec3\u8f7b\u91cf\u7ea7\u9002\u914d\u5668\u5c42\u3002',
        'LoRA adapters are trained independently for each character with lightweight role-specific layers.',
      ),
    },
    {
      title: tr('\u670d\u52a1\u6846\u67b6', 'Serving framework'),
      value: tr(
        '\u661f\u6eaf\u6846\u67b6\u8d1f\u8d23\u6a21\u578b\u8def\u7531\u3001\u4e0a\u4e0b\u6587\u7ba1\u7406\u548c API \u54cd\u5e94\u5206\u53d1\u3002',
        'The StarTrace framework handles routing, context, and API response dispatch.',
      ),
    },
    {
      title: tr('\u6a21\u578b\u7f16\u53f7\u89c4\u8303', 'Model naming'),
      value: 'StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7]',
      note: 'StarTrace-Zhongli-v1',
    },
  ];
  const starTraceCallChain = [
    tr('\u5f00\u53d1\u8005\u8bf7\u6c42', 'Developer request'),
    tr('\u661f\u6eaf\u5f00\u653e\u5e73\u53f0', 'StarTrace Open Platform'),
    tr('\u661f\u6eaf\u6846\u67b6', 'StarTrace Framework'),
    tr('\u661f\u6eaf\u5927\u6a21\u578b', 'StarTrace LLM'),
    tr('\u89d2\u8272\u5316\u56de\u590d', 'Role-tailored reply'),
  ];

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const loadHomeStats = async () => {
    try {
      setHomeStatsLoading(true);
      const res = await API.get('/api/home_stats');
      const { success, data } = res.data;
      if (success && data) {
        setHomeStats(data);
      } else {
        setHomeStats(EMPTY_HOME_STATS);
      }
    } catch (error) {
      console.error('Failed to load home stats:', error);
      setHomeStats(EMPTY_HOME_STATS);
    } finally {
      setHomeStatsLoading(false);
    }
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    loadHomeStats().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='classic-page-fill classic-home-page w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='classic-home-default w-full overflow-x-hidden'>
          {/* Banner 部分 */}
          <div className='classic-home-hero w-full border-b border-semi-color-border relative overflow-x-hidden'>
            {/* 背景模糊晕染球 */}
            <div className='blur-ball blur-ball-indigo' />
            <div className='blur-ball blur-ball-teal' />
            <div className='flex items-center justify-center px-4 pt-24 pb-8'>
              {/* 居中内容区 */}
              <div className='flex flex-col items-center justify-center text-center max-w-4xl mx-auto'>
                <div className='flex flex-col items-center justify-center mb-6 md:mb-8'>
                  <h1
                    className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-semi-color-text-0 leading-tight ${isChinese ? 'tracking-wide md:tracking-wider' : ''}`}
                  >
                    <>
                      {tr(
                        '\u661f\u6eaf(StarTrace) \u5f00\u653e\u5e73\u53f0',
                        'StarTrace Open Platform',
                      )}
                      <br />
                      <span className='shine-text'>
                        {tr(
                          '\u661f\u6eaf\u5927\u6a21\u578b(StarTrace LLM)',
                          'StarTrace LLM',
                        )}
                      </span>
                    </>
                  </h1>
                  <p className='text-base md:text-lg lg:text-xl text-semi-color-text-1 mt-4 md:mt-6 max-w-xl'>
                    {tr(
                      '\u201c\u661f\u6eaf\u5927\u6a21\u578b\uff0c\u8ba9\u6bcf\u4e2a\u89d2\u8272\u90fd\u6709\u7075\u9b42\u3002\u201d',
                      '"StarTrace LLM gives every character a soul."',
                    )}
                  </p>
                  <p className='text-sm text-semi-color-text-2 mt-3 max-w-2xl'>
                    {tr(
                      '\u2014\u2014\u661f\u9645\u548c\u5e73\u516c\u53f8\u00b7\u5f80\u6614\u9879\u76ee\u7ec4\uff0c\u6355\u6349\u6570\u5b57\u661f\u5c18\u4e2d\u7684\u4eba\u5f71\u3002',
                      'Echoes Team, Interastral Peace Corporation. Capturing silhouettes in digital stardust.',
                    )}
                  </p>
                  <div className='mt-4 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-2 text-sm font-semibold text-[#b45309]'>
                    {tr(
                      'StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7]\u7cfb\u5217\u5b8c\u5168\u516c\u76ca\u514d\u8d39',
                      'StarTrace-[RoleCode]-[Version] series is fully public-benefit and free',
                    )}
                  </div>
                  <p className='text-sm text-semi-color-text-2 mt-3 max-w-xl'>
                    {tr(
                      '\u5f00\u653e\u5e73\u53f0 OpenAI \u517c\u5bb9\u63a5\u5165\uff0c\u53ea\u9700\u5c06\u57fa\u5740\u66ff\u6362\u4e3a\uff1a',
                      'OpenAI-compatible access, just replace your base URL with:',
                    )}
                  </p>
                  {/* BASE URL 与端点选择 */}
                  <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full mt-4 md:mt-6 max-w-md'>
                    <Input
                      readonly
                      value={serverAddress}
                      className='flex-1 !rounded-full'
                      size={isMobile ? 'default' : 'large'}
                      suffix={
                        <div className='flex items-center gap-2'>
                          <ScrollList
                            bodyHeight={32}
                            style={{ border: 'unset', boxShadow: 'unset' }}
                          >
                            <ScrollItem
                              mode='wheel'
                              cycled={true}
                              list={endpointItems}
                              selectedIndex={endpointIndex}
                              onSelect={({ index }) => setEndpointIndex(index)}
                            />
                          </ScrollList>
                          <Button
                            type='primary'
                            onClick={handleCopyBaseURL}
                            icon={<IconCopy />}
                            className='!rounded-full'
                          />
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className='flex flex-row gap-4 justify-center items-center'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='primary'
                      size={isMobile ? 'default' : 'large'}
                      className='!rounded-3xl px-8 py-2'
                      icon={<IconPlay />}
                    >
                      {t('获取密钥')}
                    </Button>
                  </Link>
                  {isDemoSiteMode && statusState?.status?.version ? (
                    <Button
                      size={isMobile ? 'default' : 'large'}
                      className='flex items-center !rounded-3xl px-6 py-2'
                      icon={<IconGithubLogo />}
                      onClick={() =>
                        window.open(
                          'https://github.com/QuantumNous/new-api',
                          '_blank',
                        )
                      }
                    >
                      {statusState.status.version}
                    </Button>
                  ) : (
                    docsLink && (
                      <Button
                        size={isMobile ? 'default' : 'large'}
                        className='flex items-center !rounded-3xl px-6 py-2'
                        icon={<IconFile />}
                        onClick={() => window.open(docsLink, '_blank')}
                      >
                        {t('文档')}
                      </Button>
                    )
                  )}
                </div>

                {/* 框架兼容性图标 */}
                <div className='mt-12 md:mt-16 lg:mt-20 w-full'>
                  <div className='flex items-center mb-6 md:mb-8 justify-center'>
                    <Text
                      type='tertiary'
                      className='text-lg md:text-xl lg:text-2xl font-light'
                    >
                      {t('支持众多的大模型供应商')}
                    </Text>
                  </div>
                  <div className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto px-4'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Moonshot size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <OpenAI size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <XAI size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Zhipu.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Volcengine.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Cohere.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Claude.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Gemini.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Suno size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Minimax.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Wenxin.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Spark.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Qingyan.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <DeepSeek.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Qwen.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <MjProxyIcon size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Grok size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <AzureAI.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Hunyuan.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Xinference.Color size={40} />
                    </div>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
                      <Typography.Text className='!text-lg sm:!text-xl md:!text-2xl lg:!text-3xl font-bold'>
                        30+
                      </Typography.Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full border-b border-semi-color-border bg-semi-color-bg-0/80'>
            <div className='max-w-6xl mx-auto px-4 py-10 md:py-12'>
              <div className='overflow-hidden rounded-3xl border border-semi-color-border bg-semi-color-bg-1 shadow-sm'>
                <div className='grid gap-8 px-5 py-6 lg:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-8'>
                  <div className='space-y-5'>
                    <div className='inline-flex items-center rounded-full border border-[#f59e0b]/20 bg-[#f59e0b]/10 px-3 py-1 text-xs font-medium text-[#b45309]'>
                      {tr(
                        '\u661f\u6eaf\u5927\u6a21\u578b(StarTrace LLM)',
                        'StarTrace LLM',
                      )}
                    </div>
                    <div className='space-y-3'>
                      <div className='text-xl md:text-2xl font-semibold text-semi-color-text-0'>
                        {tr(
                          '\u201c\u661f\u6eaf\u5927\u6a21\u578b\uff0c\u8ba9\u6bcf\u4e2a\u89d2\u8272\u90fd\u6709\u7075\u9b42\u3002\u201d',
                          '"StarTrace LLM gives every character a soul."',
                        )}
                      </div>
                      <div className='text-sm text-semi-color-text-2 leading-6'>
                        {tr(
                          '\u2014\u2014\u661f\u9645\u548c\u5e73\u516c\u53f8\u00b7\u5f80\u6614\u9879\u76ee\u7ec4\uff0c\u6355\u6349\u6570\u5b57\u661f\u5c18\u4e2d\u7684\u4eba\u5f71\u3002',
                          'Echoes Team, Interastral Peace Corporation. Capturing silhouettes in digital stardust.',
                        )}
                      </div>
                      <div className='inline-flex rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-3 py-1 text-sm font-semibold text-[#b45309]'>
                        {tr(
                          'StarTrace-[\u89d2\u8272\u4ee3\u53f7]-[\u7248\u672c\u53f7]\u7cfb\u5217\u5b8c\u5168\u516c\u76ca\u514d\u8d39',
                          'StarTrace-[RoleCode]-[Version] series is fully public-benefit and free',
                        )}
                      </div>
                    </div>

                    <div className='rounded-2xl border border-semi-color-border bg-semi-color-fill-0 px-4 py-4'>
                      <div className='text-xs font-semibold tracking-[0.18em] uppercase text-semi-color-text-2'>
                        {tr('\u8c03\u7528\u94fe\u8def', 'Invocation chain')}
                      </div>
                      <div className='mt-3 flex flex-wrap items-center gap-2'>
                        {starTraceCallChain.map((item, index) => (
                          <React.Fragment key={`${item}-${index}`}>
                            <span className='rounded-full border border-semi-color-border bg-semi-color-bg-0 px-3 py-1 text-sm text-semi-color-text-0'>
                              {item}
                            </span>
                            {index < starTraceCallChain.length - 1 && (/*
                              <span className='text-semi-color-text-2'>→</span>
                            */ <span className='text-semi-color-text-2'>{'->'}</span>)}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-3 md:grid-cols-2'>
                    {starTraceArchitecture.map((item) => (
                      <div
                        key={item.title}
                        className='rounded-2xl border border-semi-color-border bg-semi-color-bg-0 px-4 py-4'
                      >
                        <div className='text-xs font-medium tracking-[0.14em] uppercase text-semi-color-text-2'>
                          {item.title}
                        </div>
                        <div className='mt-3 text-sm md:text-base font-semibold leading-6 text-semi-color-text-0'>
                          {item.value}
                        </div>
                        {item.note ? (
                          <div className='mt-2 text-xs text-semi-color-text-2'>
                            e.g. {item.note}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full border-b border-semi-color-border bg-semi-color-bg-0/80'>
            <div className='max-w-6xl mx-auto px-4 py-10 md:py-12'>
              <div className='overflow-hidden rounded-3xl border border-semi-color-border bg-semi-color-bg-1 shadow-sm'>
                <div className='flex flex-col gap-2 border-b border-semi-color-border px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6'>
                  <div>
                    <div className='text-lg md:text-xl font-semibold text-semi-color-text-0'>
                      {tr('调用量概览', 'Call volume overview')}
                    </div>
                    <div className='text-sm text-semi-color-text-2 mt-1'>
                      {tr('今日与近 30 天', 'Today and the last 30 days')}
                    </div>
                  </div>
                  <div className='text-xs md:text-sm text-semi-color-text-2'>
                    {tr('公开平台实时数据', 'Public platform activity')}
                  </div>
                </div>

                <div className='grid gap-3 px-4 py-4 md:grid-cols-2 xl:grid-cols-5 md:px-6'>
                  {[
                    {
                      label: tr('近 30 天 Token', 'Last 30 days tokens'),
                      value: homeStats.last_30_days.tokens,
                      unit: tr('Token', 'tokens'),
                    },
                    {
                      label: tr('近 30 天请求数', 'Last 30 days requests'),
                      value: homeStats.last_30_days.requests,
                      unit: tr('请求', 'requests'),
                    },
                    {
                      label: tr('今日 Token', 'Today tokens'),
                      value: homeStats.today.tokens,
                      unit: tr('Token', 'tokens'),
                    },
                    {
                      label: tr('今日请求数', 'Today requests'),
                      value: homeStats.today.requests,
                      unit: tr('请求', 'requests'),
                    },
                    {
                      label: tr('总注册人数', 'Total registered users'),
                      value: homeStats.total_registered_users,
                      unit: tr('用户', 'users'),
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className='rounded-2xl border border-semi-color-border bg-semi-color-fill-0 px-4 py-4'
                    >
                      <div className='text-xs text-semi-color-text-2'>
                        {item.label}
                      </div>
                      <div className='mt-2 text-2xl font-semibold text-semi-color-text-0 tabular-nums'>
                        {homeStatsLoading ? '...' : formatStatNumber(item.value)}
                      </div>
                      <div className='mt-1 text-xs text-semi-color-text-2'>
                        {homeStatsLoading
                          ? t('Loading...')
                          : `${formatStatNumber(item.value)} ${item.unit}`}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='grid gap-4 border-t border-semi-color-border px-4 py-4 xl:grid-cols-2 md:px-6 md:py-6'>
                  {[
                    {
                      title: tr(
                        '近 30 天 Token Top 10 用户',
                        'Top 10 users in the last 30 days',
                      ),
                      description: tr(
                        '按累计 Token 用量排序',
                        'Ranked by total token usage',
                      ),
                      items: homeStats.last_30_days.top_users,
                    },
                    {
                      title: tr('今日 Token Top 10 用户', 'Top 10 users today'),
                      description: tr(
                        '按累计 Token 用量排序',
                        'Ranked by total token usage',
                      ),
                      items: homeStats.today.top_users,
                    },
                  ].map((board) => (
                    <div
                      key={board.title}
                      className='overflow-hidden rounded-2xl border border-semi-color-border'
                    >
                      <div className='border-b border-semi-color-border px-4 py-3'>
                        <div className='text-sm font-semibold text-semi-color-text-0'>
                          {board.title}
                        </div>
                        <div className='mt-1 text-xs text-semi-color-text-2'>
                          {board.description}
                        </div>
                      </div>

                      <div>
                        {homeStatsLoading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between gap-3 border-b border-semi-color-border px-4 py-3 last:border-b-0'
                            >
                              <div className='text-sm text-semi-color-text-2'>
                                #{index + 1}
                              </div>
                              <div className='flex-1 text-sm text-semi-color-text-2'>
                                {t('Loading...')}
                              </div>
                            </div>
                          ))
                        ) : board.items.length === 0 ? (
                          <div className='px-4 py-6 text-sm text-semi-color-text-2'>
                            {tr(
                              '当前时间范围内暂无调用数据。',
                              'No usage data available for this time range.',
                            )}
                          </div>
                        ) : (
                          board.items.map((item, index) => (
                            <div
                              key={`${board.title}-${item.username}-${index}`}
                              className='flex items-center justify-between gap-3 border-b border-semi-color-border px-4 py-3 last:border-b-0'
                            >
                              <div className='w-8 text-sm font-medium text-semi-color-text-2 tabular-nums'>
                                #{index + 1}
                              </div>
                              <div className='min-w-0 flex-1'>
                                <div className='truncate text-sm font-medium text-semi-color-text-0'>
                                  {item.username}
                                </div>
                                <div className='mt-1 text-xs text-semi-color-text-2'>
                                  {formatStatNumber(item.requests)}{' '}
                                  {tr('请求', 'requests')}
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='text-sm font-semibold text-semi-color-text-0 tabular-nums'>
                                  {formatStatNumber(item.tokens)}
                                </div>
                                <div className='mt-1 text-xs text-semi-color-text-2'>
                                  {tr('Token', 'tokens')}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='classic-page-fill overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
