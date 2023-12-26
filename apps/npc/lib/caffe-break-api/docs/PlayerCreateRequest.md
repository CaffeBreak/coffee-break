# PlayerCreateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 

## Example

```python
from caffe_break_client.models.player_create_request import PlayerCreateRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PlayerCreateRequest from a JSON string
player_create_request_instance = PlayerCreateRequest.from_json(json)
# print the JSON string representation of the object
print PlayerCreateRequest.to_json()

# convert the object into a dict
player_create_request_dict = player_create_request_instance.to_dict()
# create an instance of PlayerCreateRequest from a dict
player_create_request_form_dict = player_create_request.from_dict(player_create_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


