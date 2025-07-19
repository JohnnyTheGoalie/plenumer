# Always-on-Top Timer

This is a small Windows timer utility that stays above all other windows in the top left corner. Use keyboard shortcuts to control the timer.

## Shortcuts

- **n**: start a 5 minute timer
- **space**: pause or resume the timer

The timer will update every second while running. The application uses the `keyboard` and `tkinter` libraries, so make sure they are installed:

```bash
pip install keyboard
```

Run the program with:

```bash
python timer.py
```
