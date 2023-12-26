# RoomCreate200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**password** | **str** |  | 
**owner_id** | **str** |  | 
**phase** | [**RoomCreate200ResponsePhase**](RoomCreate200ResponsePhase.md) |  | 
**players** | [**List[RoomCreate200ResponsePlayersInner]**](RoomCreate200ResponsePlayersInner.md) |  | 
**day** | **int** |  | 

## Example

```python
from caffe_break_client.models.room_create200_response import RoomCreate200Response

# TODO update the JSON string below
json = "{}"
# create an instance of RoomCreate200Response from a JSON string
room_create200_response_instance = RoomCreate200Response.from_json(json)
# print the JSON string representation of the object
print RoomCreate200Response.to_json()

# convert the object into a dict
room_create200_response_dict = room_create200_response_instance.to_dict()
# create an instance of RoomCreate200Response from a dict
room_create200_response_form_dict = room_create200_response.from_dict(room_create200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


