import asyncio
from urllib import response
import websockets
import json, sys, datetime

from multiprocessing import Process
from time import sleep
from os import getpid, getppid

from pprint import pprint
from caffe_break_client.api_client import ApiClient
from caffe_break_client.api.default_api import DefaultApi
from returns.pipeline import is_successful
from src.clients.player_create import create_player
from src.clients.room_join import join_room
from src.config import CONFIG


async def roomWebSocket(roomId: str, num:int):
  async with websockets.connect("ws://web:5555/trpc") as websocket:
    data = json.dumps(
      {
        "id": (f"roomId"+str(num)),
        "method": "subscription",
        "params": {
          "input": {
            "json": {
              "roomId": roomId
            }
          },
          "path": "stream.gameStream"
        }
      }
    )
    await websocket.send(data)
    response = await websocket.recv()
    print(response)
  return response

def playGame():
    p:int = 1
    tmp = 1111

    with ApiClient(CONFIG.api_config) as client:
      instance = DefaultApi(client)
      player_result = create_player(instance, f"cffnpwr{str(p)}")
      if is_successful(player_result):
        player = player_result.unwrap()

        room = join_room(instance, player["id"], str(tmp))
        pprint(room)
      else:
        pprint(player_result.failure())
        exit(1)

      old_res = None
      while True:
        i = 0
        res = asyncio.get_event_loop().run_until_complete(roomWebSocket(room.id, num=i))
        if res != old_res:
            old_res = res
            print(res)
        sleep(1)  # ここで適切なスリープ時間を設定
        i = i + 1

if __name__ == "__main__":
  playGame()
