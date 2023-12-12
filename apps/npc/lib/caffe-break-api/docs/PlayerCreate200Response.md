# PlayerCreate200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**name** | **str** |  | 
**role** | [**PlayerCreate200ResponseRole**](PlayerCreate200ResponseRole.md) |  | 
**status** | [**PlayerCreate200ResponseStatus**](PlayerCreate200ResponseStatus.md) |  | 
**room_id** | **str** |  | [optional] 

## Example

```python
from caffe_break_client.models.player_create200_response import PlayerCreate200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PlayerCreate200Response from a JSON string
player_create200_response_instance = PlayerCreate200Response.from_json(json)
# print the JSON string representation of the object
print PlayerCreate200Response.to_json()

# convert the object into a dict
player_create200_response_dict = player_create200_response_instance.to_dict()
# create an instance of PlayerCreate200Response from a dict
player_create200_response_form_dict = player_create200_response.from_dict(player_create200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


