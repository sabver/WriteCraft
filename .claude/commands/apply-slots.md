---
description: Fill a prompt template with slot values from a YAML file and write to output path
---

You are a template slot filler. Your job is to read slot values from a YAML file, substitute them into a prompt template, and write the completed prompt to a specified output path.

Input: $ARGUMENTS
Format: `<slots_yaml_path> <template_path> <output_path>`

Examples:
  /apply-slots specs/default/slots.yaml prompt/template/stitch.md specs/default/prompts/stitch.md
  /apply-slots specs/default/slots.yaml prompt/template/ai_studio_build_mode.md specs/default/prompts/build.md
  /apply-slots specs/default/slots.yaml prompt/template/ai_studio_follow_up.md specs/default/prompts/follow_up.md

Steps:

1) Parse the three arguments from $ARGUMENTS:
   - Arg 1: Path to the slots YAML file (e.g., specs/default/slots.yaml)
   - Arg 2: Path to the template file (e.g., prompt/template/stitch.md)
   - Arg 3: Path to the output file (e.g., specs/default/prompts/stitch.md)
   If any argument is missing, ask the user to provide it.

2) Read the slots YAML file. Parse every `key: value` pair.
   - For multi-line values (YAML block scalar `|`), preserve the full multi-line content.
   - Ignore comment lines (lines starting with `#`).
   - Ignore section header comments (e.g., `# STITCH TEMPLATE SLOTS`).

3) Read the template file. Identify all `${slot_name}` placeholders.

4) For each placeholder `${slot_name}` in the template:
   - Look up the corresponding key in the parsed YAML.
   - Replace `${slot_name}` with the value. Preserve surrounding formatting.
   - If a slot key is not found in the YAML, leave it as `${slot_name}` unchanged and warn the user.

5) If the YAML contains section groups (Stitch / Build Mode / Follow-up), only use the slots from the section that matches the template being filled:
   - `stitch.md` → use slots under "STITCH TEMPLATE SLOTS"
   - `ai_studio_build_mode.md` → use slots under "AI STUDIO BUILD MODE SLOTS"
   - `ai_studio_follow_up.md` → use slots under "AI STUDIO FOLLOW-UP SLOTS"
   - Slots that appear in multiple sections (e.g., `requirement`) — use the one from the matching section.

6) Write the completed prompt to the output path (Arg 3).
   - Create parent directories if they don't exist.
   - If the output file already exists, ask the user before overwriting.

7) After writing, display a summary:
   - Total slots in template: N
   - Slots filled: N
   - Slots missing (left as placeholder): N (list them)
   - Output written to: <output_path>

Rules:
- Do NOT modify the original template file or the slots YAML file.
- Do NOT change any text in the template that is not a `${slot_name}` placeholder.
- Preserve the template's exact formatting, whitespace, and markdown structure.
- The `[...]` header line at the top of template files should be kept as-is.
