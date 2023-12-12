from pprint import pprint
from caffe_break_client.api.default_api import DefaultApi
from caffe_break_client.models.player_create_request import PlayerCreateRequest
from returns.result import Result, Success, Failure
from src.entity.player import Player

def create_player(client: DefaultApi, name: str) -> Result[Player, str]:
  request = PlayerCreateRequest(name=name)

  created_player = client.player_create(request)
  pprint(created_player)

  maybe_role = created_player.role.actual_instance
  if maybe_role != "PENDING" and maybe_role != "VILLAGER" and maybe_role != "WEREWOLF":
    return Failure("だめだけど、何1")

  maybe_status = created_player.status.actual_instance
  if maybe_status != "ALIVE" and maybe_status != "DEAD":
    return Failure("だめだけど、何2")

  return Success({
    "id": created_player.id,
    "name": created_player.name,
    "role": maybe_role,
    "room_id": created_player.room_id,
    "status": maybe_status,
  })
