#!/usr/bin/env python3
"""
Task 1
"""

import csv
import math
from typing import List


def index_range(page, page_size):
    """
    Return a tuple of size two containing a start index and an end index
    corresponding to the range indexes to return in a list
    for those particular pagination parameters
    """
    start = page * page_size - page_size
    end = page * page_size
    return (start, end)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Get page from dataset
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0

        data = self.dataset()

        try:
            start, end = index_range(page, page_size)
            return data[start:end]
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        method that takes the same arguments (and defaults)
        as get_page and returns a dictionary containing
        the following key-value pairs:

        page_size: the length of the returned dataset page
        page: the current page number
        data: the dataset page (equivalent to return from previous task)
        next_page: number of the next page, None if no next page
        prev_page: number of the previous page, None if no previous page
        total_pages: the total number of pages in the dataset as an integer
        """

        data = self.get_page(page, page_size)
        total_pages = math.ceil(len(self.dataset()) / page_size)

        return {"page_size": page_size, "page": page,
                "data": data,
                "next_page": page + 1 if page + 1 <= total_pages else None,
                "prev_page": page - 1 if page > 1 else None,
                "total_pages": total_pages}
