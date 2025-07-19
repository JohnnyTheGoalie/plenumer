import tkinter as tk
from tkinter import messagebox, ttk

class TimerApp:
    def __init__(self, master):
        self.master = master
        master.title("Timer")
        master.attributes('-topmost', True)
        master.geometry('+0+0')
        master.resizable(False, False)

        self.remaining = 0
        self.running = False

        self.label = ttk.Label(master, text="00:00", font=('Helvetica', 24))
        self.label.pack(padx=10, pady=(10, 5))

        # Dropdown to select timer length
        self.time_var = tk.StringVar(value='5 minutes')
        self.options = {
            '2 minutes': 2 * 60,
            '5 minutes': 5 * 60,
            '10 minutes': 10 * 60,
            '15 minutes': 15 * 60,
        }
        self.dropdown = ttk.OptionMenu(master, self.time_var, self.time_var.get(), *self.options.keys())
        self.dropdown.pack(pady=(0, 5))

        self.start_btn = ttk.Button(master, text="Start", command=self.start_selected_time)
        self.start_btn.pack(pady=(0, 10))

        master.bind('<Key>', self.key_handler)

        # Try to register global hotkeys
        try:
            import keyboard
            self._keyboard = keyboard
            self.register_global_hotkeys()
        except Exception:
            # keyboard library not available or failed
            self._keyboard = None

    def key_handler(self, event):
        key = event.keysym.lower()
        if key == 'space':
            self.toggle()
        elif key == 'n':
            self.set_timer(5 * 60)
        elif key == 'r':
            self.set_timer(2 * 60)

    def start_selected_time(self):
        seconds = self.options.get(self.time_var.get(), 0)
        if seconds:
            self.set_timer(seconds)

    def register_global_hotkeys(self):
        if not self._keyboard:
            return
        self._keyboard.add_hotkey('space', self.toggle)
        self._keyboard.add_hotkey('n', lambda: self.set_timer(5 * 60))
        self._keyboard.add_hotkey('r', lambda: self.set_timer(2 * 60))

    def set_timer(self, seconds):
        self.remaining = seconds
        self.running = True
        self.update_timer()

    def toggle(self):
        if self.remaining > 0:
            self.running = not self.running
            if self.running:
                self.update_timer()

    def update_timer(self):
        if self.running and self.remaining >= 0:
            mins, secs = divmod(self.remaining, 60)
            self.label.config(text=f"{mins:02d}:{secs:02d}")
            if self.remaining == 0:
                self.running = False
                messagebox.showinfo("Timer", "Time is up!")
            else:
                self.remaining -= 1
                self.master.after(1000, self.update_timer)


def main():
    root = tk.Tk()
    app = TimerApp(root)
    root.mainloop()

if __name__ == '__main__':
    main()
