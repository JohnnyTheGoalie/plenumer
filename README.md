# Always-On-Top Timer

This project provides a small always-on-top timer application for Windows built with Python and Tkinter.

## Usage

1. Ensure Python 3 is installed on your system.
2. Install the optional `keyboard` library if you want to use global hotkeys:
   ```bash
   pip install keyboard
   ```
3. Run the application:
   ```bash
   python timer.py
   ```
4. The window will appear in the top-left corner and remain above other windows.

### Using the Timer

Select a time from the drop-down menu and press **Start** to begin the timer.
You can still use the following hotkeys while the app is focused. If the
`keyboard` package is installed, these hotkeys will also work globally when the
app is in the background:

- **n** – start a 5 minute timer
- **r** – start a 2 minute timer
- **space** – pause or resume the current timer

A message box is shown when the timer reaches zero.
