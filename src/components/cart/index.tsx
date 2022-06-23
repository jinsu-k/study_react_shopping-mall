import { createRef, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { CartType } from "../../graphql/cart";
import { checkedCartState } from "../../recoils/cart";
import CartItem from "./item";
import WillPay from "../willPay";

const CartList = ({ items } : { items: CartType[] }) => {
  const navigate = useNavigate();
  const [checkedCartData, setCheckedCartData] = useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>(); 

  useEffect(() => {
    checkedCartData.forEach(item => {
      const itemRef = checkboxRefs.find(ref => ref.current!.dataset.id === item.id)
      if (itemRef) itemRef.current!.checked = true;
    })
    setAllCheckedFromItems();
  }, []);

  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<CartType[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(items[i])
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [items, formData]);

  const handleSubmit = () => {
    if (checkedCartData.length) {
      navigate('/payment');
    } else {
      alert('결제할 대상이 없어요')
    }
  };

  const setAllCheckedFromItems = () => {
    if (!formRef.current) return
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll('select-item').length;
    const allChecked = selectedCount === items.length;
    formRef.current.querySelector<HTMLInputElement>('.select-all')!.checked = allChecked;
  }

  const setItemsCheckedFromAll = (targetInput :HTMLInputElement) => {
    const allChecked = targetInput.checked;
    checkboxRefs.forEach((inputElem => {
      inputElem.current!.checked = allChecked;
    }))
  }

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return
    const targetInput = e?.target as HTMLInputElement;
    if (targetInput && targetInput.classList.contains('select-all')) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }
    const data = new FormData(formRef.current);
    setFormData(data);
  }

  return (
    <div>
      <form ref={formRef} onChange={handleCheckboxChanged}> 
        <label>
          <input className='select-all' name='select-all' type='checkbox'/>
          전체선택
        </label>
        <ul className='cart'>
          {items.map((item, i)=> <CartItem {...item} key={item.id} ref={checkboxRefs[i]}/>)}
        </ul>
      </form>
      <WillPay submitTitle='결제창으로' handleSubmit={handleSubmit} />
    </div>

  )
}

export default CartList;