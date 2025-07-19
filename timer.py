import tkinter as tk
import keyboard

class TimerApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Timer")
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.geometry("+10+10")
        self.label = tk.Label(self.root, text="0:00", font=("Helvetica", 24), bg="black", fg="white")
        self.label.pack()
        self.remaining = 0
        self.running = False
        keyboard.add_hotkey('n', lambda: self.start_timer(5 * 60))
        keyboard.add_hotkey('space', self.toggle_pause)
        self.update()

    def start_timer(self, seconds):
        self.remaining = seconds
        self.running = True

    def toggle_pause(self):
        self.running = not self.running

    def update(self):
        if self.running and self.remaining > 0:
            self.remaining -= 1
        minutes, seconds = divmod(self.remaining, 60)
        self.label.config(text=f"{minutes}:{seconds:02d}")
        self.root.after(1000, self.update)

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    TimerApp().run()
