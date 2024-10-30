#!/usr/bin/env python3
"""
LFUCache module
"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFUCache defines:
      - constants of your caching system
      - where your data are stored (in a dictionary)
    """

    def __init__(self):
        """Initializes LFUCache instances.
        """
        super().__init__()
        self.frequencies = {}
        self.min_frequency = 1
        self.queue = []

    def put(self, key, item):
        """ Add an item in the cache """
        if key is None or item is None:
            return

        if BaseCaching.MAX_ITEMS <= 0:
            print("Could not insert [{}:{}] as cache max size is <= 0")

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            lfu_keys = [k for k, v in self.frequencies.items() if v ==
                        self.min_frequency]
            i = 0
            lru_key = self.queue[i]
            while i < len(self.queue) - 1 and lru_key not in lfu_keys:
                i += 1
                lru_key = self.queue[i]

            if key not in self.cache_data:
                print("DISCARD:", lru_key)
                del self.cache_data[lru_key]
                del self.frequencies[lru_key]
            self.queue.remove(lru_key)

        self.cache_data[key] = item
        self.queue.append(key)
        self.update_frequency(key)

    def get(self, key):
        """
        `get` gets an item by key and maintains the frequency of its usage.
        """

        if key is not None and key in self.cache_data:
            self.queue.remove(key)
            self.queue.append(key)
            self.update_frequency(key)

        return self.cache_data.get(key)

    def update_frequency(self, key):
        """Returns the key and value of least frequently used item in cache.
        """
        value = self.frequencies.get(key)
        self.frequencies[key] = int(value) + 1 if value is not None else 1
        self.min_frequency = min(self.frequencies.values())
