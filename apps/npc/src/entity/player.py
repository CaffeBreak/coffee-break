from typing import Literal, TypedDict

class Player(TypedDict):
  id: str
  name: str
  role: Literal["PENDING"] | Literal["VILLAGER"] | Literal["WEREWOLF"]
  status: Literal["ALIVE"] | Literal["DEAD"]
  room_id: str | None
