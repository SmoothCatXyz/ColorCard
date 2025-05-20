'use client';

import React, { useMemo, useState } from 'react';
import { useColor } from '../../context/ColorContext';
import { getRgbString, getArgbString, getHslString } from '../../lib/colorUtils';
import { useClipboard } from '../../hooks/useClipboard';
import { useTranslation } from '../../i18n';

/**
 * 颜色标签组件
 */
interface ColorTagProps {
  value: string;
  index: number;
}

const ColorTag: React.FC<ColorTagProps> = ({ value, index }) => {
  const { copyToClipboard } = useClipboard();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  const handleClick = () => {
    copyToClipboard(value, t('clipboard.copied'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  
  return (
    <div
      className={`px-4 py-2 bg-slate-800 bg-opacity-70 backdrop-blur-sm rounded-lg cursor-pointer transition-all duration-300 text-center border border-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group ${
        copied ? 'border-sky-400 shadow-glow' : ''
      }`}
      onClick={handleClick}
      style={{
        transitionDelay: `${index * 50}ms`,
        animation: 'float 10s infinite ease-in-out',
        animationDelay: `${index * 0.5}s`
      }}
    >
      <code className="font-mono text-sm text-slate-200 relative z-10">
        {value}
        {/* 复制状态指示器 */}
        <span 
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            copied ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
            {t('clipboard.copied')}
          </span>
        </span>
      </code>
      {/* 小光晕效果 */}
      <div 
        className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-sky-400 opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300 -translate-x-1/2"
        style={{ boxShadow: '0 0 5px rgba(56, 189, 248, 0.5)' }}
      ></div>
    </div>
  );
};

/**
 * 颜色值标签区域组件
 * 以标签形式展示当前颜色的各种格式值
 */
const ColorConverter: React.FC = () => {
  const { state } = useColor();
  
  // 计算不同格式的颜色值
  const colorValues = useMemo(() => [
    state.currentColor.toUpperCase(),
    getRgbString(state.currentColor),
    getHslString(state.currentColor),
  ], [state.currentColor]);
  
  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-1 gap-3">
        {colorValues.map((value, index) => (
          <ColorTag key={index} value={value} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ColorConverter; 