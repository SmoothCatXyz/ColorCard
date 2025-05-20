'use client';

import React from 'react';
import { useTranslation } from './i18n';
import ColorInput from './components/ui/ColorInput';
import ColorCard from './components/ui/ColorCard';
import ColorConverter from './components/ui/ColorConverter';
import ColorList from './components/ui/ColorList';

/**
 * 应用主页面
 */
export default function Home() {
  const { t } = useTranslation();
  
  return (
    <main>
      <h1 className="text-4xl font-bold mt-10 mb-3 text-center text-slate-200">
        {t('app.title')}
      </h1>
      
      <p className="text-center text-slate-400 mb-10 max-w-xl mx-auto">
        {t('app.description')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧区域 */}
        <div className="flex flex-col space-y-8">
          {/* 颜色输入区域 */}
          <ColorInput />
          
          {/* 保存的颜色列表 */}
          <ColorList />
        </div>
        
        {/* 右侧区域 */}
        <div className="flex flex-col space-y-4">
          {/* 主色块显示区域 */}
          <ColorCard />
          
          {/* 颜色值标签区域 - 修改颜色转换器为标签形式 */}
          <ColorConverter />
        </div>
      </div>
    </main>
  );
} 