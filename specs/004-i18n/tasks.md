# Tasks 004 �?Frontend Internationalization (i18n)

**Plan:** [specs/004-i18n/plan.md](specs/004-i18n/plan.md)
**Status:** Ready for implementation

Legend:
- `[P]` �?can run in parallel with other `[P]` tasks at the same level
- **TEST FIRST** �?write the test (RED) before the implementation (GREEN)

---

## Phase 1 �?Foundation

### T01 · Install next-intl
**Goal:** Add the library. No code changes yet.
**Files touched:** `package.json`, `pnpm-lock.yaml`
**Validate:**
```bash
pnpm add next-intl
pnpm run build   # must still pass
```
**Done when:** `next-intl` appears in `package.json` dependencies; build is green.

---

### T02 · **TEST FIRST** �?Write unit tests for `config.ts` and `detect.ts`
**Goal:** Define the expected behaviour of locale config and detection before implementing.
**Files touched (new):**
- `src/i18n/config.test.ts`
- `src/i18n/detect.test.ts`

**`config.test.ts` assertions:**
- `LOCALES` contains `'en'` and `'zh-CN'`
- `DEFAULT_LOCALE` equals `'en'`
- `LOCALE_STORAGE_KEY` is a non-empty string
- `LOCALE_LABELS` has an entry for every item in `LOCALES`

**`detect.test.ts` assertions (mock `navigator.language`):**
- `'zh-CN'` �?returns `'zh-CN'`
- `'zh-TW'` �?returns `'zh-CN'` (closest supported match)
- `'zh'` �?returns `'zh-CN'`
- `'en-US'` �?returns `'en'`
- `'en'` �?returns `'en'`
- `'fr-FR'` �?returns `'en'` (unsupported lang defaults to en)
- `''` (empty string) �?returns `'en'`
- `undefined` navigator �?returns `'en'`

**Validate:**
```bash
pnpm test -- src/i18n/config.test.ts src/i18n/detect.test.ts
# Expected: all tests FAIL (RED) �?files don't exist yet
```
**Done when:** tests exist and fail with "Cannot find module" or similar import errors.

---

### T03 · Implement `src/i18n/config.ts`
**Goal:** Export locale types, constants, and labels.
**Files touched (new):** `src/i18n/config.ts`

**Content (exact):**
```typescript
export const LOCALES = ['en', 'zh-CN'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '中文 (简�?',
};
export const LOCALE_STORAGE_KEY = 'writecraft-locale';
```

**Validate:**
```bash
pnpm test -- src/i18n/config.test.ts
pnpm run typecheck
# Expected: config tests GREEN
```
**Done when:** all `config.test.ts` assertions pass; no TypeScript errors.

---

### T04 · Implement `src/i18n/detect.ts`
**Goal:** Browser-only locale detection from `navigator.language`.
**Files touched (new):** `src/i18n/detect.ts`

**Logic:** `navigator.language.toLowerCase().startsWith('zh')` �?`'zh-CN'`, else `DEFAULT_LOCALE`. Handle `navigator` being undefined (SSR guard).

**Validate:**
```bash
pnpm test -- src/i18n/detect.test.ts
pnpm run typecheck
# Expected: detect tests GREEN
```
**Done when:** all `detect.test.ts` assertions pass.

---

### T05 · Create `messages/en.json`
**Goal:** Single source of truth for all English UI strings (~130 keys across 19 namespaces).
**Files touched (new):** `messages/en.json`

**Use the exact JSON structure from plan.md §3.** All 19 namespaces must be present:
`nav`, `home`, `scene`, `stepper`, `daily`, `interview`, `dailyContext`, `interviewContext`,
`sourceText`, `translation`, `review`, `reviewItem`, `history`, `historyDetail`,
`flashcardGenerate`, `flashcardReview`, `flashcard3d`, `common`, `langSwitcher`

**Validate:**
```bash
node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('valid JSON')"
```
**Done when:** file parses as valid JSON; all 19 namespaces present; no values are empty strings.

