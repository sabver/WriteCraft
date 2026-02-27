---
description: One-shot pipeline: spec → frontend_components_spec → slots.yaml → filled prompts → merged prompts
---

You are a pipeline orchestrator. Your job is to run all four prompt-building steps in sequence and produce the final merged prompts without stopping to ask for confirmation at intermediate steps.

Input: $ARGUMENTS (path to a requirements spec file, e.g., specs/default/spec.md)

---

## Overview

This command runs the full pipeline:

```
spec.md
  │  Step 1: spec-to-components
  ▼
frontend_components_spec.md
  │  Step 2: fill-slots
  ▼
slots.yaml
  │  Step 3: apply-slots × 3
  ▼
prompts/stitch.md  prompts/build.md  prompts/follow_up.md
  │  Step 4: merge-prompt × 3
  ▼
prompts/stitch.merged.md  prompts/build.merged.md  prompts/follow_up.merged.md
```

---

## Setup

1) Parse the spec file path from $ARGUMENTS.
   - If no argument is given, search the `specs/` directory for `spec.md` files and ask the user which to use.
   - If the path is relative, resolve from project root.

2) Derive all paths from the spec path. Given `specs/<feature>/spec.md`:
   - `feature_dir`         = `specs/<feature>/`
   - `component_spec`      = `specs/<feature>/frontend_components_spec.md`
   - `slots_yaml`          = `specs/<feature>/slots.yaml`
   - `prompts_dir`         = `specs/<feature>/prompts/`
   - `stitch_prompt`       = `specs/<feature>/prompts/stitch.md`
   - `build_prompt`        = `specs/<feature>/prompts/build.md`
   - `follow_up_prompt`    = `specs/<feature>/prompts/follow_up.md`
   - `stitch_merged`       = `specs/<feature>/prompts/stitch.merged.md`
   - `build_merged`        = `specs/<feature>/prompts/build.merged.md`
   - `follow_up_merged`    = `specs/<feature>/prompts/follow_up.merged.md`

3) If ANY of the output files already exist, warn the user and ask: "These files will be overwritten: [list]. Continue? (yes/no)". If no, abort.

4) Print the plan:
   ```
   Pipeline target: <spec_path>
   Output directory: specs/<feature>/prompts/
   Steps: 4 (spec-to-components → fill-slots → apply-slots ×3 → merge-prompt ×3)
   Starting…
   ```

---

## Step 1 — Generate Frontend Component Breakdown

Print: `[1/4] Generating frontend component breakdown…`

Read:
- The spec file
- `prompt/template/spec_to_frontend_components.md` (for reference)

Follow the instructions in that template exactly. Using the spec content as input, generate a complete frontend component breakdown document:
- Document title: `# {Product Name} - Frontend Component Breakdown`
- Table of contents
- Global components (reused across pages)
- Page-by-page sections, each with:
  a) Page meta information (route)
  b) Component tree structure (ASCII diagram)
  c) Component-by-component details (visual appearance, layout, interactions, states, animations)
  d) Content data (concrete copy, labels, placeholders, options)
- Visual specification summary (colors, card styles, badges, buttons, spacing)

Write the result to `component_spec`. Do not ask for confirmation — always write.

Print: `[1/4] Done → <component_spec>`

---

## Step 2 — Fill Template Slots

Print: `[2/4] Filling template slots…`

Read:
- The spec file
- `component_spec` (just generated)
- `prompt/template/stitch.md`
- `prompt/template/ai_studio_build_mode.md`
- `prompt/template/ai_studio_follow_up.md`
- `prompt/template/auto_fill_slots.md`

Follow the auto_fill_slots guidelines. Generate filled values for every `${slot}` across all three templates. Rules:
- **Extract first**: pull values directly from the spec and component spec
- **Infer second**: for engineering decisions not in the spec, use the project's CLAUDE.md tech stack (Next.js + shadcn/ui + Tailwind + TypeScript + pnpm)
- **Mark inferences**: add `# inferred` comment to values not directly from the spec
- **Be concrete**: no vague placeholders
- **Match language**: keep user-facing copy in the spec's language; technical values in English

