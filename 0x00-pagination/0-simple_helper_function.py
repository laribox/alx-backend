#!/usr/bin/env python3
"""task 0
"""


def index_range(page, page_size):
    """
    Return a tuple of size two containing a start index and an end index
    corresponding to the range indexes to return in a list
    for those particular pagination parameters
    """
    start = page * page_size - page_size
    end = page * page_size
    return (start, end)
