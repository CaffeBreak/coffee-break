# coding: utf-8

"""
    Caffe Break API

    No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest
import datetime

from caffe_break_client.models.player_create200_response import PlayerCreate200Response

class TestPlayerCreate200Response(unittest.TestCase):
    """PlayerCreate200Response unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> PlayerCreate200Response:
        """Test PlayerCreate200Response
            include_option is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # uncomment below to create an instance of `PlayerCreate200Response`
        """
        model = PlayerCreate200Response()
        if include_optional:
            return PlayerCreate200Response(
                id = 'w8q6zgckec',
                name = 'k%?x!u'K}qz^',
                role = None,
                status = None,
                room_id = 'w8q6zgckec'
            )
        else:
            return PlayerCreate200Response(
                id = 'w8q6zgckec',
                name = 'k%?x!u'K}qz^',
                role = None,
                status = None,
        )
        """

    def testPlayerCreate200Response(self):
        """Test PlayerCreate200Response"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)

if __name__ == '__main__':
    unittest.main()