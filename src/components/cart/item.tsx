import { SyntheticEvent } from "react";
import { useMutation } from "react-query";
import { UPDATE_CART, CartType, DELETE_CART } from "../../graphql/cart";
import { getClient, graphqlFetcher, QueryKyes } from "../../queryClient";

const CartItem = ({ id, imageUrl, price, title, amount} : CartType) => {
  const queryClient = getClient();
  const { mutate: updateCart } = useMutation(({ id, amount }: {id: string, amount: number}) => 
    graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      // 뮤테이트전에 view에서 낙관적으로 업데이트를 진행하고
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKyes.CART);
        const prevCart = queryClient.getQueryData<{[key: string]: CartType}>(QueryKyes.CART);
        if(!prevCart?.[id]) return prevCart;

        const newCart = {
          ...(prevCart || {}),
          [id]: { ...prevCart[id], amount }
        }
        queryClient.getQueryData(QueryKyes.CART, newCart)
        return prevCart;
      },
      // 실제 요청 후 성공하면 데이터를 업데이트함
      onSuccess: newValue => { // item 하나에 대한 데이터
        const prevCart = queryClient.getQueryData<{[key: string]: CartType}>(QueryKyes.CART);
        const newCart = {
          ...(prevCart || {}),
          [id]: newValue,
        }
        queryClient.setQueryData(QueryKyes.CART, newCart); // Cart 전체 데이터
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
    updateCart(
      { id , amount }, 
      
    );
  };

  const handleDeleteItem = () => {
    deleteCart({ id });
  }

  return (
    <li className='cart-item'>
      <input className='cart-item__checkbox' type='checkbox' />
      <img className='cart-item__image' src={imageUrl} />
      <p className='cart-item__title'>{title}</p>
      <p className='cart-item__price'>{price}</p>
      <input type='number' className='cart-item__amount' value={amount} onChange={handleUpdateAmount}/>
      <button type='button' className='cart-item__button' onClick={handleDeleteItem}>삭제</button>
    </li>
  )
}
  


export default CartItem;