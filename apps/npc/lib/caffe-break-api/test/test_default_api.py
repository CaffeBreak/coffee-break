# coding: utf-8

"""
    Caffe Break API

    No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from caffe_break_client.api.default_api import DefaultApi


class TestDefaultApi(unittest.TestCase):
    """DefaultApi unit test stubs"""

    def setUp(self) -> None:
        self.api = DefaultApi()

    def tearDown(self) -> None:
        pass

    def test_game_start(self) -> None:
        """Test case for game_start

        """
        pass

    def test_player_create(self) -> None:
        """Test case for player_create

        """
        pass

    def test_room_create(self) -> None:
        """Test case for room_create

        """
        pass

    def test_room_delete(self) -> None:
        """Test case for room_delete

        """
        pass

    def test_room_join(self) -> None:
        """Test case for room_join

        """
        pass

    def test_room_leave(self) -> None:
        """Test case for room_leave

        """
        pass


if __name__ == '__main__':
    unittest.main()
