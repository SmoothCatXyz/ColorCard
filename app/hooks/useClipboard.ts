import { useState, useCallback } from 'react';
import copy from 'clipboard-copy';
import { useTranslation } from '../i18n';

/**
 * 用于处理剪贴板复制操作的Hook
 * @returns 包含复制函数和复制状态的对象
 */
export const useClipboard = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const { t } = useTranslation();

  // 复制文本到剪贴板
  const copyToClipboard = useCallback(
    async (text: string, successMessage?: string) => {
      try {
        await copy(text);
        // 设置复制成功的数据
        setCopied(text);
        
        // 显示成功消息
        if (successMessage) {
          // 这里可以接入toast通知系统
          console.log(successMessage || t('clipboard.copied'));
        }
        
        // 2秒后重置复制状态
        setTimeout(() => {
          setCopied(null);
        }, 2000);
        
        return true;
      } catch (error) {
        console.error('剪贴板复制失败:', error);
        setCopied(null);
        return false;
      }
    },
    [t]
  );

  return {
    copyToClipboard,
    copied,
    isCopied: !!copied,
  };
}; 