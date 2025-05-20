'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useColor } from '../../context/ColorContext';
import { isValidHexColor } from '../../lib/colorUtils';
import { useTranslation } from '../../i18n';

/**
 * 颜色输入组件
 * 允许用户输入十六进制颜色值并添加到保存列表
 */
const ColorInput: React.FC = () => {
  const { state, setCurrentColor, addColor } = useColor();
  const { t } = useTranslation();
  
  // 本地状态，跟踪输入值
  const [inputValue, setInputValue] = useState(state.currentColor);
  // 是否显示错误消息
  const [isError, setIsError] = useState(false);
  // 添加按钮动画状态
  const [isAdding, setIsAdding] = useState(false);
  
  // 当上下文中的当前颜色变化时，同步输入框
  useEffect(() => {
    setInputValue(state.currentColor);
  }, [state.currentColor]);
  
  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 如果是有效的十六进制颜色，更新当前颜色
    if (isValidHexColor(value)) {
      setCurrentColor(value);
      setIsError(false);
    } else {
      // 只在有实际输入时才显示错误
      setIsError(value.length > 0);
    }
  }, [setCurrentColor]);
  
  // 添加当前颜色到保存列表
  const handleAddColor = useCallback(() => {
    if (isValidHexColor(state.currentColor)) {
      setIsAdding(true);
      addColor(state.currentColor);
      
      // 重置动画状态
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    }
  }, [state.currentColor, addColor]);
  
  // 处理回车键提交
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidHexColor(inputValue)) {
      handleAddColor();
    }
  }, [inputValue, handleAddColor]);
  
  return (
    <div className="w-full card bg-opacity-40 backdrop-blur-sm">
      <label className="block text-sm font-medium mb-2 text-slate-300">
        {t('colorInput.label')}
      </label>
      
      <div className="flex gap-2 relative">
        {/* 输入框下方的发光效果，颜色随输入变化 */}
        {isValidHexColor(inputValue) && (
          <div 
            className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300" 
            style={{ 
              backgroundColor: inputValue, 
              width: '100%',
              opacity: 0.7,
              boxShadow: `0 0 8px ${inputValue}`,
            }}
          ></div>
        )}
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={t('colorInput.placeholder')}
          className={`input-field flex-grow text-lg font-mono ${isError ? 'border-red-500' : ''}`}
          aria-invalid={isError}
        />
        
        <button
          onClick={handleAddColor}
          disabled={!isValidHexColor(state.currentColor)}
          className={`btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden ${
            isAdding ? 'animate-pulse' : ''
          }`}
        >
          <span className={`transition-transform duration-300 ${isAdding ? 'translate-y-10' : ''}`}>
            {t('colorInput.addButton')}
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
            isAdding ? 'translate-y-0' : '-translate-y-10'
          }`}>
            ✓
          </span>
        </button>
      </div>
      
      {isError && (
        <p className="mt-1 text-sm text-red-400">
          {t('colorInput.invalidFormat')}
        </p>
      )}
    </div>
  );
};

export default ColorInput; 