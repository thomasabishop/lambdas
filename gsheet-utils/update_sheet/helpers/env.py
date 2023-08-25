"""Utilities for handling environment variables"""

import os
import json


def get_var(key):
    return json.loads(os.environ[key])
