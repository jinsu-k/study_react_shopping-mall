import { ForwardedRef, forwardRef, RefObject, SyntheticEvent } from "react";
import { useMutation } from "react-query";
import { UPDATE_CART, CartType, DELETE_CART } from "../../graphql/cart";
import { getClient, graphqlFetcher, QueryKyes } from "../../queryClient";
import ItemData from "./itemData";

const CartItem = ({ id, product: { imageUrl, price, title }, amount} : CartType, ref: ForwardedRef<HTMLInputElement>) => {
  const queryClient = getClient();
  const { mutate: updateCart } = useMutation(({ id, amount }: {id: string, amount: number}) => 
    graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      // 뮤테이트전에 view에서 낙관적으로 업데이트를 진행하고
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKyes.CART);
        const { cart: prevCart } = queryClient.getQueryData<{ cart: CartType[] }>(QueryKyes.CART) || { cart: [] };
        if(!prevCart) return null;

        const targetIndex = prevCart.findIndex(cartItem => cartItem.id === id);
        if(targetIndex === undefined || targetIndex < 0) return prevCart;

        const newCart =  [...prevCart];
        newCart.splice(targetIndex, 1, { ...newCart[targetIndex], amount })
        queryClient.getQueryData(QueryKyes.CART, { cart: newCart })
        return prevCart; 
      },
      // 실제 요청 후 성공하면 데이터를 업데이트함
      onSuccess: updateCart => { // item 하나에 대한 데이터
        const { cart: prevCart } = queryClient.getQueryData<{ cart: CartType[] }>(QueryKyes.CART) || { cart: [] };
        const targetIndex = prevCart?.findIndex(cartItem => cartItem.id === updateCart.id);
        if(!prevCart || targetIndex === undefined || targetIndex < 0) return

        const newCart =  [...prevCart];
        newCart.splice(targetIndex, 1, updateCart)
        queryClient.getQueryData(QueryKyes.CART, { cart: newCart })
        
      }
    }
  )

  const { mutate: deleteCart } = useMutation(({ id }: {id: string}) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKyes.CART)
      }
    }
  )

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    if (amount < 1) return
    updateCart(
      { id , amount }, 
      
    );
  };

  const handleDeleteItem = () => {
    deleteCart({ id });
  }

  return (
    <li className='cart-item'>
      <input className='cart-item__checkbox' type='checkbox' name='select-item' ref={ref} data-id={id}/>
      <ItemData imageUrl={imageUrl} price={price} title={title}/>
      <input type='number' className='cart-item__amount' value={amount} min={1} onChange={handleUpdateAmount}/>
      <button type='button' className='cart-item__button' onClick={handleDeleteItem}>삭제</button>
    </li>
  )
}
  


export default forwardRef(CartItem);