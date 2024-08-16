#!/usr/bin/python3
"""
Simple helper function for api pagination
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Return a tuple containing start and end index
    """
    end = page_size * page
    start = end - page_size
    return (start, end)
