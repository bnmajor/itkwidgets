from pathlib import Path
from aiohttp import web
import socketio
import argparse

from itkwidgets.standalone.config import WS_PORT

sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)

this_dir = Path(__file__).resolve().parent

async def index(request):
    """Serve the client-side application."""
    print(request)
    with open(this_dir / 'index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

@sio.event
def connect(sid, environ):
    print("connect ", sid)

@sio.event
async def chat_message(sid, data):
    print("message ", data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

# app.router.add_static('/static', this_dir / 'static')
app.router.add_get('/', index)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument("--data", type=str, help="path to a data file")
    parser.add_argument("--image", type=str, help="path to an image file")
    parser.add_argument("--label-image", type=str, help="path to a label image file")
    parser.add_argument("--point-sets", type=str, help="path to a point set data file")

    opt = parser.parse_args()

    web.run_app(app, port=WS_PORT)
