---
description: Turn spec into an implementation plan (HOW)
---

Input: $ARGUMENTS (optional constraints / proposed approach)

Steps:
1) Read the target feature spec.md under specs/.
2) Produce specs/<feature>/plan.md including:
   - Architecture overview
   - Data model changes
   - API/contracts (create specs/<feature>/contracts/ if needed)
   - Testing strategy (unit/integration/e2e)
   - Risks & mitigations
3) Keep plan readable; move deep details into implementation-details/ if needed.
4) Ensure every plan item traces back to a requirement in spec.md.
