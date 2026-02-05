[AI Studio Follow-up Prompt | From runnable demo to maintainable code]

Please harden the existing runnable implementation without changing the already approved visual style (${do_not_change_visual_parts}).

# A) Code quality
- Enforce naming conventions: ${naming_rules}
- Remove any "any" types; tighten props and domain models
- Extract repeated UI into shared components: ${common_components_to_extract}

# B) Performance & boundaries
- Reduce unnecessary client components; keep pure presentational parts as server components
- Large list optimization (if needed): ${list_perf_strategy}

# C) Accessibility & UX details
- Form a11y: label/aria, error associations
- Dialog/Sheet focus management and close behaviors
- Improve error/empty copy: ${ux_copy_improvements}

# D) Testing (optional)
- Testing stack: ${test_stack}
- Critical interaction test cases: ${test_cases}

After changes, output: a change summary, a list of key files touched, and the next 3 recommended steps aligned to ${project_stage}.