---

### T06 · Create `messages/zh-CN.json`
**Goal:** Complete Simplified Chinese translations for every key in `en.json`.
**Files touched (new):** `messages/zh-CN.json`

**Same structure as `en.json`.** All values in Chinese. Reference translations:

```json
{
  "nav": {
    "dashboard": "首页",
    "history": "历史记录",
    "review": "AI 审阅",
    "flashcards": "闪卡",
    "settings": "设置",
    "helpSupport": "帮助与支�?,
    "logout": "退出登�?,
    "proPlan": "专业�?
  },
  "home": {
    "practiceScenes": "练习场景",
    "practiceSubtitle": "选择今天的练习方向�?,
    "quickTranslation": "快速翻�?,
    "instantFeedback": "即时反馈",
    "analyze": "分析",
    "yourExpression": "你的表达",
    "expressionPlaceholder": "例如�?I'd like to check out, please"...",
    "charCount": "{count} / 500",
    "aiFeedbackTitle": "AI 反馈与翻�?,
    "aiFeedbackEmpty": "在左侧输入内容，即可获得即时翻译和语法反馈�?,
    "todayFragments": "今日片段",
    "searchFragments": "搜索片段...",
    "translationLabel": "翻译：{text}",
    "voiceInput": "语音输入",
    "pasteClipboard": "从剪贴板粘贴",
    "listenAria": "播放",
    "saveFlashcardsAria": "保存为闪�?
  },
  "scene": {
    "dailyTitle": "日常练习",
    "dailyDesc": "针对碎片化表达和日常想法的快速翻译练习�?,
    "dailyMode": "即时模式",
    "interviewTitle": "面试练习",
    "interviewDesc": "针对职业发展的结构化专业对话练习�?,
    "interviewLevel": "中级",
    "startAria": "开始{scene}练习"
  },
  "stepper": {
    "context": "背景",
    "source": "原文",
    "translate": "翻译",
    "review": "审阅",
    "flashcard": "闪卡"
  },
  "daily": {
    "pageTitle": "日常练习",
    "step0": "为今天的日常对话设置背景�?,
    "step1": "用母语记录你想表达的内容�?,
    "step2": "翻译你的日常表达�?,
    "submitting": "正在提交 AI 审阅�?
  },
  "interview": {
    "pageTitle": "面试练习",
    "step0": "为模拟面试设置背景�?,
    "step1": "用母语记录你的回答�?,
    "step2": "写出你的专业英文翻译�?,
    "submitting": "正在提交 AI 审阅�?
  },
  "dailyContext": {
    "settingLabel": "对话场景（可选）",
    "settingPlaceholder": "选择场景...",
    "settingCoffeeShop": "咖啡�?,
    "settingRestaurant": "餐厅",
    "settingAirport": "机场",
    "settingHotel": "酒店",
    "settingOffice": "办公�?,
    "settingOther": "其他",
    "settingHint": "这段对话发生在哪里？",
    "formalityLabel": "正式程度（可选）",
    "formalityCasual": "随意",
    "formalityNeutral": "中�?,
    "formalityFormal": "正式",
    "formalityHint": "语言应该多礼貌或随意�?,
    "tipTitle": "小提�?,
    "tipBody": "日常练习非常适合碎片化表达。如果只想快速翻译某个短语，可以跳过这些字段�?,
    "tipSkipHint": "背景字段为可选项——随时可以跳过�?,
    "skipBtn": "直接跳过",
    "startBtn": "开始写�?,
    "duration": "�?5 分钟"
  },
  "interviewContext": {
    "questionLabel": "面试问题 *",
    "questionPlaceholder": "例如，请做一下自我介�?,
    "questionHint": "指定你想要练习回答的问题�?,
    "roleLabel": "职位",
    "roleBackend": "后端工程�?,
    "roleProduct": "产品经理",
    "roleUX": "UX 设计�?,
    "roleData": "数据科学�?,
    "toneLabel": "语气",
    "toneProfessional": "专业",
    "toneNeutral": "中�?,
    "toneConfident": "自信",
    "advancedOptions": "高级选项",
    "companyLabel": "公司/行业",
    "companyPlaceholder": "例如，科技、金�?..",
    "interviewTypeLabel": "面试类型",
    "typeHR": "HR 面试",
    "typeTech": "技术面�?,
    "saveTemplate": "保存为模�?,
    "skipBtn": "跳过",
    "startBtn": "开始写�?,
    "aiPowered": "AI 智能分析",
    "duration": "�?15 分钟"
  },
  "sourceText": {
    "label": "原文（母语）*",
    "hint": "请输入你想要翻译的母语内容�?,
    "whyTitle": "为什么这很重要？",
    "whyBody": "用母语记录你的原始想法，能帮�?AI 更准确地反馈你翻译中的细微差别和用词选择�?,
    "nextBtn": "下一步：翻译",
    "duration": "�?2 分钟"
  },
  "translation": {
    "sourceLabel": "原文",
    "referenceBadge": "参�?,
    "yourTranslationLabel": "你的翻译",
    "charCount": "{count} / 10+ 字符",
    "placeholder": "在此输入你的英文翻译...",
    "showReference": "显示 AI 参考翻�?,
    "hideReference": "隐藏 AI 参考翻�?,
    "submitBtn": "提交 AI 审阅"
  },
  "review": {
    "pageTitle": "AI 反馈审阅",
    "pageSubtitle": "查看你的翻译及写作改进建议�?,
    "aiBadge": "AI",
    "youBadge": "�?,
    "analysisComplete": "分析完成",
    "allIssues": "全部问题",
    "successTitle": "太棒了！",
    "successBody": "你的翻译看起来很好！可以生成闪卡了�?,
    "generateFlashcardsBtn": "生成闪卡",
    "emptyTitle": "暂无审阅",
    "emptyBody": "完成一次练习后，AI 反馈将显示在这里�?,
    "startPracticeBtn": "开始练�?,
    "errorTitle": "出现错误"
  },
  "reviewItem": {
    "originalLabel": "原文",
    "revisedLabel": "修改�?,
    "highPriority": "高优先级",
    "mediumPriority": "中优先级",
    "lowPriority": "低优先级",
    "reasonLabel": "原因",
    "generateFlashcard": "生成闪卡"
  },
  "history": {
    "pageTitle": "练习历史",
    "pageSubtitle": "回顾历史记录，追踪你的进步�?,
    "searchPlaceholder": "搜索历史...",
    "filterAll": "全部",
    "filterInterview": "面试",
    "filterDaily": "日常",
    "timeAll": "全部时间",
    "time7d": "7�?,
    "time30d": "30�?,
    "issuesLabel": "问题",
    "perfectLabel": "完美",
    "issueCount": "发现 {count} �?,
    "startPracticeBtn": "开始练�?,
    "emptyTitle": "暂无历史记录",
    "emptyBody": "每一次练习都是一步进步�?,
    "loadError": "加载历史记录失败，请重试�?
  },
  "historyDetail": {
    "backBtn": "返回历史记录",
    "pageTitle": "练习记录详情",
    "redoBtn": "重新练习",
    "sourceLabel": "原文",
    "translationLabel": "你的翻译",
    "aiReviewLabel": "AI 审阅与反�?,
    "flashcardsLabel": "相关闪卡",
    "flashcardN": "闪卡 #{n}",
    "noIssues": "未发现问题——翻译很棒！",
    "notFoundTitle": "找不到记�?,
    "notFoundBody": "此练习记录无法加载�?
  },
  "flashcardGenerate": {
    "pageTitle": "生成闪卡",
    "pageSubtitle": "将练习内容转化为学习材料�?,
    "modeTitle": "卡片生成模式",
    "modeSubtitle": "选择如何将翻译拆分成卡片�?,
    "modeParagraph": "段落",
    "modeSentence": "句子",
    "previewTitle": "卡片预览",
    "frontLabel": "正面",
    "backLabel": "背面",
    "backHint": "AI 修改 + 反馈摘要",
    "noSessionTitle": "暂无活跃会话——请先开始一次练习�?,
    "goToReviewBtn": "前往审阅",
    "saveBtn": "保存闪卡"
  },
  "flashcardReview": {
    "pageTitle": "复习会话",
    "backAria": "返回首页",
    "progressLabel": "进度",
    "progressValue": "{current} / {total}",
    "ratePrompt": "你的回忆效果如何�?,
    "rateForgot": "忘记�?,
    "rateHard": "困难",
    "rateEasy": "简�?,
    "rateAria": "评分 {n}",
    "allCaughtUp": "全部完成�?,
    "allCaughtUpBody": "今天的卡片已全部复习完毕。明天再来吧�?,
    "backToDashboard": "返回首页",
    "flipHint": "空格翻转"
  },
  "flashcard3d": {
    "sourceLabel": "原文",
    "tapToReveal": "点击或按空格键查看答�?,
    "translationLabel": "你的翻译",
    "aiRevisionLabel": "AI 修改",
    "noCorrections": "无需修改",
    "moreCorrections": "+{count} 条——查看全部修�?,
    "originalLabel": "原文",
    "revisedLabel": "修改�?
  },
  "common": {
    "loading": "加载�?..",
    "error": "发生错误",
    "retry": "重试",
    "cancel": "取消",
    "save": "保存",
    "skip": "跳过",
    "back": "返回",
    "next": "下一�?,
    "interviewScene": "面试",
    "dailyScene": "日常",
    "activeNow": "当前活跃"
  },
  "langSwitcher": {
    "label": "语言",
    "en": "English",
    "zhCN": "中文 (简�?"
  }
}
```

