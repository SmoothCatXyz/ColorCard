'use client';

import React from 'react';
import { useTranslation } from './i18n';
import ColorInput from './components/ui/ColorInput';
import ColorCard from './components/ui/ColorCard';
import ColorConverter from './components/ui/ColorConverter';
import ColorList from './components/ui/ColorList';
import { useColor } from './context/ColorContext';
import { useClipboard } from './hooks/useClipboard';
import { getContrastColor } from './lib/colorUtils';

/**
 * 知名颜色展示组件
 */
const FamousColors = () => {
  const { t } = useTranslation();
  const { setCurrentColor, addColor } = useColor();
  const { copyToClipboard } = useClipboard();
  
  // 知名颜色列表
  const FAMOUS_COLORS = [
    { id: 'kleinBlue', hex: '#002fa7' },
    { id: 'schlemmerYellow', hex: '#f7e14d' },
    { id: 'marsGreen', hex: '#008c8c' },
    { id: 'tiffanyBlue', hex: '#81d8d0' },
    { id: 'prussianBlue', hex: '#003153' },
    { id: 'vandykeBrown', hex: '#8F4B28' },
    { id: 'burgundyRed', hex: '#800020' },
    { id: 'bordeauxRed', hex: '#5e0004' },
    { id: 'titanRed', hex: '#B05923' },
    { id: 'neonPink', hex: '#ff6ec7' },
    { id: 'hermesOrange', hex: '#ff7f00' },
    { id: 'safetyOrange', hex: '#ff4f00' },
    { id: 'lavenderPurple', hex: '#b57edc' },
    { id: 'phthalocyanineBlue', hex: '#0047ab' },
    { id: 'emeraldGreen', hex: '#50c878' },
    { id: 'marygoldYellow', hex: '#ffc901' },
    { id: 'chinaRed', hex: '#aa381e' },
    { id: 'cornflowerBlue', hex: '#6495ed' },
  ];

  return (
    <div className="w-full mt-8 mb-6">
      <h2 className="text-xl font-bold mb-2 text-slate-200 flex items-center">
        <span className="mr-2">✨</span>
        {t('famousColors.title')}
      </h2>
      <p className="text-slate-400 mb-3 text-sm">
        {t('famousColors.description')}
      </p>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {FAMOUS_COLORS.map(color => (
          <div
            key={color.hex}
            className="group relative h-14 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            style={{ background: color.hex }}
            onClick={() => {
              copyToClipboard(color.hex);
              setCurrentColor(color.hex);
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-between p-1.5">
              <div className="flex justify-between items-start">
                <span 
                  className="font-medium text-xs px-1.5 py-0.5 rounded bg-black bg-opacity-20 backdrop-blur-sm"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  {t(`famousColors.colors.${color.id}`)}
                </span>
                
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-20 backdrop-blur-sm p-0.5 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    addColor(color.hex);
                  }}
                  title={t('famousColors.addToCollection')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke={getContrastColor(color.hex)}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <div 
                className="self-end font-mono text-xs px-1.5 py-0.5 rounded bg-black bg-opacity-20 backdrop-blur-sm"
                style={{ color: getContrastColor(color.hex) }}
              >
                {color.hex}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-xs">{t('famousColors.clickToView')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      
      {/* 经典颜色展示区域 */}
      <FamousColors />
    </main>
  );
} 