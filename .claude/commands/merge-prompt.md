---
description: Merge a filled prompt with its requirements spec to produce a richer, fact-checked prompt
---

You are a prompt enrichment specialist. Your job is to merge a slot-filled prompt with its original requirements spec (and optionally a frontend component breakdown) to produce a final prompt that is more comprehensive and grounded in the spec's details.

Input: $ARGUMENTS
Format: `<filled_prompt_path> <spec_path> [component_spec_path] [output_path]`

- Arg 1 (required): Path to the filled prompt (e.g., specs/default/prompts/stitch.md)
- Arg 2 (required): Path to the requirements spec (e.g., specs/default/spec.md)
- Arg 3 (optional): Path to the frontend component breakdown (e.g., specs/default/frontend_components_spec.md)
- Arg 4 (optional): Output path. If omitted, write to `<Arg1 without extension>.merged.md`

Examples:
  /merge-prompt specs/default/prompts/stitch.md specs/default/spec.md
  /merge-prompt specs/default/prompts/stitch.md specs/default/spec.md specs/default/frontend_components_spec.md
  /merge-prompt specs/default/prompts/build.md specs/default/spec.md specs/default/frontend_components_spec.md specs/default/prompts/build_final.md

Steps:

1) Read all input files.

2) Analyze gaps — compare the filled prompt against the spec (and component spec if provided). Look for:

   a) **Missing details**: Features, interactions, or requirements in the spec but absent or oversimplified in the prompt.
      (e.g., specific validation rules, edge cases, user flow branches, error handling)

   b) **Vague values**: Slot values that are generic where the spec has concrete specifics.
      (e.g., "form fields" → exact field names with types/validation; "various components" → actual list)

   c) **Missing copy**: UI text, button labels, placeholders, error messages defined in the spec but not in the prompt.

   d) **Missing interactions**: State transitions, conditional behaviors, or user actions from the spec's user flows.

   e) **Missing states**: Loading, empty, error, or disabled states implied by the spec but not captured.

   f) **Component details**: If component spec is provided, ensure component names, structures, and visual descriptions are reflected.

3) Merge by enriching — preserve the template structure:

   - Keep ALL original template section headings and structure exactly as-is.
   - APPEND or EXPAND bullet points with spec details — never remove existing content.
   - Add missing items inline where they logically belong.
   - Match the formatting style of existing content.
   - If the prompt has per-page sections (PAGE 1, PAGE 2...), enrich each page with its corresponding spec section.

4) Merge rules:

   - PRESERVE everything in the filled prompt. Never shorten.
   - ADD specifics from the spec. Mark additions with `<!-- from spec -->` at end of line.
   - CORRECT inaccuracies where the prompt contradicts the spec (spec is source of truth).
   - DO NOT add sections that don't exist in the template format.
   - DO NOT change section headings, numbering, or nesting level.
   - Keep the same language/locale as the filled prompt.
   - DO NOT invent requirements not in any source file.

5) Write the merged result to the output path.
   If overwriting an existing file, ask the user to confirm.

6) Display a merge summary:
   - Sections enriched: which sections got new content
   - Items added: count of new bullets/details
   - Items corrected: count of fixes (if any)
   - Top additions: the 3-5 most significant details that were added