**Validate:**
```bash
node -e "JSON.parse(require('fs').readFileSync('messages/zh-CN.json','utf8')); console.log('valid JSON')"
```
**Done when:** file parses as valid JSON; same key count as `en.json`; no values contain the original English text (spot check 5 keys).

---

### T07 · **TEST FIRST** �?Write unit test for `LocaleContext`
**Goal:** Define expected behaviour before implementing the context.
**Files touched (new):** `src/contexts/LocaleContext.test.tsx`

**Test setup:** Use `@testing-library/react` to render a consumer component inside `LocaleProvider`.

**Assertions:**
1. With empty localStorage + `navigator.language = 'en'` �?`useLocale().locale` is `'en'`
2. With empty localStorage + `navigator.language = 'zh-CN'` �?`useLocale().locale` is `'zh-CN'`
3. With `localStorage.getItem('writecraft-locale') = 'zh-CN'` �?locale is `'zh-CN'` regardless of navigator
4. `setLocale('zh-CN')` updates the locale state
5. `setLocale('zh-CN')` writes `'zh-CN'` to `localStorage` under key `'writecraft-locale'`
6. `setLocale('en')` writes `'en'` to `localStorage`

**Validate:**
```bash
pnpm test -- src/contexts/LocaleContext.test.tsx
# Expected: FAIL (RED) �?LocaleContext does not exist
```
**Done when:** test file exists; tests fail due to missing implementation.

