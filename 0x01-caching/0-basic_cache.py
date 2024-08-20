#!/usr/bin/env python3
"""
A caching system inheriting from BaseCache
class
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    A caching system with no limit
    """
    def put(self, key, item):
        """
        Assigns to the dictionary self.cache_data
        the item value for the key key
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        Returns the value in self.cache_data linked to key
        """
        if key is None:
            return None
        return self.cache_data.get(key)
