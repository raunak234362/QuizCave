# Anti-Cheating Security Implementation

## Overview
Comprehensive anti-cheating system implemented for the QuizCave assessment platform to ensure exam integrity and prevent malpractices.

## Features Implemented

### 1. **Fullscreen Mode Enforcement** 🖥️
- **Auto-enter on Attend**: When students click the "Attend" button, fullscreen mode is automatically requested
- **Backup Request**: AssessmentPage also requests fullscreen on mount as a backup
- **2-Warning System**: Students get **2 warnings** when they exit fullscreen:
  - **Warning 1**: Alert with remaining warnings count, auto re-enters fullscreen
  - **Warning 2**: Same asabove, auto re-enters fullscreen
  - **After 2 warnings**: Test auto-submits immediately
- **Navigation UI Hidden**: Fullscreen mode hides browser navigation UI for distraction-free experience

### 2. **Tab/Window Switching Prevention** 🚫
- **Detection**: Uses Page Visibility API to detect when students switch tabs or minimize window
- **2-Warning System**:
  - **Warning 1**: Alert stating switching is not allowed, 1 warning remaining
  - **Warning 2**: Alert stating switching is not allowed, 0 warnings remaining
  - **After 2 warnings**: Test auto-submits immediately
- **Real-time Monitoring**: Continuously monitors browser visibility state

### 3. **Screenshot Prevention** 📸
Blocks all common screenshot methods across platforms:
- **Windows**:
  - PrintScreen key
  - Ctrl + PrintScreen
  - Shift + PrintScreen
  - Windows + Shift + S (Snipping Tool)
  - Ctrl + Shift + S (Snip & Sketch)
- **macOS**:
  - Cmd + Shift + 3 (Full screenshot)
  - Cmd + Shift + 4 (Partial screenshot)
  - Cmd + Shift + 5 (Screenshot toolbar)
- **Linux**: PrintScreen variations

### 4. **Developer Tools Blocking** 🔧
Multiple layers of protection:
- **Keyboard Shortcuts Blocked**:
  - F12
  - Ctrl + Shift + I (Windows/Linux)
  - Ctrl + Shift + C (Windows/Linux)
  - Ctrl + Shift + J (Windows/Linux)
  - Ctrl + U (View source)
  - Cmd + Option + I/C/J (macOS)
- **Size-based Detection**: Monitors window dimensions to detect if DevTools is opened
  - Checks every 1 second
  - Auto-submits test if DevTools detected
- **Right-click Disabled**: Context menu is completely disabled

### 5. **Copy/Paste Prevention** 📋
- **Keyboard Shortcuts Blocked**:
  - Ctrl/Cmd + C (Copy)
  - Ctrl/Cmd + X (Cut)
  - Ctrl/Cmd + V (Paste)
- **Event Handlers**: Direct copy/cut/paste events are prevented
- **Alerts**: Users are notified that copy/paste is disabled

### 6. **Additional Security Measures** 🔐
- **Text Selection Disabled**: Students cannot select text using mouse
- **Drag & Drop Disabled**: No dragging of content
- **Browser Back/Forward Warning**: Warns before leaving the page
- **Page Refresh Warning**: Confirms before refresh/close

## Technical Implementation

### State Management
```typescript
const [tabSwitchCount, setTabSwitchCount] = useState(0);
const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
const maxTabSwitches = 2; // 2 warnings
const maxFullscreenWarnings = 2; // 2 warnings
```

### Security Hooks
All security measures are implemented using React `useEffect` hooks:
1. Keyboard shortcut blocking (DevTools, Screenshots, Copy/Paste)
2. Enhanced DevTools detection
3. Fullscreen exit monitoring
4. Tab/Window switching detection
5. Before-unload warnings

### Auto-Submission Logic
Uses a ref to maintain stable reference to submission function:
```typescript
const performFinalSubmitRef = useRef<() => Promise<void>>(() => Promise.resolve());
```

This ensures security measures can trigger submission even when dependencies change.

## User Experience Flow

### Starting the Test
1. Student clicks "Attend" button on ContestCard
2. Fullscreen mode is requested
3. If fullscreen fails, user is warned and asked to proceed
4. Assessment loads in fullscreen mode
5. All security measures activate immediately

### During the Test
- Students are confined to fullscreen mode
- Any attempt to:
  - Exit fullscreen → Warning system activates
  - Switch tabs → Warning system activates
  - Take screenshot → Blocked with alert
  - Open DevTools → Auto-submit
  - Copy/paste → Blocked with alert
  - Right-click → Blocked with alert

### Warning System Example
**Fullscreen Exit:**
```
⚠️ Warning 1/2: You exited fullscreen mode!
You have 1 warning remaining.
Please return to fullscreen mode immediately.
```

**After 2 warnings:**
```
🚨 You exited fullscreen mode too many times!
Auto-submitting the test.
```

## Cross-Platform Support
✅ Windows (10/11)
✅ macOS
✅ Linux
✅ Chrome, Firefox, Edge, Safari (latest versions)

## Files Modified

1. **`/src/components/students/contest/ContestCard.tsx`**
   - Added fullscreen request on Attend button click
   - Added error handling for fullscreen failures

2. **`/src/components/students/contest/AssessmentPage.tsx`**
   - Implemented comprehensive anti-cheating system
   - Added state management for warnings
   - Created security useEffect hooks
   - Enhanced keyboard blocking
   - Implemented screenshot prevention
   - Added 2-warning systems for fullscreen and tab switching

## Security Layers Summary

| Layer | Method | Severity | Action |
|-------|--------|----------|--------|
| Fullscreen | Exit detection | Medium | 2 warnings → Auto-submit |
| Tab Switch | Visibility API | Medium | 2 warnings → Auto-submit |
| DevTools | Size + Shortcuts | High | Immediate auto-submit |
| Screenshots | Keyboard blocking | Medium | Block + Alert |
| Copy/Paste | Event prevention | Low | Block + Alert |
| Right-click | Context menu | Low | Block + Alert |
| Text Selection | CSS + JS | Low | Prevent silently |

## Testing Recommendations

To test the anti-cheating system:
1. ✅ Try exiting fullscreen (should warn twice, then submit)
2. ✅ Try switching tabs (should warn twice, then submit)
3. ✅ Try pressing F12 (should show alert and block)
4. ✅ Try taking screenshot (should show alert and block)
5. ✅ Try right-clicking (should show alert and block)
6. ✅ Try copying text (should show alert and block)
7. ✅ Open DevTools by resize (should immediately submit)

## Notes

- **Mobile Devices**: Fullscreen API may behave differently on mobile browsers
- **Browser Compatibility**: Some security features may not work on older browsers
- **Accessibility**: Consider adding exemptions for students with disabilities
- **Backend Validation**: Always validate submissions on the server side as well

## Future Enhancements (Optional)

- 📹 Webcam monitoring (requires permission)
- 🎤 Audio monitoring  
- 🖱️ Mouse movement tracking
- ⌨️ Keystroke pattern analysis
- 📊 Real-time monitoring dashboard for admins
- 🔄 Session recording and playback
