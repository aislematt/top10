import json

import os


class Config():
    config = None

    @staticmethod
    def load_config():
        with open(os.path.join(os.path.dirname(__file__),'../../config/config.json')) as json_data_file:
            global config
            config = json.load(json_data_file)

    @staticmethod
    def get_config():
        return config
