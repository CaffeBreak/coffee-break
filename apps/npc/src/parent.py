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


async def roomWebSocket(roomId: str):
  async with websockets.connect("ws://web:5555/trpc") as websocket:
    data = json.dumps(
      {
        "id": 5,
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

async def playGame(playerName:str, roomId:str):
    with ApiClient(CONFIG.api_config) as client:
      instance = DefaultApi(client)
      player_result = create_player(instance, playerName)
      if is_successful(player_result):
        player = player_result.unwrap()

        room = join_room(instance, player["id"], roomId)
        pprint(room)
      else:
        pprint(player_result.failure())
        exit(1)

      old_res = None
      while True:
        res = asyncio.get_event_loop().run_until_complete(roomWebSocket(room.id))
        if res != old_res:
            old_res = res
            print(res)
        sleep(1)  # ここで適切なスリープ時間を設定

async def parent(password:str, playerCount:int):
  players = []
  for p in range(playerCount):
    players.append(Process(target=playGame, args=(f"cffnpwr{p}", password)))
    players[p].start()

  for p in range(playerCount):
    players[p].join()
