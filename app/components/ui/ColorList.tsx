'use client';

import React from 'react';
import { useColor } from '../../context/ColorContext';
import { getContrastColor } from '../../lib/colorUtils';
import { useClipboard } from '../../hooks/useClipboard';
import { useTranslation } from '../../i18n';

/**
 * 单个小色块组件
 */
interface ColorItemProps {
  color: string | null;
  onClick?: (color: string) => void;
  isActive?: boolean;
  isEmpty?: boolean;
}

const ColorItem: React.FC<ColorItemProps> = ({ 
  color, 
  onClick, 
  isActive = false, 
  isEmpty = false 
}) => {
  const contrastColor = color ? getContrastColor(color) : '#000000';
  
  // 透明色块的样式
  if (isEmpty) {
    return (
      <div
        className="h-10 w-10 rounded border border-dashed border-slate-600 bg-slate-800 bg-opacity-30"
        aria-label="空色块"
        role="presentation"
      />
    );
  }
  
  return (
    <div
      className={`h-10 w-10 rounded shadow-md cursor-pointer transition-transform hover:scale-110 ${
        isActive ? 'ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900' : ''
      }`}
      style={{ 
        backgroundColor: color || 'transparent',
        color: contrastColor 
      }}
      onClick={() => color && onClick && onClick(color)}
      aria-label={color || '空色块'}
      role={color ? "button" : "presentation"}
      tabIndex={color ? 0 : -1}
    >
      {color && (
        <div className="h-full w-full flex items-center justify-center">
          <span className="text-[8px] font-medium opacity-80">{color.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

/**
 * 色块列表组件
 * 展示已保存的颜色列表（固定20个位置）
 */
const ColorList: React.FC = () => {
  const { state, setCurrentColor, clearColors } = useColor();
  const { copyToClipboard } = useClipboard();
  const { t } = useTranslation();
  
  // 处理色块点击
  const handleColorClick = (color: string) => {
    // 复制颜色值到剪贴板
    copyToClipboard(color, t('clipboard.copied'));
    // 设置为当前颜色
    setCurrentColor(color);
  };
  
  // 是否显示清空按钮
  const showClearButton = state.savedColors.length > 0;
  
  // 创建固定20个位置的色块数组
  const colorBlocks = Array(20).fill(null).map((_, index) => {
    // 如果有保存的颜色，则使用保存的颜色，否则为null（表示空位置）
    return index < state.savedColors.length ? state.savedColors[index] : null;
  });
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-slate-200">
          {t('colorList.title')} ({state.savedColors.length}/20)
        </h2>
        
        {showClearButton && (
          <button
            onClick={clearColors}
            className="btn btn-secondary text-sm py-1 px-3"
          >
            {t('colorList.clear')}
          </button>
        )}
      </div>
      
      <div className="p-3 bg-slate-800 bg-opacity-40 backdrop-blur-sm rounded-lg border border-slate-700 shadow-lg">
        <div className="grid grid-rows-2 grid-cols-10 gap-2">
          {colorBlocks.map((color, index) => (
            <ColorItem
              key={index}
              color={color}
              onClick={handleColorClick}
              isActive={color === state.currentColor}
              isEmpty={color === null}
            />
          ))}
        </div>
      </div>
      
      {state.savedColors.length >= 20 && (
        <p className="mt-2 text-xs text-amber-400">
          {t('colorList.limit')}
        </p>
      )}
    </div>
  );
};

export default ColorList; 