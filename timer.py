import tkinter as tk
from tkinter import messagebox

class TimerApp:
    def __init__(self, master):
        self.master = master
        master.title("Timer")
        master.attributes('-topmost', True)
        master.geometry('+0+0')
        master.resizable(False, False)

        self.remaining = 0
        self.running = False

        self.label = tk.Label(master, text="00:00", font=('Helvetica', 20))
        self.label.pack(padx=10, pady=10)

        master.bind('<Key>', self.key_handler)

    def key_handler(self, event):
        key = event.keysym.lower()
        if key == 'space':
            self.toggle()
        elif key == 'n':
            self.set_timer(5 * 60)
        elif key == 'r':
            self.set_timer(2 * 60)

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
