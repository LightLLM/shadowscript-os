# Mini-App Integration Test Instructions

## Overview
This document provides instructions for running the mini-app integration tests for ShadowScript OS.

## Test Coverage
The integration tests validate:
- **Requirement 3.5**: GhostPaint save/load functionality
- **Requirement 4.4**: DeadMail message persistence (within 500ms)
- App navigation and state management

## Running the Tests

### Option 1: Browser-Based Tests (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173/test-mini-app-integration.html
   ```

3. Click the "▶ Run All Tests" button

4. Review the test results displayed on the page

### Option 2: Manual Testing in the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser (usually `http://localhost:5173`)

3. Wait for the boot sequence to complete

4. Test GhostPaint:
   - Type `ghostpaint` in the terminal and press Enter
   - Draw some pixels on the canvas
   - Click the "💾 Save" button
   - Verify you see a success message
   - Click the "📂 Load" button
   - Verify your artwork is restored

5. Return to terminal:
   - Close the GhostPaint window (click the X button)
   - Verify you're back at the terminal prompt

6. Test DeadMail:
   - Type `deadmail` in the terminal and press Enter
   - Click "Compose" to create a new message
   - Fill in the recipient, subject, and body
   - Click "Send"
   - Verify the message appears in the inbox
   - Click on the message to read it
   - Verify the message displays correctly

7. Return to terminal:
   - Close the DeadMail window
   - Verify you're back at the terminal prompt

## Test Results

### Expected Outcomes

All tests should pass with the following results:

#### GhostPaint Tests (Requirement 3.5)
- ✓ GhostPaint directory creation
- ✓ Save GhostPaint artwork
- ✓ Load GhostPaint artwork
- ✓ GhostPaint save/load round trip

#### DeadMail Tests (Requirement 4.4)
- ✓ DeadMail directory creation
- ✓ Send email (save to filesystem) - should complete in <500ms
- ✓ Load inbox messages
- ✓ Update email (mark as read)
- ✓ DeadMail message persistence performance - average <500ms

#### Navigation Tests
- ✓ Terminal command parsing for app launch
- ✓ App state management

### Performance Requirements

- **DeadMail persistence**: Must complete within 500ms (Requirement 4.4)
- All file operations should complete within 200ms (Requirement 6.2)

## Troubleshooting

### Tests Fail in Node.js
The tests require browser APIs (localStorage, window) and must be run in a browser environment.

### Storage Errors
If you see storage-related errors:
1. Click "🗑️ Clear Storage" button in the test page
2. Or manually clear localStorage in browser DevTools
3. Re-run the tests

### Performance Issues
If persistence tests fail due to timing:
- Check browser DevTools console for errors
- Verify no other heavy processes are running
- Try running tests in a different browser

## Files Created

- `test-mini-app-integration.html` - Browser-based test runner
- `test-mini-app-integration.test.ts` - Test suite (for reference)
- `run-integration-tests.md` - This documentation

## Validation Checklist

- [ ] GhostPaint can be launched from terminal
- [ ] GhostPaint can save artwork to filesystem
- [ ] GhostPaint can load artwork from filesystem
- [ ] Saved artwork data is preserved (round trip)
- [ ] Can return to terminal from GhostPaint
- [ ] DeadMail can be launched from terminal
- [ ] DeadMail can save messages within 500ms
- [ ] DeadMail can load messages from filesystem
- [ ] DeadMail can update message read status
- [ ] Can return to terminal from DeadMail
- [ ] All app state transitions work correctly
