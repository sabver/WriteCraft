# Prompt Templates — Spec to UI Prototype Pipeline

A set of prompt templates and Claude Code commands that transform a requirements spec into ready-to-use prompts for Stitch / AI Studio.

## Pipeline Overview

```
spec.md
  │
  ▼  Step 1: /spec-to-components
frontend_components_spec.md
  │
  ▼  Step 2: /fill-slots
slots.yaml
  │
  ▼  Step 3: /apply-slots (x3)
  ├── prompts/stitch.md
  ├── prompts/build.md
  └── prompts/follow_up.md
        │
        ▼  Step 4: /merge-prompt
  ├── prompts/stitch.merged.md
  ├── prompts/build.merged.md
  └── prompts/follow_up.merged.md
```

## File Structure

```
prompt/
└── template/
    ├── spec_to_frontend_components.md   # Step 1 prompt: spec → component breakdown
    ├── auto_fill_slots.md               # Slot-filling guidelines (used by /fill-slots)
    ├── stitch.md                        # Stitch UI prototype template
    ├── ai_studio_build_mode.md          # AI Studio Build Mode template
    ├── ai_studio_follow_up.md           # AI Studio Follow-up template
    └── slot.md                          # Slot reference list

.claude/commands/
├── spec-to-components.md                # Step 1 command
├── fill-slots.md                        # Step 2 command
├── apply-slots.md                       # Step 3 command
└── merge-prompt.md                      # Step 4 command
```

---

## Step 1: Generate Frontend Component Breakdown

**Input**: `specs/<feature>/spec.md` (requirements document)
**Output**: `specs/<feature>/frontend_components_spec.md`
**Claude Code command**: `/spec-to-components`
**Prompt template**: `prompt/template/spec_to_frontend_components.md`

In Claude Code, run:

```
/spec-to-components specs/default/spec.md
```

This reads the spec, follows the `spec_to_frontend_components.md` prompt template, and generates a detailed frontend component breakdown document containing:
- Page routes
- Component tree structures (ASCII diagrams)
- Component-by-component visual/interaction descriptions
- Concrete example copy and data

The output is automatically saved to `specs/<feature>/frontend_components_spec.md` (derived from the spec path).

---

## Step 2: Auto-Fill Template Slots

**Input**: `specs/<feature>/spec.md` (or `frontend_components_spec.md`)
**Output**: `specs/<feature>/slots.yaml`
**Claude Code command**: `/fill-slots`

In Claude Code, run:

```
/fill-slots specs/default/spec.md
```

This reads the spec, analyzes it against all three prompt templates, and generates a YAML file with every `${slot}` filled in. Values are grouped by template:

- `STITCH TEMPLATE SLOTS` — for UI prototype generation
- `AI STUDIO BUILD MODE SLOTS` — for converting prototype to code
- `AI STUDIO FOLLOW-UP SLOTS` — for hardening code quality

The command will ask whether to save the output to `specs/<feature>/slots.yaml`.

---

## Step 3: Apply Slots to Templates

**Input**: `slots.yaml` + template file
**Output**: completed prompt file
**Claude Code command**: `/apply-slots`

Run these three commands to produce the filled prompts:

```
/apply-slots specs/default/slots.yaml prompt/template/stitch.md specs/default/prompts/stitch.md
```

```
/apply-slots specs/default/slots.yaml prompt/template/ai_studio_build_mode.md specs/default/prompts/build.md
```

```
/apply-slots specs/default/slots.yaml prompt/template/ai_studio_follow_up.md specs/default/prompts/follow_up.md
```

Each command:
1. Reads the YAML and picks the matching section for the template
2. Replaces every `${slot}` with its value
3. Writes the completed prompt to the output path
4. Reports how many slots were filled vs. missing

---

## Step 4: Merge Prompts with Spec

**Input**: filled prompt + spec (+ optional component spec)
**Output**: enriched prompt
**Claude Code command**: `/merge-prompt`

The slot-filling process can lose details or oversimplify requirements. This step cross-references the filled prompts back against the original spec (and optionally the component breakdown) to fill in any gaps.

```
/merge-prompt specs/default/prompts/stitch.md specs/default/spec.md specs/default/frontend_components_spec.md
```

```
/merge-prompt specs/default/prompts/build.md specs/default/spec.md specs/default/frontend_components_spec.md
```

```
/merge-prompt specs/default/prompts/follow_up.md specs/default/spec.md
```

What it does:
1. Reads the filled prompt and the spec sources
2. Identifies missing details, vague values, missing copy, interactions, and states
3. Appends spec-derived content inline (marked with `<!-- from spec -->`)
4. Corrects any inaccuracies (spec is source of truth)
5. Writes the merged result to `<original>.merged.md` (or a custom output path)

**Format with custom output path:**

```
/merge-prompt <filled_prompt> <spec> [component_spec] [output_path]
```

---

## Using the Generated Prompts

After completing all four steps, you'll have three comprehensive prompts:

| File | Where to Use | Purpose |
|------|-------------|---------|
| `prompts/stitch.merged.md` | Google AI Studio (Stitch) | Generate UI prototype variants |
| `prompts/build.merged.md` | Google AI Studio (Build Mode) | Convert prototype into runnable Next.js code |
| `prompts/follow_up.merged.md` | Google AI Studio | Harden code quality, add tests, improve a11y |

### Typical Workflow

1. Paste `prompts/stitch.merged.md` into Stitch -> get UI prototype variants
2. Pick the best variant, export it
3. Paste `prompts/build.merged.md` into AI Studio Build Mode -> get runnable code
4. Iterate on the code
5. Paste `prompts/follow_up.merged.md` into AI Studio -> harden and polish

---

## Quick Reference: All Commands

| Command | Description |
|---------|-------------|
| `/prompt-build <spec_path>` | **One-shot pipeline**: spec → component breakdown → slots → filled prompts → merged prompts |
| `/spec-to-components <spec_path>` | Step 1: Generate frontend component breakdown from a spec |
| `/fill-slots <spec_path>` | Step 2: Generate slots.yaml from a requirements spec |
| `/apply-slots <yaml> <template> <output>` | Step 3: Fill a template with slot values and write output |
| `/merge-prompt <prompt> <spec> [component_spec] [output]` | Step 4: Enrich a filled prompt with details from the spec |
