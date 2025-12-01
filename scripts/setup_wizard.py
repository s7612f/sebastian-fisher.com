import os
import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path
import subprocess
import shutil


class SetupWizard(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Chronos Health Setup")
        self.geometry("520x520")
        self.resizable(False, False)
        self.inputs = {}
        self._build_form()

    def _build_form(self):
        frame = ttk.Frame(self, padding=12)
        frame.pack(fill=tk.BOTH, expand=True)
        fields = [
            ("DOMAIN", "Domain (example.com)", "localhost"),
            ("EMAIL", "Notification email", "user@example.com"),
            ("SECRET_KEY", "JWT / encryption key", "change-me"),
            ("BACKUP_BACKEND", "Backup backend (local|rclone)", "local"),
            ("RCLONE_REMOTE", "rclone remote (optional)", ""),
            ("SMTP_HOST", "SMTP host", ""),
            ("SMTP_USER", "SMTP user", ""),
            ("SMTP_PASSWORD", "SMTP password", ""),
            ("DEXCOM_API_KEY", "Dexcom API key", ""),
            ("TANDEM_API_KEY", "Tandem API key", ""),
            ("OURA_CLIENT_ID", "Oura client id", ""),
            ("FITBIT_CLIENT_ID", "Fitbit client id", ""),
        ]
        for idx, (key, label, default) in enumerate(fields):
            ttk.Label(frame, text=label).grid(row=idx, column=0, sticky=tk.W, pady=4)
            entry = ttk.Entry(frame, width=40)
            entry.insert(0, os.environ.get(key, default))
            entry.grid(row=idx, column=1, sticky=tk.EW)
            self.inputs[key] = entry

        ttk.Button(frame, text="Run health check", command=self.check_hardware).grid(row=len(fields), column=0, pady=10)
        ttk.Button(frame, text="Save & Launch", command=self.save_and_launch).grid(row=len(fields), column=1, pady=10)

    def check_hardware(self):
        ram_gb = self._get_ram_gb()
        cpu_count = os.cpu_count() or 1
        warning = ""
        if ram_gb is not None and ram_gb < 8:
            warning += f"Low RAM detected ({ram_gb:.1f} GB). AI models may run slowly.\n"
        if cpu_count < 4:
            warning += f"Low CPU core count ({cpu_count})."
        messagebox.showinfo("Hardware", warning or "Hardware looks good for local AI.")

    def _get_ram_gb(self):
        try:
            import psutil  # type: ignore
            return psutil.virtual_memory().total / (1024 ** 3)
        except Exception:
            if hasattr(os, 'sysconf') and 'SC_PAGE_SIZE' in os.sysconf_names:
                pages = os.sysconf('SC_PHYS_PAGES')
                page_size = os.sysconf('SC_PAGE_SIZE')
                return (pages * page_size) / (1024 ** 3)
        return None

    def save_and_launch(self):
        env_lines = []
        for key, widget in self.inputs.items():
            env_lines.append(f"{key}={widget.get()}\n")
        Path('.env').write_text(''.join(env_lines))
        messagebox.showinfo("Saved", "Configuration saved to .env. Docker will now start.")
        self.destroy()
        subprocess.call(["bash", "./scripts/start_stack.sh"])


def run():
    app = SetupWizard()
    app.mainloop()


if __name__ == "__main__":
    run()
