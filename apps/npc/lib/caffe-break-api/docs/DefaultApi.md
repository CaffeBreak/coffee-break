# caffe_break_client.DefaultApi

All URIs are relative to *http://web:5555/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**game_start**](DefaultApi.md#game_start) | **POST** /game/{roomId} | 
[**player_create**](DefaultApi.md#player_create) | **POST** /player | 
[**room_create**](DefaultApi.md#room_create) | **POST** /room | 
[**room_delete**](DefaultApi.md#room_delete) | **DELETE** /room/{roomId} | 
[**room_join**](DefaultApi.md#room_join) | **POST** /room/join | 
[**room_leave**](DefaultApi.md#room_leave) | **POST** /room/leave | 


# **game_start**
> object game_start(room_id, room_leave_request)



### Example


```python
import time
import os
import caffe_break_client
from caffe_break_client.models.room_leave_request import RoomLeaveRequest
from caffe_break_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://web:5555/api
# See configuration.py for a list of all supported configuration parameters.
configuration = caffe_break_client.Configuration(
    host = "http://web:5555/api"
)


# Enter a context with an instance of the API client
with caffe_break_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = caffe_break_client.DefaultApi(api_client)
    room_id = 'room_id_example' # str | 
    room_leave_request = caffe_break_client.RoomLeaveRequest() # RoomLeaveRequest | 

    try:
        api_response = api_instance.game_start(room_id, room_leave_request)
        print("The response of DefaultApi->game_start:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->game_start: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **room_id** | **str**|  | 
 **room_leave_request** | [**RoomLeaveRequest**](RoomLeaveRequest.md)|  | 

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**0** | Error response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **player_create**
> PlayerCreate200Response player_create(player_create_request)



### Example


```python
import time
import os
import caffe_break_client
from caffe_break_client.models.player_create200_response import PlayerCreate200Response
from caffe_break_client.models.player_create_request import PlayerCreateRequest
from caffe_break_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://web:5555/api
# See configuration.py for a list of all supported configuration parameters.
configuration = caffe_break_client.Configuration(
    host = "http://web:5555/api"
)


# Enter a context with an instance of the API client
with caffe_break_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = caffe_break_client.DefaultApi(api_client)
    player_create_request = caffe_break_client.PlayerCreateRequest() # PlayerCreateRequest | 

    try:
        api_response = api_instance.player_create(player_create_request)
        print("The response of DefaultApi->player_create:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->player_create: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **player_create_request** | [**PlayerCreateRequest**](PlayerCreateRequest.md)|  | 

### Return type

[**PlayerCreate200Response**](PlayerCreate200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**0** | Error response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **room_create**
> RoomCreate200Response room_create(room_create_request)



### Example


```python
import time
import os
import caffe_break_client
from caffe_break_client.models.room_create200_response import RoomCreate200Response
from caffe_break_client.models.room_create_request import RoomCreateRequest
from caffe_break_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://web:5555/api
# See configuration.py for a list of all supported configuration parameters.
configuration = caffe_break_client.Configuration(
    host = "http://web:5555/api"
)


# Enter a context with an instance of the API client
with caffe_break_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = caffe_break_client.DefaultApi(api_client)
    room_create_request = caffe_break_client.RoomCreateRequest() # RoomCreateRequest | 

    try:
        api_response = api_instance.room_create(room_create_request)
        print("The response of DefaultApi->room_create:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->room_create: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **room_create_request** | [**RoomCreateRequest**](RoomCreateRequest.md)|  | 

### Return type

[**RoomCreate200Response**](RoomCreate200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**0** | Error response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **room_delete**
> object room_delete(player_id, room_id)



### Example


```python
import time
import os
import caffe_break_client
from caffe_break_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://web:5555/api
# See configuration.py for a list of all supported configuration parameters.
configuration = caffe_break_client.Configuration(
    host = "http://web:5555/api"
)


# Enter a context with an instance of the API client
with caffe_break_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = caffe_break_client.DefaultApi(api_client)
    player_id = 'player_id_example' # str | 
    room_id = 'room_id_example' # str | 

    try:
        api_response = api_instance.room_delete(player_id, room_id)
        print("The response of DefaultApi->room_delete:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->room_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **player_id** | **str**|  | 
 **room_id** | **str**|  | 

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**0** | Error response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **room_join**
> RoomCreate200Response room_join(room_create_request)



### Example


```python
import time
import os
import caffe_break_client
from caffe_break_client.models.room_create200_response import RoomCreate200Response
from caffe_break_client.models.room_create_request import RoomCreateRequest
from caffe_break_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://web:5555/api
# See configuration.py for a list of all supported configuration parameters.
configuration = caffe_break_client.Configuration(
    host = "http://web:5555/api"
)


# Enter a context with an instance of the API client
with caffe_break_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = caffe_break_client.DefaultApi(api_client)
    room_create_request = caffe_break_client.RoomCreateRequest() # RoomCreateRequest | 

    try:
        api_response = api_instance.room_join(room_create_request)
        print("The response of DefaultApi->room_join:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->room_join: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **room_create_request** | [**RoomCreateRequest**](RoomCreateRequest.md)|  | 

### Return type

[**RoomCreate200Response**](RoomCreate200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**0** | Error response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **room_leave**
> RoomCreate200Response room_leave(room_leave_request)



### Example


```python
import time
import os
import caffe_break_client
from caffe_break_client.models.room_create200_response import RoomCreate200Response
from caffe_break_client.models.room_leave_request import RoomLeaveRequest
from caffe_break_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://web:5555/api
# See configuration.py for a list of all supported configuration parameters.
configuration = caffe_break_client.Configuration(
    host = "http://web:5555/api"
)


# Enter a context with an instance of the API client
with caffe_break_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = caffe_break_client.DefaultApi(api_client)
    room_leave_request = caffe_break_client.RoomLeaveRequest() # RoomLeaveRequest | 

    try:
        api_response = api_instance.room_leave(room_leave_request)
        print("The response of DefaultApi->room_leave:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->room_leave: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **room_leave_request** | [**RoomLeaveRequest**](RoomLeaveRequest.md)|  | 

### Return type

[**RoomCreate200Response**](RoomCreate200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful response |  -  |
**0** | Error response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

