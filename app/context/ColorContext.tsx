'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { isValidHexColor } from '../lib/colorUtils';

// 默认颜色
const DEFAULT_COLOR = '#3b82f6';

// 状态接口
interface ColorState {
  currentColor: string;  // 当前选中的颜色（十六进制）
  savedColors: string[]; // 保存的颜色列表
}

// 初始状态
const initialState: ColorState = {
  currentColor: DEFAULT_COLOR,
  savedColors: [],
};

// 操作类型枚举
export enum ColorActionType {
  SET_CURRENT_COLOR = 'SET_CURRENT_COLOR',
  ADD_COLOR = 'ADD_COLOR',
  REMOVE_COLOR = 'REMOVE_COLOR',
  CLEAR_COLORS = 'CLEAR_COLORS',
  INIT_COLORS = 'INIT_COLORS',
}

// 操作类型接口
type ColorAction =
  | { type: ColorActionType.SET_CURRENT_COLOR; payload: string }
  | { type: ColorActionType.ADD_COLOR; payload: string }
  | { type: ColorActionType.REMOVE_COLOR; payload: string }
  | { type: ColorActionType.CLEAR_COLORS }
  | { type: ColorActionType.INIT_COLORS; payload: string[] };

// 上下文接口
interface ColorContextType {
  state: ColorState;
  dispatch: React.Dispatch<ColorAction>;
  setCurrentColor: (color: string) => void;
  addColor: (color: string) => void;
  removeColor: (color: string) => void;
  clearColors: () => void;
}

// 创建上下文
const ColorContext = createContext<ColorContextType | undefined>(undefined);

// Reducer 函数
const colorReducer = (state: ColorState, action: ColorAction): ColorState => {
  switch (action.type) {
    case ColorActionType.SET_CURRENT_COLOR:
      // 验证颜色格式
      if (!isValidHexColor(action.payload)) {
        return state;
      }
      return {
        ...state,
        currentColor: action.payload,
      };
      
    case ColorActionType.ADD_COLOR:
      // 验证颜色格式
      if (!isValidHexColor(action.payload)) {
        return state;
      }
      
      // 如果颜色已存在，不重复添加
      if (state.savedColors.includes(action.payload)) {
        return state;
      }
      
      // 限制最多保存20个颜色
      const newColors = [...state.savedColors, action.payload];
      if (newColors.length > 20) {
        newColors.shift(); // 移除最早添加的颜色
      }
      
      return {
        ...state,
        savedColors: newColors,
      };
      
    case ColorActionType.REMOVE_COLOR:
      return {
        ...state,
        savedColors: state.savedColors.filter(color => color !== action.payload),
      };
      
    case ColorActionType.CLEAR_COLORS:
      return {
        ...state,
        savedColors: [],
      };
      
    case ColorActionType.INIT_COLORS:
      // 过滤无效颜色，并限制最多20个
      const validColors = action.payload
        .filter(isValidHexColor)
        .slice(0, 20);
        
      return {
        ...state,
        savedColors: validColors,
      };
      
    default:
      return state;
  }
};

// 提供者组件
export const ColorProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(colorReducer, initialState);
  
  // 初始化时从localStorage加载保存的颜色
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem('savedColors');
      if (savedColors) {
        const colors = JSON.parse(savedColors);
        if (Array.isArray(colors)) {
          dispatch({
            type: ColorActionType.INIT_COLORS,
            payload: colors,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load colors from localStorage:', error);
    }
  }, []);
  
  // 当保存的颜色变化时，更新localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savedColors', JSON.stringify(state.savedColors));
    } catch (error) {
      console.error('Failed to save colors to localStorage:', error);
    }
  }, [state.savedColors]);
  
  // 辅助函数
  const setCurrentColor = (color: string) => {
    dispatch({ type: ColorActionType.SET_CURRENT_COLOR, payload: color });
  };
  
  const addColor = (color: string) => {
    dispatch({ type: ColorActionType.ADD_COLOR, payload: color });
  };
  
  const removeColor = (color: string) => {
    dispatch({ type: ColorActionType.REMOVE_COLOR, payload: color });
  };
  
  const clearColors = () => {
    dispatch({ type: ColorActionType.CLEAR_COLORS });
  };
  
  const value = {
    state,
    dispatch,
    setCurrentColor,
    addColor,
    removeColor,
    clearColors,
  };
  
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};

// 自定义Hook，用于访问上下文
export const useColor = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
};

export default ColorContext; 