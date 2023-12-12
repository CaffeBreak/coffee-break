# RoomCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**player_id** | **str** |  | 
**password** | **str** |  | 

## Example

```python
from caffe_break_client.models.room_create_request import RoomCreateRequest

# TODO update the JSON string below
json = "{}"
# create an instance of RoomCreateRequest from a JSON string
room_create_request_instance = RoomCreateRequest.from_json(json)
# print the JSON string representation of the object
print RoomCreateRequest.to_json()

# convert the object into a dict
room_create_request_dict = room_create_request_instance.to_dict()
# create an instance of RoomCreateRequest from a dict
room_create_request_form_dict = room_create_request.from_dict(room_create_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


