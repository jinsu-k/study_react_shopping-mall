import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import ProductList from '../../components/product/list';
import { GET_PRODUCTS, Products } from '../../graphql/products';
import useInfiniteScroll from '../../hooks/useIntersection';
import { graphqlFetcher, QueryKyes } from '../../queryClient';

const ProductListPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreRef);

  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      QueryKyes.PRODUCTS,
      ({ pageParam = ' ' }) => graphqlFetcher(GET_PRODUCTS, { cursor: pageParam }),
      {
        // next page의 파라미터의 필요한 값을 계산해서 내려주는 메소드
        getNextPageParam: (lastPage, allPage) => {
          return lastPage.products.at(-1)?.id;
        },
      },
    );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [intersecting]);

  return (
    <div>
      <h2>상품목록</h2>
      <ProductList list={data?.pages || []} />
      <div ref={fetchMoreRef} />
    </div>
  );
};

export default ProductListPage;
