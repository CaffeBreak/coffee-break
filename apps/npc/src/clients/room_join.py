# これはあくまで適当に作っている突貫工事なので後々いい感じにして

import caffe_break_client
from caffe_break_client.api.default_api import DefaultApi
from caffe_break_client.models.room_create_request import RoomCreateRequest as RoomJoinRequest
from returns.result import Result

from ..config import CONFIG

def join_room(client: DefaultApi, player_id: str, password: str):
  request = RoomJoinRequest(playerId=player_id, password=password)

  joined_room = client.room_join(request)

  return joined_room
