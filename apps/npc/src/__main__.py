import asyncio
from urllib import response
import websockets
import json, sys, datetime

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

if __name__ == "__main__":
  with ApiClient(CONFIG.api_config) as client:
    instance = DefaultApi(client)
      # 引数0=1の処理
    args = sys.argv
    if(len(args) == 1):
      print("合言葉を入れてください")
      sys.exit(1)

    elif(len(args) == 2):
        playerCount:int = 1
    else:
        playerCount:int = int(args[2])
    # create player
    players = []
    for p in range(playerCount):

      player_result = create_player(instance, f"cffnpwr{str(p)}")
      if is_successful(player_result):
        player = player_result.unwrap()
        players.append(player)

        room = join_room(instance, player["id"], str(args[1]))
        pprint(room)
      else:
        pprint(player_result.failure())
        exit(1)
        asyncio.get_event_loop().run_until_complete(roomWebSocket(room.id))
    pprint(players)

