import asyncio
from urllib import response
import websockets
import json, sys, datetime, aiohttp

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

async def roomWebSocket(player_id: str, roomId: str):
    async with websockets.connect("ws://web:5555/trpc") as websocket:
        data = json.dumps(
          {
            "id": 5,
            "method": "subscription",
            "params": {
              "input": {
                "json": {
                  "playerId": player_id,
                  "roomId": roomId
                }
              },
              "path": "stream.gameStream"
            }
          }
        )
        await websocket.send(data)

        try:
            while True:  # メッセージを聞き続ける
                response = await websocket.recv()
                res_dic = json.loads(response)
                print(res_dic)
                if(res_dic["result"]["type"] == "data"):
                    if(res_dic["result"]["data"]["json"]["eventType"] == "changePhase" and res_dic["result"]["data"]["json"]["phase"] == "VOTING"):
                        print(res_dic["result"]["data"]["json"]["phase"])
                        res = await send_player_skipPhase(player_id)
                        print(res)
                # if(await send_room_state(roomId) == "VOTING"):
                #     res = await send_player_skipPhase(player_id)
                #     print(res)
                
        except websockets.exceptions.ConnectionClosed:
            print("接続が閉じられました")

    return 0

def playGame(playerName:str, roomId:str):
    with ApiClient(CONFIG.api_config) as client:
        instance = DefaultApi(client)
        player_result = create_player(instance, f"cffnpwr{str(p)}")
        if is_successful(player_result):
            player = player_result.unwrap()

            room = join_room(instance, player["id"], str(args[1]))
            pprint(room)
        else:
            pprint(player_result.failure())
            exit(1)

        asyncio.get_event_loop().run_until_complete(roomWebSocket(player["id"], room.id))

async def send_player_skipPhase(player_id:str):
    # ベースURLとエンドポイント
    base_url = "http://web:5555/api"
    endpoint = "/game/skipPhase"

    # リクエストボディに含めるJSONデータ
    json_data = {
        "playerId": player_id
    }

    # POSTリクエストを送信
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{base_url}{endpoint}", json=json_data) as response:
            data = await response.json()
            return data

async def send_room_state(room_id:str):
    # ベースURLとエンドポイント
    base_url = "http://web:5555/api"
    endpoint = f"/room/{room_id}"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{base_url}{endpoint}") as response:
            if response.status == 200:
                data = await response.json()
                print(data["phase"])
                return data["phase"]
            else:
                # エラーハンドリング
                return None

if __name__ == "__main__":
    args = sys.argv
    if len(args) == 1:
        print("合言葉を入れてください")
        sys.exit(1)
    elif len(args) == 2:
        playerCount = 1
    elif int(args[2]) > 7:
        playerCount = 7
    else:
        playerCount = int(args[2])

    players = []
    for p in range(playerCount):
        players.append(Process(target=playGame, args=(f"cffnpwr{p+7}", args[1])))
        players[p].start()

    try:
        for p in range(playerCount):
            players[p].join()
    except KeyboardInterrupt:
        print("ユーザーによってプログラムが終了されました")
        sys.exit(0)
