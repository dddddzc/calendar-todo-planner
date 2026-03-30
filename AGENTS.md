# AGENTS.md

## 项目定位

这是一个基于月视图日历的任务规划 Web 应用。

当前产品方向不是“任务面板 + 日历”的传统布局，而是：

- 整页以月历为核心
- 任务直接显示在日历上
- 底部浮动编辑条负责创建/编辑任务
- 顶部只保留年月导航和“任务列表”入口

后续开发时，默认应保持这个交互方向，除非用户明确要求改回侧边栏或表单面板模式。

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- localStorage

## 常用命令

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建检查：

```bash
npm run build
```

本项目每次做完结构或交互改动后，都应该至少执行一次 `npm run build`。

## 当前数据模型

任务字段定义在 [src/types.ts](C:/Users/15215/Desktop/CalendarTodo/src/types.ts)：

- `id`
- `title`
- `startDate`
- `endDate`
- `color`
- `createdAt`

注意：

- 当前任务模型已去掉 `description`
- 任务只保留“名称 + 颜色 + 日期范围”
- 如果以后要恢复描述、标签、优先级等字段，需要同步修改：
  - [src/types.ts](C:/Users/15215/Desktop/CalendarTodo/src/types.ts)
  - [src/lib/storage.ts](C:/Users/15215/Desktop/CalendarTodo/src/lib/storage.ts)
  - [src/hooks/usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)

## 存储约束

本地存储在 [src/lib/storage.ts](C:/Users/15215/Desktop/CalendarTodo/src/lib/storage.ts)。

- localStorage key：`calendar-todo-planner:v1`
- 已兼容旧版本残留字段
- 当前读取时会忽略旧数据中的无关字段

不要在没有明确需求的情况下引入后端、数据库或云同步。

## 当前 UI 结构

### 顶部

[src/components/CalendarHeader.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarHeader.tsx)

负责：

- 上一月 / 下一月
- 今天
- 年份下拉切换
- 月份下拉切换
- 任务列表按钮

### 中间主区域

[src/components/CalendarGrid.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarGrid.tsx)

负责：

- 整页 `7 x 6` 月历
- 周内任务条渲染
- 日期拖拽选择
- 任务条选中
- 任务条左右边界拖拽
- 右键删除

当前任务条不是“每天重复渲染一个 chip”，而是“按周切片后的跨列任务条”。

如果以后继续做任务拖拽、拖动平移、冲突检测，优先在这里扩展。

### 底部浮动编辑条

[src/components/TaskComposer.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskComposer.tsx)

负责：

- 新建任务
- 编辑任务名称
- 编辑任务颜色
- 显示当前选中范围

不要再加回右侧功能栏，除非用户明确要求。

### 任务列表弹层

[src/components/TaskListPopover.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskListPopover.tsx)

负责：

- 当前月全部任务汇总
- 点击定位任务
- 在列表中删除任务

## 状态层约束

[src/hooks/usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)

这是当前最重要的状态入口。

它管理：

- 当前月份
- 当前选中日期范围
- 当前选中任务
- 创建任务
- 编辑任务
- 删除任务
- 左右边界拖拽改范围
- localStorage 持久化

后续开发如果需要加功能，优先在 `usePlanner` 中扩展状态和事件，再下沉到组件。

## 当前交互规则

默认保留以下规则：

- 点击日期：选中单天
- 拖动日期：选中连续范围
- 点击任务条：选中任务
- 拖动任务条左右边界：修改开始/结束日期
- 右键任务条：删除任务
- 点击任务列表项：定位到该任务
- 任务列表可直接删除任务

如果做交互调整，尽量不要让“创建任务”和“编辑任务”入口变得分散。

## 视觉约束

当前产品方向是“紧凑月历”。

默认要求：

- 页面在常见笔记本视口内尽量首屏显示完整月历
- 优先压缩格子高度，而不是依赖浏览器缩放
- 任务条必须足够紧凑，但边界拖拽手柄仍需可点中

如果继续压缩 UI，要注意两点：

1. 任务条手柄不能缩到不可点
2. 日期数字和任务名称仍需可读

## 明确不要默认恢复的旧功能

除非用户明确提出，否则不要默认重新加回：

- 右侧任务表单栏
- 顶部大 Hero 标题区
- 搜索 / 筛选面板
- 任务描述字段

这些都已经被当前版本主动移除。

## 推荐的改动流程

当你在未来 session 中继续开发时，建议按这个顺序：

1. 先读 [STATUS.md](C:/Users/15215/Desktop/CalendarTodo/STATUS.md)
2. 再看 [src/hooks/usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)
3. 再看 [src/components/CalendarGrid.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarGrid.tsx)
4. 最后决定是否需要改 [src/components/TaskComposer.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskComposer.tsx) 或 [src/components/CalendarHeader.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarHeader.tsx)

## 提交前检查

至少完成以下检查：

- `npm run build`
- 手动确认月历首屏是否能完整显示
- 手动确认任务条左右边界拖拽是否仍可用
- 手动确认右键删除和任务列表删除没有冲突

## 仓库信息

- 远程仓库：`https://github.com/dddddzc/calendar-todo-planner.git`
- 当前主要工作分支：`codex/calendar-todo-planner`

如果没有特别要求，继续在现有工作分支上开发即可。
