import { useQuery } from "react-query";
import ProductItem from "../../components/item";
import { fetcher, QueryKyes } from "../../queryClient";
import { Product } from "../../types";

const ProductList = () => {
  const { data } = useQuery<Product[]>(QueryKyes.PRODUCTS, () => fetcher({
    method: 'GET',
    path: '/products',
  }));

  return (
    <div>
      <h2>상품목록</h2>
      <ul className="products">
        {data?.map(product => (
          <ProductItem {...product} key={product.id} />
        ))}
      </ul>
    </div>
  )
}

export default ProductList;