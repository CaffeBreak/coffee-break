# ライブラリのインポート
import json
import requests

# APIに接続するための情報
API_Endpoint = "http://web:5555/api/player"

# APIに送信する情報
headers = {'accept': 'application/json',
          'Content-Type': 'application/json'}
body = {'name':"aaaa"}

# API接続の実行
result = requests.post(API_Endpoint, data=json.dumps(body), headers=headers)
print(result.text)
