from flask import Flask
from flask.json.provider import DefaultJSONProvider
import asyncio
import websockets
import json, sys, aiohttp, random
from multiprocessing import Process
from pprint import pprint
from caffe_break_client.api_client import ApiClient
from caffe_break_client.api.default_api import DefaultApi
from returns.pipeline import is_successful
from src.clients.player_create import create_player
from src.clients.room_join import join_room
from src.config import CONFIG




app = Flask(__name__)
json_provider = DefaultJSONProvider(app)
json_provider.ensure_ascii = False
app.json = json_provider

@app.route("/createnpc/<aikotoba>/<player_count>", methods=["GET"])
def start_game(aikotoba, player_count=1):

    i = int(player_count)
    process = None
    try:
        process = Process(target=create_npc, args=(i, aikotoba))
        process.start()
    except Exception as e:
        return {"error": str(e)}, 500

    return {"message": "ゲームが正常に開始されました"}, 200



async def roomWebSocket(player_id: str, roomId: str):
    async with websockets.connect("ws://web:5555/trpc") as websocket:
      # intなら1年運用しないからMDHMSmsでいいんじゃないですかね
      # 実際長いこれstr使えるならPID+MSでいい気ガス
      data = json.dumps(
        {
      "id": player_id,
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

      while True:  # メッセージを聞き続ける
        try:
          response = await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
          print("接続が閉じられました")

          return 0

        res_dic = json.loads(response)
        print(res_dic)
        if(res_dic["result"]["type"] == "data"):
            match res_dic["result"]["data"]["json"]["eventType"]:
                case "changePhase":
                    match res_dic["result"]["data"]["json"]["phase"]:
                        case "VOTING":
                            res = await rand_voting(roomId, player_id)
                            print(res)
                        case "DISCUSSION":
                            print(res_dic["result"]["data"]["json"]["phase"])
                            res = await send_player_skipPhase(player_id)
                            print(res)
                case "playerUpdate":
                    if(res_dic["result"]["data"]["json"]["status"] == "DEAD"):
                        print("グエー死んだンゴ")
                        exit()

          # if(await send_room_state(roomId) == "VOTING"):
          #     res = await send_player_skipPhase(player_id)
          #     print(res)



def playGame(playerName:str, roomId:str):
    with ApiClient(CONFIG.api_config) as client:
        instance = DefaultApi(client)
        player_result = create_player(instance, f"{playerName}")
        if is_successful(player_result):
            player = player_result.unwrap()

            room = join_room(instance, player["id"], roomId)
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

async def rand_voting(room_id:str, player_id:str):
    base_url = "http://web:5555/api"
    endpoint = f"/room/{room_id}"

    async with aiohttp.ClientSession() as session:
        async with session.get(f"{base_url}{endpoint}") as response:
            if response.status == 200:
                data = await response.json()
            else:
                # エラーハンドリング
                return "Don't get Room State"
        players = data["players"]
        targetPlayers = []

        # 気合の生きているPの取得
        #プロデューサーじゃないよ
        for p in players:
            if(p["status"] == "ALIVE" and p["id"] != player_id):
                targetPlayers.append(p)

        # リクエストボディに含めるJSONデータ
        json_data = {
            "playerId": player_id,
            "target": targetPlayers[random.randrange(0, len(targetPlayers), 1)]["id"]
        }

        # POSTリクエストを送信
        async with session.post(f"{base_url}/game/vote", json=json_data) as response:
            data = await response.json()
            return data



def create_npc(playerCount:int, roomPassword):
    players = []
    for p in range(playerCount):
        players.append(Process(target=playGame, args=(f"cffnpwr{p}", roomPassword)))
        players[p].start()

    for p in range(playerCount):
      try:
        players[p].join()
      except KeyboardInterrupt:
        print("ユーザーによってプログラムが終了されました")
        sys.exit(0)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=6000)
