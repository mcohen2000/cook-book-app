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
  const [items, setItems] = useState<Recipe[] | Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasLoadedInitialData = useRef(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const { type, returnTo } = cardProps;

  useEffect(() => {
    if (queryData && queryData[`${type}s`]) {
      const newItemsLength = queryData[`${type}s`].length;

      setItems((prev) => {
        if (page === 1) {
          hasLoadedInitialData.current = true;
          return queryData[`${type}s`];
        }
        return [...prev, ...queryData[`${type}s`]];
      });

      if (newItemsLength < count) setHasMore(false);
      else setHasMore(true);

      setLoadingNextPage(false);
    }
  }, [queryData, page, type]);

  const loadMore = () => {
    if (!hasMore || loadingQuery || fetchingQuery || loadingNextPage) return;
    setLoadingNextPage(true);
    setPage((prev) => prev + 1);
  };
  useEffect(() => {
    // If user is near the end and there are more items, load more
    if (
      hasLoadedInitialData.current &&
      queryData?.total &&
      items.length < queryData?.total &&
      currentIndex >= items.length - preloadOffset &&
      !loadingQuery &&
      !fetchingQuery
    ) {
      loadMore();
    }
  }, [currentIndex, items.length, queryData?.total]);

  return !items.length && loadingQuery ? (
    <p className='text-gray-500'>Loading {`${type}s`}...</p>
  ) : items.length === 0 ? (
    <p className='text-gray-500'>No {`${type}s`} found.</p>
  ) : (
    <Carousel className={`w-full`} setIndex={setCurrentIndex}>
      <CarouselContent className='p-6'>
        {items.map((item) => (
          <CarouselItem
            key={`carousel-${type}-${item._id}`}
            className={itemSize(items.length)}
          >
            <Card {...{ [type]: item, backTo: returnTo }} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={hideBtns(items.length)} />
      <CarouselNext className={hideBtns(items.length)} />
    </Carousel>
  );
}

export default PaginatedCarousel;
