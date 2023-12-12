from pprint import pprint
from caffe_break_client.api_client import ApiClient
from caffe_break_client.api.default_api import DefaultApi
from returns.pipeline import is_successful
from src.clients.player_create import create_player
from src.clients.room_join import join_room
from src.config import CONFIG


if __name__ == "__main__":
  with ApiClient(CONFIG.api_config) as client:
    instance = DefaultApi(client)

    # create player
    player_result = create_player(instance, "cffnpwr2")
    if is_successful(player_result):
      player = player_result.unwrap()
      pprint(player)

      room = join_room(instance, player["id"], "cffnpwr")
      pprint(room)

    else:
      pprint(player_result.failure())
