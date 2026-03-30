# STATUS.md

## 项目当前状态

项目已可运行，且核心月历交互已经打通。

当前仓库状态基于以下信息：

- 仓库：`https://github.com/dddddzc/calendar-todo-planner.git`
- 当前分支：`codex/calendar-todo-planner`
- 最近一次同步提交：`250ad72`
- 生成本文档前工作区是干净的；当前 session 新增了 `AGENTS.md` 和 `STATUS.md`

## 已完成能力

### 日历基础

- 月视图展示
- 固定 `7 x 6` 网格
- 上一月 / 下一月切换
- 年份下拉切换
- 月份下拉切换
- 今天跳转

### 任务管理

- 日期点击选择
- 日期拖拽选择连续范围
- 创建任务
- 编辑任务名称
- 编辑任务颜色
- localStorage 持久化

### 日历内直接操作

- 任务以跨天任务条形式显示
- 点击任务条选中任务
- 拖动左边界调整开始日期
- 拖动右边界调整结束日期
- 右键删除任务

### 列表和辅助操作

- 顶部“任务列表”按钮
- 当前月任务汇总弹层
- 列表中点击任务进行定位
- 列表中直接删除任务

## 当前代码结构

### 核心状态

[src/hooks/usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)

当前所有关键状态和交互都在这里：

- 当前月份
- 当前选择范围
- 当前选中任务
- 新建 / 编辑 / 删除任务
- 左右边界拖拽

如果未来要继续开发，通常这里会是第一入口。

### 关键组件

- [src/components/CalendarGrid.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarGrid.tsx)
- [src/components/CalendarHeader.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarHeader.tsx)
- [src/components/TaskComposer.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskComposer.tsx)
- [src/components/TaskListPopover.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/TaskListPopover.tsx)

## 重要演进历史

最近 5 次提交：

- `250ad72` `feat: add calendar month controls and list delete`
- `5c18127` `fix: tighten calendar layout and resize drag`
- `189e45f` `feat: redesign calendar to full-page month view`
- `73e061b` `feat: add task search and filtering`
- `1c2d392` `feat: build calendar todo planner`

说明：

- 搜索 / 筛选功能曾经做过，但后面已经按需求移除
- 右侧面板和顶部大标题区曾经存在，但现在已经移除
- 当前版本以“整页月历”为主，不建议回退

## 当前已知约束

### 1. 日历高度仍然是敏感点

虽然已经多次压缩，但“月历能否在用户常见笔记本视口里完整首屏展示”仍然是一个持续需要关注的问题。

以后如果继续改 UI，优先检查：

- 任务条变高了没有
- 每周格子最小高度是否被抬高
- 底部浮动编辑条是否又把页面压缩得太厉害

### 2. 边界拖拽是高风险交互

当前方案是：

- 按住任务条左右边界
- 在整周容器里通过鼠标横向位置推算目标列

这个方案已经比早期版本稳定，但以后如果改动：

- 周容器布局
- 鼠标事件传递
- 任务条 DOM 结构

要重点回归测试边界拖拽。

### 3. 删除交互目前依赖确认框

当前删除方式：

- 日历任务条右键删除
- 任务列表里的删除按钮
- 都使用 `window.confirm`

如果要做更高级的删除体验，可以统一替换成自定义确认弹层。

## 建议的下一步方向

如果下个 session 要继续做产品完善，优先顺序建议如下：

1. 继续压缩日历布局，做一个真正的“紧凑模式”
2. 支持直接拖动整个任务条平移日期范围
3. 给当前选中任务增加更明显的视觉反馈
4. 做深色模式
5. 做导入 / 导出任务

## 明确暂不做的方向

除非用户重新提出，不建议主动恢复：

- 搜索 / 筛选功能
- 任务描述字段
- 右侧任务面板
- 顶部大标题 Hero

## 交接建议

下一次继续开发时，建议先做这三步：

1. 打开 [AGENTS.md](C:/Users/15215/Desktop/CalendarTodo/AGENTS.md)
2. 阅读 [src/hooks/usePlanner.ts](C:/Users/15215/Desktop/CalendarTodo/src/hooks/usePlanner.ts)
3. 阅读 [src/components/CalendarGrid.tsx](C:/Users/15215/Desktop/CalendarTodo/src/components/CalendarGrid.tsx)

然后再决定要不要改视觉层还是状态层。
