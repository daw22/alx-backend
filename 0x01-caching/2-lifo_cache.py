#!/usr/bin/env python3
"""
LIFO caching
"""
from base_caching import BaseCaching
import collections


class LIFOCache(BaseCaching):
    """
    A class that inherits from BaseCaching
    and is a LIFO caching system
    """

    def __init__(self):
        """Initializer"""
        super().__init__()
        self.cache_data = collections.OrderedDict()

    def put(self, key, item):
        """
        Assigns to the dictionary self.cache_data
        the item value for the key
        - discards the last entry if cache reaches
        the limit
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                last_key = list(self.cache_data)[-1]
                del self.cache_data[last_key]
                print("DISCARD:", last_key)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """
        Returns the value in self.cache_data linked to key
        """
        if key is None:
            return None
        return self.cache_data.get(key)
