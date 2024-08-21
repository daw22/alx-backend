#!/usr/bin/env python3
"""
LFU caching module
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    An implementaion of LFUCache
    """
    def __init__(self):
        """Initializer"""
        super().__init__()
        self.tracker = {}

    def get(self, key):
        """
        Returns the value in self.cache_data linked to key
        """
        if key is None:
            return None
        if key in self.cache_data:
            self.tracker[key] += 1
        return self.cache_data.get(key)

    def put(self, key, item):
        """
        Assigns to the dictionary self.cache_data the item
        value for the key
        """
        if key is None or item is None:
            return
        evict_k = self._place(key)
        self.cache_data.update({key: item})
        if evict_k is not None:
            print("DISCARD:", evict_k)

    def _place(self, key):
        """
        cache replacment logoic
        """
        evc = None
        if key not in self.cache_data:
            if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                evc = min(self.tracker, key=self.tracker.get)
                del self.tracker[evc]
                del self.cache_data[evc]
        self.tracker[key] = self.tracker.get(key, 0) + 1
        return evc
