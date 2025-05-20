import { useCallback, useEffect, useState } from 'react';

// 导入语言文件
import en from './locales/en.json';
import zh from './locales/zh.json';

// 支持的语言
export const LANGUAGES = {
  EN: 'en',
  ZH: 'zh',
};

// 语言映射
const translations: Record<string, any> = {
  [LANGUAGES.EN]: en,
  [LANGUAGES.ZH]: zh,
};

// 默认语言
export const DEFAULT_LANGUAGE = LANGUAGES.EN;

// 获取浏览器语言
export const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = window.navigator.language.split('-')[0];
  return Object.values(LANGUAGES).includes(browserLang) 
    ? browserLang 
    : DEFAULT_LANGUAGE;
};

// 获取存储的语言
export const getStoredLanguage = (): string => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const storedLang = localStorage.getItem('language');
  return storedLang && Object.values(LANGUAGES).includes(storedLang) 
    ? storedLang 
    : getBrowserLanguage();
};

// 设置语言到本地存储
export const setStoredLanguage = (lang: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', lang);
};

// 翻译函数
export const translate = (key: string, lang: string): string => {
  const keys = key.split('.');
  let result = translations[lang] || translations[DEFAULT_LANGUAGE];
  
  for (const k of keys) {
    if (result && result[k]) {
      result = result[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return result;
};

// React Hook 用于国际化
export const useTranslation = () => {
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  
  useEffect(() => {
    setLanguage(getStoredLanguage());
  }, []);
  
  const t = useCallback((key: string): string => {
    return translate(key, language);
  }, [language]);
  
  const changeLanguage = useCallback((lang: string): void => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setLanguage(lang);
      setStoredLanguage(lang);
    } else {
      console.warn(`Language not supported: ${lang}`);
    }
  }, []);
  
  return {
    t,
    language,
    changeLanguage,
  };
}; 