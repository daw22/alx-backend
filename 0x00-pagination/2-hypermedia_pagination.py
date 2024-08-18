#!/usr/bin/env python3
"""
Hypermedia pagination
"""
import csv
import math
from typing import List, Tuple, Dict, Union


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Return a tuple containing start and end index
    """
    end = page_size * page
    start = end - page_size
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
        """
        Gets content for the appropriate page number
        and size
        """
        assert isinstance(page, int)
        assert isinstance(page_size, int)
        assert (page > 0 and page_size > 0)

        self.dataset()
        if len(self.__dataset) < page * page_size:
            return []
        start, end = index_range(page, page_size)
        return self.__dataset[start:end]

    def get_hyper(self, page: int = 1,
                  page_size: int = 10
                  ) -> Dict[str, Union[int, List[List], None]]:
        """
        Gets and returns page data with hypermedia
        """
        data = self.get_page(page, page_size)

        if len(self.__dataset) % page_size == 0:
            total_pages = len(self.__dataset) / page_size
        else:
            total_pages = len(self.__dataset) / page_size + 1

        page_size = len(data)
        if page >= total_pages:
            next_page = None
        else:
            next_page = page + 1
        if page == 1:
            prev_page = None
        else:
            prev_page = page - 1

        return {"page_size": page_size, "page": page,
                "data": data, "next_page": next_page,
                "prev_page": prev_page, "total_pages": int(total_pages)}
