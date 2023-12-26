# RoomLeaveRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**player_id** | **str** |  | 

## Example

```python
from caffe_break_client.models.room_leave_request import RoomLeaveRequest

# TODO update the JSON string below
json = "{}"
# create an instance of RoomLeaveRequest from a JSON string
room_leave_request_instance = RoomLeaveRequest.from_json(json)
# print the JSON string representation of the object
print RoomLeaveRequest.to_json()

# convert the object into a dict
room_leave_request_dict = room_leave_request_instance.to_dict()
# create an instance of RoomLeaveRequest from a dict
room_leave_request_form_dict = room_leave_request.from_dict(room_leave_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