---

### T08 · Implement `src/contexts/LocaleContext.tsx`
**Goal:** `LocaleProvider` + `useLocale()` hook with dynamic message loading.
**Files touched (new):** `src/contexts/LocaleContext.tsx`

**Behaviour:**
1. On mount: read `localStorage.getItem(LOCALE_STORAGE_KEY)`. If present and valid, use it. Otherwise call `detectLocale()`.
2. On locale state change: dynamically `import(`../../messages/${locale}.json`)` and store messages in state.
3. Render `<NextIntlClientProvider locale={locale} messages={messages}>`.
4. Export `useLocale(): { locale: Locale; setLocale: (l: Locale) => void }`.
5. `setLocale` writes to `localStorage` and updates state.
6. Guard: only read/write `localStorage` inside `useEffect` (SSR safe).

**Validate:**
```bash
pnpm test -- src/contexts/LocaleContext.test.tsx
pnpm run typecheck
# Expected: all context tests GREEN
```
**Done when:** all 6 test assertions pass; no TypeScript errors.

---

### T09 · Wire `LocaleProvider` into root layout
**Goal:** All pages are now wrapped with locale context.
**Files touched:** `src/app/layout.tsx`

**Change:** Import `LocaleProvider` from `@/contexts/LocaleContext`. Wrap the `<body>` children:
```tsx
<body suppressHydrationWarning className="font-sans">
  <LocaleProvider>{children}</LocaleProvider>
</body>
```

