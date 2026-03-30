# Calendar Todo Planner

一个基于日历的月视图任务规划应用，强调直接在日历上操作任务。

当前版本使用 `React + TypeScript + TailwindCSS` 构建，数据存储在浏览器 `localStorage` 中，无需后端服务。界面已经调整为“整页月历”模式，重点围绕日历本身完成任务创建、查看、选中、缩放范围和删除。

## 当前功能

### 日历视图

- 月视图展示
- 上一月 / 下一月切换
- 今天快速跳转
- 固定 `7 x 6` 日历网格
- 当前月日历尽量铺满整个页面

### 日期选择与任务创建

- 点击单天选择
- 鼠标拖拽选择连续日期范围
- 底部浮动任务条直接创建任务
- 任务只包含：
  - 名称
  - 颜色

### 任务展示与操作

- 任务直接显示为跨天任务条
- 点击任务条可选中任务
- 选中任务后可修改名称和颜色
- 选中任务后可直接拖动左边界修改开始日期
- 选中任务后可直接拖动右边界修改结束日期
- 在日历任务条上右键可删除任务

### 任务列表

- 顶部提供“任务列表”按钮
- 点击后弹出当前月任务汇总面板
- 可在列表中查看当前月全部任务
- 点击列表项可定位并选中对应任务

### 数据持久化

- 所有任务自动保存到 `localStorage`
- 刷新页面后自动恢复
- 兼容旧版本本地数据中的额外字段并自动忽略

## 交互说明

### 1. 创建任务

1. 在日历上点击某天，或拖拽选择一段连续日期
2. 在底部输入任务名称
3. 选择任务颜色
4. 点击“创建任务”

### 2. 编辑任务

1. 点击日历中的任务条
2. 底部浮动任务条会切换到编辑状态
3. 修改任务名称或颜色
4. 点击“保存任务”

### 3. 拖动任务左右边界改范围

1. 先点击任务条选中任务
2. 在任务条最左侧或最右侧会出现可拖动边界
3. 按住边界并移动到新的日期
4. 松开鼠标后，任务范围立即更新

### 4. 右键删除任务

1. 在日历中的任务条上点击右键
2. 确认删除提示
3. 删除后任务会立刻从日历和本地存储中移除

### 5. 查看当前月任务汇总

1. 点击顶部“任务列表”按钮
2. 展开当前月任务汇总面板
3. 点击任意任务可直接选中它

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- localStorage

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
   │  ├─ TaskComposer.tsx
   │  └─ TaskListPopover.tsx
   ├─ hooks
   │  └─ usePlanner.ts
   └─ lib
      ├─ cn.ts
      ├─ colors.ts
      ├─ date.ts
      └─ storage.ts
```

## 核心模块

### [App.tsx](C:/Users/15215/Desktop/CalendarTodo/src/App.tsx)

应用入口，负责组织顶部月份控制、整页月历、任务列表弹层和底部任务编辑条。

### [usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)

核心状态层，负责：

- 当前月份切换
- 日期范围选择
- 新建任务
- 选中任务
- 任务名称 / 颜色修改
- 拖动任务边界调整范围
- 删除任务
- localStorage 持久化

### [CalendarGrid.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarGrid.tsx)

整页月历组件，负责：

- 6 行周视图渲染
- 日期选中高亮
- 任务条跨天展示
- 任务选中
- 左右边界拖拽
- 右键删除

### [TaskComposer.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskComposer.tsx)

底部浮动编辑条，负责：

- 创建任务
- 编辑任务名称
- 编辑任务颜色
- 显示当前选中日期范围

### [TaskListPopover.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskListPopover.tsx)

当前月任务汇总弹层，负责：

- 当前月任务总览
- 任务快速定位

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

默认开发地址通常是：

```text
http://localhost:5173
```

### 3. 生产构建

```bash
npm run build
```

### 4. 本地预览

```bash
npm run preview
```

## 数据存储

任务数据存储在浏览器本地：

- 存储方式：`localStorage`
- 存储 key：`calendar-todo-planner:v1`

说明：

- 刷新页面不会丢失任务
- 更换浏览器或清理站点数据后任务会消失
- 旧版本本地缓存中的 `description` 等冗余字段会被忽略

## 已验证

- `npm install` 成功
- `npm run build` 成功
- 月视图整页展示逻辑已完成
- 日期拖拽选择逻辑已完成
- 任务创建逻辑已完成
- 任务列表弹层已完成
- 任务左右边界拖拽改期已完成
- 日历右键删除任务已完成
- localStorage 持久化已完成

## 可继续扩展

- 深色模式
- 任务拖拽整体平移
- 导出 / 导入任务
- 键盘快捷键
- 周视图 / 双周视图

## 许可证

当前仓库未显式添加许可证文件。如需对外开源分发，建议补充 `MIT` 许可证。
