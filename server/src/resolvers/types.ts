export type Resolver = {
  [k: string]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any},
      context: {
        db: {
          cart: Cart
          products: Products
        }
      },
      info: any
     ) => any
  }
}

export type Product = {
  id: string
  imageUrl: string
  prcie: number
  title: string
  description: string
  createAt: number
}

export type Products = Product[];

export type CartItem = {
  id: string
  amount: number
}

export type Cart = CartItem[]