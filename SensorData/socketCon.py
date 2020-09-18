import socketio
import time

# standard Python
sio = socketio.Client()
sio.connect('http://localhost:3000')
time.sleep(5)
for i in range(0,5):
    print(sio.emit('',"hello"))
time.sleep(5)
sio.disconnect()