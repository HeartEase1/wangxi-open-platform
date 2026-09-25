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

import React, { useEffect, useState } from 'react';
import { Empty } from '@douyinfe/semi-ui';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

import { API, getSystemName, showError } from '../../helpers';

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const currentYear = new Date().getFullYear();
  const systemName = getSystemName();

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!data.startsWith('https://')) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout(t('\u52a0\u8f7d\u5173\u4e8e\u5185\u5bb9\u5931\u8d25...'));
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  const emptyStyle = {
    padding: '24px',
  };

  const customDescription = (
    <div style={{ textAlign: 'center' }}>
      <p>
        {t(
          '\u53ef\u5728\u8bbe\u7f6e\u9875\u9762\u8bbe\u7f6e\u5173\u4e8e\u5185\u5bb9\uff0c\u652f\u6301 HTML \u0026 Markdown',
        )}
      </p>
      <p>
        <span>{systemName}</span>{' '}
        {t('|\u0020\u57fa\u4e8e\u4e0a\u6e38')}{' '}
        <a
          href='https://github.com/QuantumNous/new-api'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          New API
        </a>
      </p>
      <p>
        <a
          href='https://github.com/QuantumNous/new-api'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          New API
        </a>{' '}
        (c) {currentYear}{' '}
        <a
          href='https://github.com/QuantumNous'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          QuantumNous
        </a>{' '}
        {t('|\u0020\u57fa\u4e8e')}{' '}
        <a
          href='https://github.com/songquanpeng/one-api/releases/tag/v0.5.4'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          One API v0.5.4
        </a>{' '}
        (c) 2023{' '}
        <a
          href='https://github.com/songquanpeng'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          JustSong
        </a>
      </p>
      <p>
        {t('\u672c\u9879\u76ee\u9700\u5728\u9075\u5faa')}{' '}
        <a
          href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'
          target='_blank'
          rel='noopener noreferrer'
          className='!text-semi-color-primary'
        >
          AGPL v3.0
        </a>{' '}
        {t(
          '\u8bb8\u53ef\u8bc1\u7684\u524d\u63d0\u4e0b\u4f7f\u7528\uff0c\u5e76\u4fdd\u7559\u4e0a\u6e38\u5f00\u6e90\u9879\u76ee\u5f52\u5c5e\u3002',
        )}
      </p>
    </div>
  );

  return (
    <div className='classic-page-fill flex flex-col pt-[60px] px-2'>
      {aboutLoaded && about === '' ? (
        <div className='flex flex-1 items-center justify-center p-8'>
          <Empty
            image={
              <IllustrationConstruction style={{ width: 150, height: 150 }} />
            }
            darkModeImage={
              <IllustrationConstructionDark
                style={{ width: 150, height: 150 }}
              />
            }
            description={t(
              '\u7ba1\u7406\u5458\u6682\u672a\u8bbe\u7f6e\u4efb\u4f55\u5173\u4e8e\u5185\u5bb9',
            )}
            style={emptyStyle}
          >
            {customDescription}
          </Empty>
        </div>
      ) : (
        <>
          {about.startsWith('https://') ? (
            <iframe
              src={about}
              style={{
                width: '100%',
                flex: '1 1 auto',
                minHeight: 0,
                border: 'none',
              }}
            />
          ) : (
            <div
              style={{ fontSize: 'larger' }}
              dangerouslySetInnerHTML={{ __html: about }}
            ></div>
          )}
        </>
      )}
    </div>
  );
};

export default About;
