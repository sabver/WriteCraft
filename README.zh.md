# WriteCraft

Next.js 15 (Turbopack) + React 19 + TypeScript + shadcn/ui (new-york) + Tailwind CSS v4

> 一个用 AI 辅助学习英语写作的练习工具，也是探索 Claude Code 驱动开发模式的实验项目。

[English](README.md) | [日本語](README.ja.md)

---

## 项目背景

本项目有两个目标：

1. **实践 Claude Code 编程** — 用 Claude Code 完成从需求到实现的完整开发流程，体验 AI 辅助编程的实际效果。
2. **摸索适配 Claude Code 的开发模式** — 探索以 Spec-Driven Development (SDD) 为核心的工作流：先写规格文档，再出计划，再拆任务，最后逐步实现，而不是直接让 AI 写代码。

---

## 应用功能

WriteCraft 是面向英语学习者的翻译练习工具，核心流程：

```
选择场景 → 输入内容 → 写英文翻译 → AI 点评 → 生成闪卡 → 间隔复习
```

### 场景

| 场景 | 用途 |
|------|------|
| **Interview（面试）** | 职场段落级翻译，含职位描述、公司背景、题型等上下文 |
| **Daily（日常）** | 碎片化表达练习，上下文字段可选填 |

### 核心模块

- **翻译练习** — 对照源文本写英文，AI 参考译文默认隐藏，需主动展开
- **AI 点评** — 逐句对比，按语法错误 / 用词不精准 / 句式问题分类反馈，每条附原因
- **闪卡生成** — 段落模式（整段一张卡）或句子模式（逐句拆卡），卡背包含用户译文 + AI 修订版 + 关键反馈摘要
- **间隔复习** — SM-2 算法调度，按掌握程度（0–5）更新复习间隔
- **练习历史** — 按场景、日期筛选，关键词搜索，支持重练

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (Turbopack) + React 19 |
| 语言 | TypeScript |
| UI | shadcn/ui (new-york) + Tailwind CSS v4 |
| ORM | Prisma |
| 数据库 | PostgreSQL |
| 包管理 | pnpm |

### 数据模型

```
TranslationSession   — 一次完整练习记录
  └── ReviewIssue[]  — AI 点评条目（级联删除）
  └── Flashcard[]    — 生成的闪卡，含 SM-2 调度状态（级联删除）
        └── ReviewLog[] — 每次评分的不可变日志（级联删除）
```

---

## 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 填写 DATABASE_URL（PostgreSQL 连接串）

# 执行数据库迁移
pnpm exec prisma migrate dev

# 启动开发服务器
pnpm dev
```

---

## 开发工作流（SDD）

项目遵循 Spec-Driven Development，所有功能变更走以下流程：

```
/sdd-specify  →  /sdd-plan  →  /sdd-tasks  →  /sdd-implement  →  /sdd-review
```

规格文档存放在 [specs/](specs/) 目录，每个特性一个子目录（如 `specs/001-database/`）。

---

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/sessions` | 获取练习历史（支持 scene / dateRange / keyword 过滤） |
| `POST` | `/api/sessions` | 创建新练习记录 |
| `GET` | `/api/sessions/:id` | 获取单条记录详情 |
