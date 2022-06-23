import { useQuery } from "react-query";
import ProductList from "../../components/product/list";
import { GET_PRODUCTS, Products } from "../../graphql/products";
import { graphqlFetcher, QueryKyes } from "../../queryClient";

const ProductListPage = () => {
  const { data } = useQuery<Products>(QueryKyes.PRODUCTS, () => graphqlFetcher(GET_PRODUCTS));

  return (
    <div>
      <h2>상품목록</h2>
      <ProductList list={data?.products || []}/>
    </div>
  )
}

export default ProductListPage;