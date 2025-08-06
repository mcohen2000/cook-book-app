import { useEffect, useRef, useState, type JSX } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './Carousel';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Recipe } from '../types/recipe';
import type { Book } from '../types/book';

interface PaginatedCarouselProps {
  userId?: string;
  useQuery: (options?: any) => UseQueryResult<any>;
  Card: (props: any) => JSX.Element;
  cardProps: { type: string; returnTo: { to: string; text: string } };
  preloadOffset: number;
  itemSize: (num: number) => string;
  hideBtns: (num: number) => string;
}

type Item = Recipe | Book;

function PaginatedCarousel({
  useQuery,
  userId,
  Card,
  cardProps,
  preloadOffset,
  itemSize,
  hideBtns,
}: PaginatedCarouselProps) {
  const [page, setPage] = useState(1);
  const count = 6;
  const {
    data: queryData,
    isLoading: loadingQuery,
    isFetching: fetchingQuery,
  } = useQuery({ page, count, userId });
  const [items, setItems] = useState<(Item | null)[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasLoadedInitialData = useRef(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const { type, returnTo } = cardProps;

  useEffect(() => {
    if (queryData && queryData[`${type}s`] && queryData.total !== undefined) {
      const fetchedItems = queryData[`${type}s`];
      const totalCount = queryData.total;
      const newItemsLength = fetchedItems.length;

      setItems((prev) => {
        if (page === 1) {
          // First page: create array with total length, fill with fetched items and nulls
          hasLoadedInitialData.current = true;
          const newArray = new Array(totalCount).fill(null);
          fetchedItems.forEach((item: Item, index: number) => {
            newArray[index] = item;
          });
          return newArray;
        } else {
          // Subsequent pages: update existing array with new items
          const updatedArray = [...prev];
          const startIndex = (page - 1) * count;

          fetchedItems.forEach((item: Item, index: number) => {
            const targetIndex = startIndex + index;
            if (targetIndex < updatedArray.length) {
              updatedArray[targetIndex] = item;
            }
          });

          return updatedArray;
        }
      });

      // Update hasMore based on whether we've loaded all items
      const totalLoadedItems = (page - 1) * count + newItemsLength;
      setHasMore(totalLoadedItems < totalCount);

      setLoadingNextPage(false);
    }
  }, [queryData, page, type, count]);

  const loadMore = () => {
    if (!hasMore || loadingQuery || fetchingQuery || loadingNextPage) return;
    setLoadingNextPage(true);
    setPage((prev) => prev + 1);
  };
  useEffect(() => {
    // If user is near the end and there are more items, load more
    const totalLoadedItems = page * count;
    if (
      hasLoadedInitialData.current &&
      queryData?.total &&
      totalLoadedItems < queryData?.total &&
      currentIndex >= totalLoadedItems - preloadOffset &&
      !loadingQuery &&
      !fetchingQuery
    ) {
      loadMore();
    }
  }, [currentIndex, queryData?.total]);

  return !items.length && loadingQuery ? (
    <p className='text-gray-500'>Loading {`${type}s`}...</p>
  ) : items.length === 0 ? (
    <p className='text-gray-500'>No {`${type}s`} found.</p>
  ) : (
    <Carousel className={`w-full`} setIndex={setCurrentIndex}>
      <CarouselContent className='p-6'>
        {items.map((item, index) =>
          item !== null ? (
            <CarouselItem
              key={`carousel-${type}-${index}`}
              className={itemSize(items.length)}
            >
              <Card {...{ [type]: item, backTo: returnTo }} />
            </CarouselItem>
          ) : (
            <CarouselItem
              key={`carousel-${type}-${index}`}
              className={itemSize(items.length)}
            >
              <div className='bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
                <div className='p-6 h-[200px] flex flex-col justify-between'>
                  Loading...
                </div>
              </div>
            </CarouselItem>
          )
        )}
      </CarouselContent>
      <CarouselPrevious className={hideBtns(items.length)} />
      <CarouselNext className={hideBtns(items.length)} />
    </Carousel>
  );
}

export default PaginatedCarousel;
