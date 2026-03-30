# Calendar Todo Planner

一个基于日历的 ToDo 规划应用，适合在浏览器中直接运行，面向 MacBook 和桌面浏览场景优化。

项目使用 `React + TypeScript + TailwindCSS` 构建，数据存储在浏览器 `localStorage` 中，无需后端服务即可完成任务规划、连续日期安排、任务编辑和拖拽改期。

## 功能特性

### 核心能力

- 月视图日历，固定 `7 x 6` 网格
- 上一月 / 下一月切换
- 点击单天选择
- 鼠标拖拽选择连续日期范围
- 为选中日期范围添加任务
- 每天支持多个任务
- 任务包含标题、描述、颜色标记
- 删除任务
- localStorage 自动持久化
- 刷新页面后自动恢复任务

### 已完成的增强能力

- 任务编辑
- 任务颜色标记
- 日历格摘要展示
- Hover 查看当天任务详情
- 拖拽修改任务日期

## 交互说明

### 1. 选择日期

- 单击某一天，可选中该日期
- 按住鼠标并拖拽，可以选中连续多天
- 当前选中范围会在右侧面板显示开始日、结束日和总天数

### 2. 添加任务

- 在日历中先选择日期范围
- 在右侧表单输入标题、描述和颜色
- 点击“添加到所选日期范围”

### 3. 编辑任务

- 在右侧“范围内任务”列表中点击“编辑”
- 表单自动切换到编辑模式
- 可以修改：
  - 标题
  - 描述
  - 颜色
  - 开始日期 / 结束日期
- 也可以重新在日历上框选新的日期范围后保存

### 4. 拖拽修改任务日期

- 在右侧任务卡片点击并拖拽“拖拽到日历改期”
- 或直接拖拽日历格子中展示的任务摘要
- 将任务拖放到某一天后：
  - 该日期会作为任务新的开始日期
  - 任务持续天数保持不变

示例：

- 原任务范围：`2026-04-10 ~ 2026-04-12`，共 3 天
- 拖到 `2026-04-20`
- 新任务范围会变成：`2026-04-20 ~ 2026-04-22`

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- 浏览器 localStorage

## 项目结构

```text
.
├─ index.html
├─ package.json
├─ package-lock.json
├─ postcss.config.cjs
├─ tailwind.config.cjs
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ .gitignore
├─ README.md
└─ src
   ├─ App.tsx
   ├─ index.css
   ├─ main.tsx
   ├─ types.ts
   ├─ vite-env.d.ts
   ├─ components
   │  ├─ CalendarGrid.tsx
   │  ├─ CalendarHeader.tsx
   │  ├─ DayCell.tsx
   │  └─ TaskPanel.tsx
   ├─ hooks
   │  └─ usePlanner.ts
   └─ lib
      ├─ cn.ts
      ├─ colors.ts
      ├─ date.ts
      └─ storage.ts
```

## 核心模块说明

### [src/App.tsx](C:/Users/15215/Desktop/CalendarTodo/src/App.tsx)

应用入口，负责组织页面布局，把日历区域和右侧任务面板组合起来。

### [src/hooks/usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)

核心状态层，负责：

- 当前月份切换
- 日期范围选择
- 新增任务
- 编辑任务
- 删除任务
- 拖拽改期
- localStorage 持久化

### [src/components/CalendarGrid.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarGrid.tsx)

负责渲染月视图日历网格，并将交互事件传给单元格组件。

### [src/components/DayCell.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/DayCell.tsx)

单个日期格子的 UI 组件，负责：

- 选中态展示
- 任务摘要展示
- 任务拖拽入口
- Hover 详情
- 拖放目标高亮

### [src/components/TaskPanel.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskPanel.tsx)

右侧任务面板，负责：

- 当前日期范围信息
- 新增 / 编辑任务表单
- 范围内任务列表
- 任务编辑入口
- 任务拖拽改期入口

### [src/lib/date.ts](C:/Users/15215/Desktop/CalendarTodo/src/lib/date.ts)

封装日期工具函数，包括：

- 月网格生成
- 日期格式化
- 范围判断
- 连续天数计算
- 拖拽改期后的日期平移

### [src/lib/storage.ts](C:/Users/15215/Desktop/CalendarTodo/src/lib/storage.ts)

封装 `localStorage` 的读取和保存逻辑。

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

启动后在浏览器打开 Vite 输出的本地地址，通常是：

```text
http://localhost:5173
```

### 3. 生产构建

```bash
npm run build
```

### 4. 本地预览构建产物

```bash
npm run preview
```

## 数据存储说明

本项目不依赖后端，所有任务都保存在浏览器本地：

- 存储方式：`localStorage`
- 存储 key：`calendar-todo-planner:v1`

这意味着：

- 同一个浏览器下刷新页面不会丢失数据
- 更换浏览器或清理浏览器站点数据后，任务会被清空

## 已验证内容

以下能力已经完成并验证：

- `npm install` 成功
- `npm run build` 成功
- 日历月视图正常渲染
- 日期拖拽选择逻辑已实现
- 任务新增 / 编辑 / 删除逻辑已实现
- 任务拖拽改期逻辑已实现
- localStorage 持久化逻辑已实现

## 后续可扩展方向

- 深色模式
- 任务搜索 / 筛选
- 按周视图切换
- 导入导出任务 JSON
- 键盘快捷键支持
- 更细粒度的任务拖拽交互，例如直接拖拽任务结束日期调整持续时间

## 许可证

当前未显式声明许可证，如需开源发布，建议补充 `MIT` 许可证文件。