**Validate:**
```bash
pnpm run build   # no build errors
pnpm run typecheck
```
**Done when:** build is green; `suppressHydrationWarning` added to `<body>`; `<html lang>` remains `"en"` (will be dynamic in T24).

---

## Phase 2 �?Language Switcher

### T10 · **TEST FIRST** �?Write component test for `LanguageSwitcher`
**Goal:** Define expected rendering and interaction before implementing.
**Files touched (new):** `src/components/common/LanguageSwitcher.test.tsx`

**Assertions:**
1. Renders a select/button with accessible label (e.g. aria-label containing "Language")
2. Renders an option/item for `'English'`
3. Renders an option/item for `'中文 (简�?'`
4. Selecting `'中文 (简�?'` calls `setLocale` with `'zh-CN'`
5. Current locale is visually reflected (e.g. selected value)

**Test setup:** Render inside `LocaleProvider` wrapper (or mock `useLocale`).

**Validate:**
```bash
pnpm test -- src/components/common/LanguageSwitcher.test.tsx
# Expected: FAIL (RED)
```

---

### T11 · Implement `src/components/common/LanguageSwitcher.tsx`
**Goal:** shadcn `Select` component that reads/writes locale.
**Files touched (new):** `src/components/common/LanguageSwitcher.tsx`

**Design:**
- Use shadcn `Select` (already installed).
- Options generated from `LOCALES.map(l => ({ value: l, label: LOCALE_LABELS[l] }))`.
- Calls `setLocale(value)` on change.
- Small compact variant to fit sidebar footer.

**Validate:**
```bash
pnpm test -- src/components/common/LanguageSwitcher.test.tsx
pnpm run typecheck
# Expected: GREEN
```

---

### T12 · Add `LanguageSwitcher` to `Sidebar` footer
**Goal:** Language switcher is visible and functional in the sidebar.
**Files touched:** `src/components/layout/Sidebar.tsx`

**Placement:** Between the Help & Support link and the user profile section (inside `<div className="p-4 space-y-1">`).

**Validate:**
```bash
pnpm run build
pnpm run lint
```
**Done when:** build passes; switcher is visible in sidebar footer at `/`.

---

## Phase 3 �?Translate All Strings

> All tasks in this phase follow the same pattern:
> 1. Add `const t = useTranslations('namespace')` at top of component
> 2. Replace every hard-coded UI string with `t('key')`
> 3. Replace interpolated strings (e.g. `"Rate ${n}"`) with `t('key', { n })`

---

### T13 · Translate shared navigation and badge components [P]
**Goal:** Sidebar nav, SceneCard, ProgressStepper, SceneBadge, IssueBadge use `t()`.
**Files touched:**
- `src/components/layout/Sidebar.tsx` (namespace: `nav`)
- `src/components/scene/SceneCard.tsx` (namespace: `scene`)
- `src/components/common/ProgressStepper.tsx` (namespace: `stepper`)
- `src/components/common/SceneBadge.tsx` (namespace: `common`)
- `src/components/common/IssueBadge.tsx` (namespace: `reviewItem` �?severity labels)

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
pnpm test -- src/components/layout/Sidebar.test.tsx
```

---

### T14 · Translate Dashboard page [P]
**Goal:** `src/app/page.tsx` contains no hard-coded English UI strings.
**Files touched:** `src/app/page.tsx` (namespace: `home`)

**Special cases:**
- `{text.length} / 500` �?`t('charCount', { count: text.length })`
- `aria-label` attributes must also use `t()`

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
```

