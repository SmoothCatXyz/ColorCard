'use client';

import React, { useMemo, useState } from 'react';
import { useColor } from '../../context/ColorContext';
import { getContrastColor } from '../../lib/colorUtils';
import { useClipboard } from '../../hooks/useClipboard';
import { useTranslation } from '../../i18n';

/**
 * 主颜色展示卡片
 * 展示当前选择的颜色
 */
const ColorCard: React.FC = () => {
  const { state } = useColor();
  const { copyToClipboard } = useClipboard();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  // 计算文本颜色，确保在不同背景色下可读性
  const textColor = useMemo(() => {
    return getContrastColor(state.currentColor);
  }, [state.currentColor]);
  
  // 点击卡片时复制颜色值
  const handleClick = () => {
    copyToClipboard(state.currentColor, t('clipboard.copied'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <div 
      className={`cursor-pointer rounded-lg shadow-xl overflow-hidden w-full h-full transition-all duration-300 border border-slate-700 relative ${
        copied ? 'ring-2 ring-sky-500 shadow-glow' : ''
      }`}
      onClick={handleClick}
      role="button"
      aria-label={t('colorCard.copy')}
      tabIndex={0}
    >
      {/* 背景发光效果 - 随当前颜色变化 */}
      <div
        className="absolute -inset-0.5 opacity-30 blur-sm rounded-lg"
        style={{ background: state.currentColor }}
      ></div>
      
      <div 
        className="w-full h-80 flex items-center justify-center relative group z-10"
        style={{ 
          backgroundColor: state.currentColor,
          color: textColor
        }}
      >
        <span className="text-4xl font-bold opacity-90 select-none drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {state.currentColor.toUpperCase()}
        </span>
        
        {/* 悬停时显示的提示信息 */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 backdrop-blur-sm py-2 text-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {copied ? t('clipboard.copied') : t('colorCard.copy')}
        </div>
      </div>
    </div>
  );
};

export default ColorCard; 