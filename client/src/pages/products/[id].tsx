import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ProductDetail from "../../components/product/detail";
import { QueryKyes, graphqlFetcher } from "../../queryClient";
import { GET_PRODUCT, Product } from "../../graphql/products";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data } = useQuery<{product: Product}>([QueryKyes.PRODUCTS, id], () => graphqlFetcher(GET_PRODUCT, { id }));

  if (!data) return null;

  return (
    <div>
      <h2>상품상세</h2>
      <ProductDetail item={data.product}/>
    </div>
  )
}

export default ProductDetailPage;