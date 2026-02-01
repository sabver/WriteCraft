---
description: Create/update feature spec (WHAT/WHY, no HOW)
---

You are running Spec-Driven Development.

Goal: Turn the request into a complete spec.
Input: $ARGUMENTS

Steps:
1) Determine next feature id (NNN) and create directory: specs/NNN-<short-name>/
2) Write specs/NNN-<short-name>/spec.md with:
   - Problem statement
   - User stories + acceptance criteria (Given/When/Then)
   - Non-functional requirements
   - Out of scope
   - Open questions marked as [NEEDS CLARIFICATION: ...]
3) Do NOT include implementation details (no libraries, no architecture).
4) End with a checklist of unresolved clarifications.
