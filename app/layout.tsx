'use client';

import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ColorProvider } from './context/ColorContext';
import './globals.css';

// 字体设置
const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

// 语言选择器组件
const LanguageSwitcher = () => {
  // 从i18n引入
  const { language, changeLanguage } = require('./i18n').useTranslation();
  const { LANGUAGES } = require('./i18n');
  
  return (
    <div className="absolute top-6 right-6 flex gap-2 z-10">
      <button
        onClick={() => changeLanguage(LANGUAGES.EN)}
        className={`px-3 py-1.5 rounded-full text-sm shadow-lg transition-all duration-200 ${
          language === LANGUAGES.EN 
            ? 'bg-sky-500 text-white shadow-sky-500/30' 
            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage(LANGUAGES.ZH)}
        className={`px-3 py-1.5 rounded-full text-sm shadow-lg transition-all duration-200 ${
          language === LANGUAGES.ZH 
            ? 'bg-sky-500 text-white shadow-sky-500/30' 
            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
        }`}
      >
        中文
      </button>
    </div>
  );
};

/**
 * 背景动态元素组件
 */
const BackgroundEffects = () => {
  return (
    <>
      {/* 发光点效果 */}
      <div className="light-dots">
        <div className="light-dot"></div>
        <div className="light-dot"></div>
        <div className="light-dot"></div>
        <div className="light-dot"></div>
      </div>
      
      {/* 移动线条效果 */}
      <div className="moving-lines">
        <div className="moving-line"></div>
        <div className="moving-line"></div>
        <div className="moving-line"></div>
        <div className="moving-line"></div>
      </div>
    </>
  );
};

/**
 * 应用根布局
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Color Card - 专业颜色管理工具</title>
        <meta name="description" content="一个简洁高效的颜色管理工具" />
      </head>
      <body className={inter.className}>
        <BackgroundEffects />
        <ColorProvider>
          <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 max-w-7xl mx-auto relative">
            <LanguageSwitcher />
            {children}
          </div>
        </ColorProvider>
      </body>
    </html>
  );
} 