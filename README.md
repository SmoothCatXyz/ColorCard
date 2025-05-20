# ColorCard 颜色卡应用

一个简洁高效的颜色管理工具，帮助设计师和开发者快速查看、保存和使用颜色值。

## 技术栈

- **前端框架**: [Next.js](https://nextjs.org/) 14（App Router）
- **状态管理**: React Context API + useReducer
- **样式解决方案**: [Tailwind CSS](https://tailwindcss.com/) 3.3.x
- **数据获取**: SWR (Stale-While-Revalidate)
- **部署平台**: [Vercel](https://vercel.com/)
- **存储方案**: LocalStorage (客户端存储颜色记录)

## 功能特性

### 1. 颜色展示与转换
- 输入十六进制颜色值后，显示大尺寸预览色块
- 自动计算并展示对应的ARGB值和HSL值
- 实时预览输入的颜色

### 2. 颜色收藏
- 点击添加按钮将当前颜色添加到收藏列表
- 最多支持保存20个颜色
- 颜色列表持久化存储在本地，下次访问时自动恢复

### 3. 颜色使用
- 点击收藏列表中的色块自动复制十六进制颜色值到剪贴板
- 鼠标悬停时显示颜色详细信息

## 架构设计

### 目录结构
```
/app
  /components
    /ui
      ColorCard.tsx      # 主色块展示组件  
      ColorInput.tsx     # 颜色输入组件
      ColorList.tsx      # 小色块列表组件
      ColorConverter.tsx # 颜色转换和展示组件
  /context
    ColorContext.tsx     # 全局状态管理
  /lib
    colorUtils.ts        # 颜色转换工具函数
  /hooks
    useClipboard.ts      # 剪贴板操作hook
  page.tsx               # 主页面
  layout.tsx             # 应用布局
/public
  ...
```

### 状态管理

使用 React Context API 结合 useReducer 进行状态管理：

```typescript
// 状态结构
interface ColorState {
  currentColor: string;         // 当前选中的颜色（十六进制）
  savedColors: string[];        // 保存的颜色列表
}

// 操作类型
type ColorAction =
  | { type: 'SET_CURRENT_COLOR'; payload: string }
  | { type: 'ADD_COLOR'; payload: string }
  | { type: 'REMOVE_COLOR'; payload: string }
  | { type: 'CLEAR_COLORS' };
```

### 数据持久化

使用 LocalStorage 存储颜色列表，结合 SWR 进行数据读取：

```typescript
// 使用SWR从LocalStorage读取数据
const { data, mutate } = useSWR('savedColors', () => {
  const saved = localStorage.getItem('savedColors');
  return saved ? JSON.parse(saved) : [];
});

// 数据变更后更新LocalStorage
useEffect(() => {
  if (data) {
    localStorage.setItem('savedColors', JSON.stringify(data));
  }
}, [data]);
```

## 颜色转换算法

应用将实现以下颜色格式转换：

1. **HEX 转 RGB/ARGB**:
   - 将十六进制颜色代码解析为R、G、B通道值
   - 支持#RGB和#RRGGBB两种格式

2. **HEX 转 HSL**:
   - 通过RGB中间值转换为HSL色彩空间
   - 以度数(°)表示色相，百分比表示饱和度和亮度

## 性能优化

1. **组件懒加载**:
   - 使用Next.js的动态导入功能
   - 颜色预览组件按需加载

2. **状态优化**:
   - 使用useMemo缓存颜色转换结果
   - 使用useCallback优化事件处理函数

3. **渲染优化**:
   - 使用React.memo避免不必要的重渲染
   - 小色块列表使用虚拟化技术处理（当列表较长时）

## 部署流程

1. 推送代码到Git仓库
2. Vercel自动检测变更并构建应用
3. 自动部署到生产环境
4. 支持预览部署和回滚功能

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览生产版本
npm run start
```

## 未来计划

- 添加颜色对比度检查工具
- 支持颜色方案（配色）保存功能
- 添加颜色生成和建议功能
- 支持导出/导入颜色列表
