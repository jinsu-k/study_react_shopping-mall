import { gql } from "graphql-tag";

export const EXCUTE_PAY = gql`
  mutation ADD_CART($ids: [ID!]) {
    excutePay(ids: $ids)
  }
`;