Output as YAML grouped into three sections:
- `# STITCH TEMPLATE SLOTS`
- `# AI STUDIO BUILD MODE SLOTS`
- `# AI STUDIO FOLLOW-UP SLOTS`

Write the YAML to `slots_yaml`. Do not ask for confirmation — always write.

Print: `[2/4] Done → <slots_yaml>`

---

## Step 3 — Apply Slots to All Three Templates

Print: `[3/4] Applying slots to templates…`

For each of the three templates, read the YAML and pick the matching section, substitute every `${slot_name}`, and write the output:

**3a — Stitch**
- Template: `prompt/template/stitch.md`
- YAML section: `STITCH TEMPLATE SLOTS`
- Output: `stitch_prompt`

**3b — Build Mode**
- Template: `prompt/template/ai_studio_build_mode.md`
- YAML section: `AI STUDIO BUILD MODE SLOTS`
- Output: `build_prompt`

**3c — Follow-up**
- Template: `prompt/template/ai_studio_follow_up.md`
- YAML section: `AI STUDIO FOLLOW-UP SLOTS`
- Output: `follow_up_prompt`

Rules:
- If a slot key is not found in the YAML section, leave `${slot_name}` unchanged and note it.
- Do NOT modify the original template files or slots YAML.
- Preserve every template's exact formatting, whitespace, and markdown structure.
- Create parent directories (`prompts_dir`) if they don't exist.

Print: `[3/4] Done → stitch.md, build.md, follow_up.md`

---

## Step 4 — Merge Prompts with Spec

Print: `[4/4] Merging prompts with spec…`

For each filled prompt, enrich it by cross-referencing the spec (and component spec). Rules:
- PRESERVE all existing content — never shorten.
- ADD specifics from spec/component spec — mark additions with `<!-- from spec -->`.
- CORRECT inaccuracies (spec is source of truth).
- Do NOT invent requirements not in any source file.
- Keep the same language/locale as the filled prompt.

**4a — Stitch merged**
- Input: `stitch_prompt` + spec + `component_spec`
- Output: `stitch_merged`

**4b — Build merged**
- Input: `build_prompt` + spec + `component_spec`
- Output: `build_merged`

**4c — Follow-up merged**
- Input: `follow_up_prompt` + spec (no component spec needed)
- Output: `follow_up_merged`

Print: `[4/4] Done → stitch.merged.md, build.merged.md, follow_up.merged.md`

---

## Final Summary

Print a summary table:

```
Pipeline complete!

Output files:
  specs/<feature>/frontend_components_spec.md   (component breakdown)
  specs/<feature>/slots.yaml                    (filled slot values)
  specs/<feature>/prompts/stitch.md             (filled Stitch prompt)
  specs/<feature>/prompts/build.md              (filled Build Mode prompt)
  specs/<feature>/prompts/follow_up.md          (filled Follow-up prompt)
  specs/<feature>/prompts/stitch.merged.md      ✓ ready for Stitch
  specs/<feature>/prompts/build.merged.md       ✓ ready for AI Studio Build Mode
  specs/<feature>/prompts/follow_up.merged.md   ✓ ready for AI Studio Follow-up

Next steps:
  1. Paste stitch.merged.md  →  Google AI Studio (Stitch) → get UI prototype variants
  2. Pick best variant, export it
  3. Paste build.merged.md   →  AI Studio Build Mode → get runnable Next.js code
  4. Paste follow_up.merged.md → AI Studio → harden and polish
```

---

## Rules

- Do NOT stop or ask for input at intermediate steps (no "Save to slots.yaml?", no "Overwrite?" mid-pipeline).
- Do NOT modify the original spec file or any template files.
- If a step fails (e.g., a template file is missing), stop the pipeline, report the error clearly, and indicate which step failed and which outputs were already written.
- Run steps strictly in order: each step's output is the next step's input.
