/**
 * 检查是否为有效的十六进制颜色值
 * @param color 十六进制颜色字符串
 * @returns 是否为有效颜色
 */
export const isValidHexColor = (color: string): boolean => {
  // 支持 #RGB 和 #RRGGBB 两种格式
  return /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
};

/**
 * 规范化十六进制颜色值
 * @param hex 十六进制颜色字符串
 * @returns 规范化的十六进制颜色 (#RRGGBB 格式)
 */
export const normalizeHexColor = (hex: string): string => {
  // 如果是3位颜色代码，转换为6位
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
};

/**
 * 十六进制颜色转RGB数组
 * @param hex 十六进制颜色字符串
 * @returns RGB值数组 [r, g, b]
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  // 确保格式正确
  if (!isValidHexColor(hex)) {
    return [0, 0, 0];
  }
  
  // 规范化为6位
  hex = normalizeHexColor(hex);
  
  // 转换为RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return [r, g, b];
};

/**
 * 获取RGB颜色字符串
 * @param hex 十六进制颜色字符串
 * @returns RGB颜色字符串 "rgb(r, g, b)"
 */
export const getRgbString = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * 获取ARGB颜色字符串
 * @param hex 十六进制颜色字符串
 * @returns ARGB颜色值 "#AARRGGBB"
 */
export const getArgbString = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex);
  return `#FF${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
};

/**
 * RGB转HSL
 * @param hex 十六进制颜色字符串
 * @returns HSL值数组 [h, s, l]
 */
export const rgbToHsl = (hex: string): [number, number, number] => {
  let [r, g, b] = hexToRgb(hex);
  
  // 转换RGB为0到1的比例
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }
  
  // 转换为实际单位
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);
  
  return [h, s, lPercent];
};

/**
 * 获取HSL颜色字符串
 * @param hex 十六进制颜色字符串
 * @returns HSL颜色字符串 "hsl(h, s%, l%)"
 */
export const getHslString = (hex: string): string => {
  const [h, s, l] = rgbToHsl(hex);
  return `hsl(${h}°, ${s}%, ${l}%)`;
};

/**
 * 获取对比色（用于文本颜色，确保可读性）
 * @param hex 十六进制颜色字符串
 * @returns 黑色或白色，取决于背景色的明度
 */
export const getContrastColor = (hex: string): string => {
  const [r, g, b] = hexToRgb(hex);
  
  // 计算相对亮度
  // 使用YIQ公式，考虑到人眼对不同颜色的敏感度
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}; 