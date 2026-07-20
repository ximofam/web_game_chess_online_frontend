import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEn from './locales/en/common.json' with { type: 'json' };
import navEn from './locales/en/nav.json' with { type: 'json' };
import authEn from './locales/en/auth.json' with { type: 'json' };
import homeEn from './locales/en/home.json' with { type: 'json' };
import learnEn from './locales/en/learn.json' with { type: 'json' };
import chessEn from './locales/en/chess.json' with { type: 'json' };
import forumEn from './locales/en/forum.json' with { type: 'json' };
import profileEn from './locales/en/profile.json' with { type: 'json' };
import notificationsEn from './locales/en/notifications.json' with { type: 'json' };

const resources = {
  en: {
    common: commonEn,
    nav: navEn,
    auth: authEn,
    home: homeEn,
    learn: learnEn,
    chess: chessEn,
    forum: forumEn,
    profile: profileEn,
    notifications: notificationsEn,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'nav', 'auth', 'home', 'learn', 'chess', 'forum', 'profile', 'notifications'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
