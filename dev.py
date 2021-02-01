import subprocess
import sys
import os
import signal

def signal_handler(sig, frame):
    print("kill processes ...")
    pid_a = a.pid
    pid_b = b.pid
    if pid_a is None:
        print("pid a is NONE")
        pass
    elif pid_b is None:
        print("pid b is NONE")
        pass
    else:
        os.kill(pid_a, signal.SIGTERM)
        print("pid_a killed")
        os.kill(pid_b, signal.SIGTERM)
        print("pid_b killed")

    print("goodbye!")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler) #signal register

a = subprocess.Popen(["npm", "run", "dev"], cwd="./react_app")
b = subprocess.Popen([".venv/bin/python3", "app.py"])

a.wait()
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
print("_--------------------_")
b.wait()

print("CTRL + C: to close")

while 1:
    pass
#child_processes.append(a)
#child_processes.append(b)



