from flask import Flask
import subprocess
import shlex

app = Flask(__name__)

@app.route('/createnpc/<room_id>/<player_count>', methods=['GET'])
def start_game(room_id, player_count=1):
    # 既存のスクリプトを実行するコマンドを準備
    command = f'python __main__.py {room_id} {player_count}'
    args = shlex.split(command)

    try:
        # サブプロセスを開始
        subprocess.Popen(args)
        return {'message': 'ゲームが正常に開始されました'}, 200
    except Exception as e:
        return {'error': str(e)}, 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5432)
