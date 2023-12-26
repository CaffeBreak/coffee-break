import toml
from caffe_break_client.configuration import Configuration

class Config:

  def __init__(self) -> None:
    with open("config.toml", mode="w+") as f:
      config = toml.load(f)

      self.api_base_url: str = config.get("api_base_url", "http://web:5555/api")
      self.api_config = Configuration(
        host = self.api_base_url,
      )

CONFIG = Config()
