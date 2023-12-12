# RoomCreate200ResponsePlayersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**name** | **str** |  | 
**role** | [**PlayerCreate200ResponseRole**](PlayerCreate200ResponseRole.md) |  | 
**status** | [**PlayerCreate200ResponseStatus**](PlayerCreate200ResponseStatus.md) |  | 

## Example

```python
from caffe_break_client.models.room_create200_response_players_inner import RoomCreate200ResponsePlayersInner

# TODO update the JSON string below
json = "{}"
# create an instance of RoomCreate200ResponsePlayersInner from a JSON string
room_create200_response_players_inner_instance = RoomCreate200ResponsePlayersInner.from_json(json)
# print the JSON string representation of the object
print RoomCreate200ResponsePlayersInner.to_json()

# convert the object into a dict
room_create200_response_players_inner_dict = room_create200_response_players_inner_instance.to_dict()
# create an instance of RoomCreate200ResponsePlayersInner from a dict
room_create200_response_players_inner_form_dict = room_create200_response_players_inner.from_dict(room_create200_response_players_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


