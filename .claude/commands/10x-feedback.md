---
description: Use Agentation for visual feedback on your app
allowed-tools: ["Read", "WebFetch"]
---

# Agentation Visual Feedback

Use Agentation for desktop-wide visual feedback that integrates with Claude Code.

## How It Works

1. **Run the app in development mode**
   ```bash
   npm run dev
   ```

2. **Look for the Agentation icon** in the bottom-right corner

3. **Click to activate** annotation mode

4. **Hover over elements** to see their names highlighted

5. **Click any element** to add feedback

6. **Copy the markdown** output and paste it back to Claude Code

## What Agentation Captures

- Element selectors (class, id, tag)
- Element positions and bounding boxes
- Text content
- Computed styles
- Accessibility info

## Integration with Claude Code

After annotating elements:
1. Click "Copy" in Agentation
2. Paste the markdown into Claude Code
3. Claude will understand which elements you're referring to
4. Changes can be made precisely based on selectors

## User Request

$ARGUMENTS

## Instructions

1. Ensure the app is running in development mode (`npm run dev`)
2. Guide the user to the Agentation icon
3. Help interpret any feedback they paste
4. Make targeted fixes based on the element selectors provided

## Supported Workflows

- **Bug reports**: "This button doesn't work" + annotation
- **Design feedback**: "This text is too small" + annotation
- **Content changes**: "Update this headline" + annotation
- **Accessibility**: "Can't read this color" + annotation
