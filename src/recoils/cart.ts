import { atom, selectorFamily, useRecoilValue } from "recoil";

const cartState = atom<Map<string, number>>({
  key: 'cartState', // unique ID (with respect to other atoms/selectors)
  default: new Map(), // default value (aka initial value)
});

export const cartItemSelector = selectorFamily<number | undefined, string>({
  key: 'cartItem',
  get: (id: string) => ({ get }) => {
    const carts = get(cartState);
    return carts.get(id);
  },
  set: (id: string) => ({ get, set }, newValue) => {
    if (typeof newValue === 'number') {
      const newCart = new Map([...get(cartState)]);
      newCart.set(id, newValue);
      set(cartState, newCart);
    }
  }
})