---

### T15 · Translate Daily Practice flow [P]
**Goal:** All Daily-related components use `t()`.
**Files touched:**
- `src/app/daily/page.tsx` (namespace: `daily`)
- `src/components/input/DailyContextForm.tsx` (namespace: `dailyContext`)
- `src/components/input/SourceTextForm.tsx` (namespace: `sourceText`)
- `src/components/input/TranslationPanel.tsx` (namespace: `translation`)

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
```

---

### T16 · Translate Interview Practice flow [P]
**Goal:** All Interview-related components use `t()`.
**Files touched:**
- `src/app/interview/page.tsx` (namespace: `interview`)
- `src/components/input/InterviewContextForm.tsx` (namespace: `interviewContext`)

(Note: `SourceTextForm` and `TranslationPanel` are already translated in T15.)

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
```

---

### T17 · Translate Review flow [P]
**Goal:** Review page and ReviewItem component use `t()`.
**Files touched:**
- `src/app/review/page.tsx` (namespace: `review`)
- `src/components/review/ReviewItem.tsx` (namespace: `reviewItem`)

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
```

---

### T18 · Translate History flow [P]
**Goal:** History list and detail pages use `t()`.
**Files touched:**
- `src/app/history/page.tsx` (namespace: `history`)
- `src/app/history/[id]/page.tsx` (namespace: `historyDetail`)

**Special cases:**
- `Flashcard #${n}` �?`t('flashcardN', { n })`

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
```

---

### T19 · Translate Flashcard flow [P]
**Goal:** Flashcard generate, review, and 3D card component use `t()`.
**Files touched:**
- `src/app/flashcard/generate/page.tsx` (namespace: `flashcardGenerate`)
- `src/app/flashcard/review/page.tsx` (namespace: `flashcardReview`)
- `src/components/flashcard/Flashcard3D.tsx` (namespace: `flashcard3d`)

**Special cases:**
- `{current} / {total}` �?`t('progressValue', { current, total })`
- `+${count} more �?view all corrections` �?`t('moreCorrections', { count })`

**Validate:**
```bash
pnpm run lint
pnpm run typecheck
```

---

## Phase 4 �?Quality & Polish

### T20 · Translation completeness test (CI gate)
**Goal:** A vitest test fails if `en.json` and `zh-CN.json` have any key mismatch.
**Files touched (new):** `src/i18n/completeness.test.ts`

**Assertions (recursive key comparison):**
1. Every leaf key in `en.json` exists in `zh-CN.json`
2. No leaf key exists in `zh-CN.json` that is absent from `en.json`
3. No value in `zh-CN.json` is an empty string

**Helper:** Write a `getLeafKeys(obj, prefix)` utility that recursively collects all dot-paths.

**Validate:**
```bash
pnpm test -- src/i18n/completeness.test.ts
# Expected: GREEN (both files exist and are in sync)
# If any key is added to en.json later without zh-CN.json �?test turns RED
```
**Done when:** all assertions pass; confirm by temporarily removing one zh-CN key and seeing the test fail, then restoring.

---

### T21 · Full test suite baseline
**Goal:** Confirm no regressions introduced by i18n wiring.
**Files touched:** None �?run only.

**Validate:**
```bash
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run build
```
**Done when:** all tests pass; build is clean; no lint errors.

---

### T22 · Layout smoke test in zh-CN
**Goal:** Visually verify no text overflow, truncation issues, or broken layouts when locale is zh-CN.
**Files touched:** Fix any layout issues found (CSS/className adjustments only).

**Checklist (manual):**
- [ ] Sidebar nav labels fit without overflow
- [ ] SceneCard descriptions wrap cleanly
- [ ] ProgressStepper step labels fit
- [ ] DailyContextForm labels fit in form rows
- [ ] History list rows don't break
- [ ] Flashcard 3D component renders correctly
- [ ] Flashcard review rating buttons fit

**Common fixes:** Add `truncate` class, increase width, use `min-w-0`, or split labels across two lines.

**Validate:**
```bash
pnpm run dev   # manual visual review at each route in zh-CN
```

---

### T23 · E2E tests (Playwright)
**Goal:** Automate the critical user journeys for i18n.
**Files touched (new):** `e2e/i18n.spec.ts`

**Test cases:**
1. `switch-language` �?Open `/` �?click switcher �?select 中文 �?assert sidebar shows "首页"
2. `persist-across-navigation` �?Switch to zh-CN �?navigate to `/history` �?assert still in zh-CN
3. `persist-across-reload` �?Switch to zh-CN �?reload page �?assert still in zh-CN
4. `auto-detect-zh` �?Clear localStorage �?evaluate `Object.defineProperty(navigator,'language',{value:'zh-CN'})` �?reload �?assert zh-CN
5. `auto-detect-en` �?Clear localStorage �?evaluate navigator.language = 'en-US' �?reload �?assert en
6. `switch-back-to-english` �?Start in zh-CN �?switch to English �?assert sidebar shows "Dashboard"

**Validate:**
```bash
pnpm exec playwright test e2e/i18n.spec.ts
```
**Done when:** all 6 scenarios pass in headed and headless mode.

---

### T24 · Anti-flash inline script
**Goal:** Prevent visible English flash on page load for zh-CN users.
**Files touched:** `src/app/layout.tsx`

**Change:** Add an inline `<script>` tag inside `<head>` that runs synchronously before React hydration:
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `try{var l=localStorage.getItem('writecraft-locale');if(!l){var n=(navigator.language||'').toLowerCase();l=n.startsWith('zh')?'zh-CN':'en';}document.documentElement.setAttribute('data-locale',l);}catch(e){}`
  }}
/>
```
Also update `<html lang>` to read from the data attribute (or set statically for SSR compatibility):
```tsx
<html lang="en" data-locale="en" ...>
```
(The inline script overrides `data-locale` before paint.)

