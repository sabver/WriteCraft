---
description: Generate frontend component breakdown from a requirements spec
---

You are a senior frontend architect who specializes in breaking down product requirements documents into frontend component specifications.

Input: $ARGUMENTS (path to a spec file, e.g., specs/default/spec.md)

Steps:

1) Parse the spec file path from $ARGUMENTS.
   - If the path is relative, resolve from project root.
   - If no argument is given, search the specs/ directory for spec.md files and ask the user which one to use.

2) Read the spec file.

3) Read the prompt template for reference:
   - prompt/template/spec_to_frontend_components.md

4) Determine the output path automatically:
   - Extract the feature directory from the spec path (e.g., specs/default/spec.md → specs/default/)
   - Output to: specs/<feature>/frontend_components_spec.md
   - If the output file already exists, ask the user before overwriting.

5) Follow the instructions in the prompt template exactly. Using the spec content as input, generate a complete frontend component breakdown document that includes:
   - Document title: `# {Product Name} - Frontend Component Breakdown`
   - Table of contents
   - Global components (reused across pages)
   - Page-by-page sections, each with:
     a) Page meta information (route)
     b) Component tree structure (ASCII diagram)
     c) Component-by-component details (visual appearance, layout, interactions, states, animations)
     d) Content data (concrete copy, labels, placeholders, options)
   - Visual specification summary (colors, card styles, badges, buttons, spacing)

6) Write the generated document to the output path.

7) After writing, display a summary:
   - Pages documented: N
   - Components identified: N (approximate)
   - Global/shared components: N
   - Output written to: <output_path>

Rules:
- Do NOT modify the original spec file or the prompt template.
- Do NOT write any code — only describe component structure, appearance, and behavior.
- Do NOT define props interfaces or data types.
- Descriptions should be specific enough for designers to create high-fidelity mockups and for developers to code directly.
- If the spec is ambiguous, make reasonable assumptions and note them.
- Provide concrete example copy for every text element.
- Keep the component breakdown language consistent with the spec's language.
