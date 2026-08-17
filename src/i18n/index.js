import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// EN
import commonEn from './locales/en/common.json';
import navEn from './locales/en/nav.json';
import authEn from './locales/en/auth.json';
import homeEn from './locales/en/home.json';
import learnEn from './locales/en/learn.json';
import chessEn from './locales/en/chess.json';
import forumEn from './locales/en/forum.json';
import profileEn from './locales/en/profile.json';
import notificationsEn from './locales/en/notifications.json';
import roomEn from './locales/en/room.json';
import gameEn from './locales/en/game.json';
import errorEn from './locales/en/error.json';
import chatbotEn from './locales/en/chatbot.json';

// VI
import commonVi from './locales/vi/common.json';
import navVi from './locales/vi/nav.json';
import authVi from './locales/vi/auth.json';
import homeVi from './locales/vi/home.json';
import learnVi from './locales/vi/learn.json';
import chessVi from './locales/vi/chess.json';
import forumVi from './locales/vi/forum.json';
import profileVi from './locales/vi/profile.json';
import notificationsVi from './locales/vi/notifications.json';
import roomVi from './locales/vi/room.json';
import gameVi from './locales/vi/game.json';
import errorVi from './locales/vi/error.json';
import chatbotVi from './locales/vi/chatbot.json';

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
    room: roomEn,
    game: gameEn,
    error: errorEn,
    chatbot: chatbotEn,
  },
  vi: {
    common: commonVi,
    nav: navVi,
    auth: authVi,
    home: homeVi,
    learn: learnVi,
    chess: chessVi,
    forum: forumVi,
    profile: profileVi,
    notifications: notificationsVi,
    room: roomVi,
    game: gameVi,
    error: errorVi,
    chatbot: chatbotVi,
  },
};

const namespaces = [
  'common', 'nav', 'auth', 'home', 'learn', 
  'chess', 'forum', 'profile', 'notifications', 
  'room', 'game', 'error', 'chatbot'
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: namespaces,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
