# PlayerCreateDefaultResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **str** |  | 
**code** | **str** |  | 
**issues** | [**List[PlayerCreateDefaultResponseIssuesInner]**](PlayerCreateDefaultResponseIssuesInner.md) |  | [optional] 

## Example

```python
from caffe_break_client.models.player_create_default_response import PlayerCreateDefaultResponse

# TODO update the JSON string below
json = "{}"
# create an instance of PlayerCreateDefaultResponse from a JSON string
player_create_default_response_instance = PlayerCreateDefaultResponse.from_json(json)
# print the JSON string representation of the object
print PlayerCreateDefaultResponse.to_json()

# convert the object into a dict
player_create_default_response_dict = player_create_default_response_instance.to_dict()
# create an instance of PlayerCreateDefaultResponse from a dict
player_create_default_response_form_dict = player_create_default_response.from_dict(player_create_default_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


