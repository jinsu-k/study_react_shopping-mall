import { Resolver } from "./types";

const mockProducts = (() => 
  Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1 + '',
      imageUrl: `https://picsum.photos/id/${i+10}/200/150/`,
      price: 50000,
      title: `임시상품${i+1}`,
      description: `임시상세내용${i+1}`,
      createAt: new Date(1655729878703+(i*1000*60*60*10)).toString()
})))()

const productResolver: Resolver = {
  Query: {
    products: (parent, args, context, info) => {
      return mockProducts;
    },
    product: (parent, { id }, context, info) => {
      const found = mockProducts.find(item => item.id === id);
      if (found) return found;
      return null;
    },
  }, 
  Mutation: {

  }
}

export default productResolver;