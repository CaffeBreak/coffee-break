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

from caffe_break_client.models.player_create_default_response_issues_inner import PlayerCreateDefaultResponseIssuesInner

class TestPlayerCreateDefaultResponseIssuesInner(unittest.TestCase):
    """PlayerCreateDefaultResponseIssuesInner unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> PlayerCreateDefaultResponseIssuesInner:
        """Test PlayerCreateDefaultResponseIssuesInner
            include_option is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # uncomment below to create an instance of `PlayerCreateDefaultResponseIssuesInner`
        """
        model = PlayerCreateDefaultResponseIssuesInner()
        if include_optional:
            return PlayerCreateDefaultResponseIssuesInner(
                message = ''
            )
        else:
            return PlayerCreateDefaultResponseIssuesInner(
                message = '',
        )
        """

    def testPlayerCreateDefaultResponseIssuesInner(self):
        """Test PlayerCreateDefaultResponseIssuesInner"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)

if __name__ == '__main__':
    unittest.main()
