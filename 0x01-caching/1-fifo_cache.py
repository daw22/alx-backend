#!/usr/bin/env python3
"""
FIFO caching
"""
from base_caching import BaseCaching
import collections


class FIFOCache(BaseCaching):
    """
    A class that inherits from BaseCaching
    and is a FIFO caching system
    """

    def __init__(self):
        """Initializer"""
        super().__init__()
        self.cache_data = collections.OrderedDict()
        
    def put(self, key, item):
        """
        Assigns to the dictionary self.cache_data
        the item value for the key
        - discards the first entry if cache reaches
        the limit
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data.keys()) > BaseCaching.MAX_ITEMS:
            first_in = list(self.cache_data)[0]
            del self.cache_data[first_in]
            print(f"DISCARD: {first_in}")

    def get(self, key):
        """
        Returns the value in self.cache_data linked to key
        """
        if key is None:
            return None
        return self.cache_data.get(key)
