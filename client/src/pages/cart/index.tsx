import { useQuery } from "react-query";
import CartList from "../../components/cart";
import { CartType, GET_CART } from "../../graphql/cart";
import { graphqlFetcher, QueryKyes } from "../../queryClient";

const Cart = () => {
  // queryClient에 지정한 캐쉬 정책은 전체적으로 캐쉬 정책을 쓰지 않도록 설정했지만
  // Cart에서는 예외적으로 캐쉬 정책을 풀어서 사용해야함
  const { data } = useQuery(QueryKyes.CART, () => graphqlFetcher(GET_CART), {
    staleTime: 0,
    cacheTime: 1000,
  });
  const cartItems = Object.values(data || {}) as CartType[];

  if (!cartItems.length) return <div>장바구니가 비었어요</div>

  return <CartList items={cartItems} />
}

export default Cart;