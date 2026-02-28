# Debugging Notes

Records of bugs encountered during development, including root cause and resolution, for future reference.

---

## 2026-02-28

### BUG-001: `react-resizable-panels` v4 API rename breaks TS types

**Symptom**
```
Type error: Property 'PanelGroup' does not exist on type 'typeof import("react-resizable-panels")'
```

**Root Cause**
The shadcn/ui-generated `resizable.tsx` uses a namespace import (`import * as ResizablePrimitive`) and references `ResizablePrimitive.PanelGroup` / `PanelResizeHandle`.
`react-resizable-panels` v4 renamed these exports:
- `PanelGroup` → `Group`
- `PanelResizeHandle` → `Separator`

**Fix**
Switch to named imports using the new API names:
```ts
// Before
import * as ResizablePrimitive from "react-resizable-panels"
ResizablePrimitive.PanelGroup / ResizablePrimitive.PanelResizeHandle

// After
import { Group, Panel, Separator } from "react-resizable-panels"
```

**File** [`src/components/ui/resizable.tsx`](../src/components/ui/resizable.tsx)

---

### BUG-002: Turbopack crashes with `reading file …\nul` / OS error 1

**Symptom**
Browser shows "An unexpected Turbopack error occurred" on `localhost:3000`. Dev server output:
```
[project]/src/app/globals.css [app-client] (css)
reading file C:\Users\ye\source_code\WriteCraft\nul
函数不正确。 (os error 1)
```

**Root Cause**
A zero-byte file literally named `nul` existed in the project root.
`nul` is a reserved Windows device name (equivalent to `/dev/null` on Linux). When Turbopack scans the filesystem during CSS processing, attempting to read this file causes a system-level error that crashes the build.

**Fix**
Delete via Git Bash (PowerShell cannot treat it as a regular file):
```bash
rm -f ./nul
```

**Notes**
- `del nul` (CMD) and `Remove-Item nul` (PowerShell) both fail silently or error out
- `git status` showing `?? nul` is the tell-tale sign

**File** Project root

---