**Note:** This mitigates but does not fully eliminate the flash �?acceptable per plan risk assessment.

**Validate:**
```bash
pnpm run build
pnpm run lint   # next/no-assign-module-variable may flag �?use eslint-disable if needed
```
**Done when:** build passes; no hydration warnings in browser console when loading as zh-CN user.

---

## Summary Checklist

### Phase 1 �?Foundation
- [x] T01 �?Install next-intl
- [x] T02 �?Tests for config + detect (RED)
- [x] T03 �?Implement config.ts (GREEN)
- [x] T04 �?Implement detect.ts (GREEN)
- [x] T05 �?Create messages/en.json
- [x] T06 �?Create messages/zh-CN.json
- [x] T07 �?Tests for LocaleContext (RED)
- [x] T08 �?Implement LocaleContext (GREEN �?also added loadMessages.ts helper)
- [x] T09 �?Wire LocaleProvider into layout.tsx

### Phase 2 �?Language Switcher
- [x] T10 �?Tests for LanguageSwitcher (RED)
- [x] T11 �?Implement LanguageSwitcher (GREEN)
- [x] T12 �?Add LanguageSwitcher to Sidebar

### Phase 3 �?Translate All Strings (tasks T13–T19 are [P])
- [x] T13 �?Shared: Sidebar, SceneCard, ProgressStepper, badges
- [x] T14 �?Dashboard page
- [x] T15 �?Daily Practice flow
- [x] T16 �?Interview Practice flow
- [x] T17 �?Review flow
- [x] T18 �?History flow
- [x] T19 �?Flashcard flow

### Phase 4 �?Quality & Polish
- [x] T20 �?Translation completeness test (CI gate)
- [ ] T21 �?Full test suite baseline
- [ ] T22 �?Layout smoke test in zh-CN
- [ ] T23 �?E2E tests (Playwright)
- [ ] T24 �?Anti-flash inline script
