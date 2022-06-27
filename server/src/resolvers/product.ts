import { Products, Resolver } from "./types";
import { v4 as uuid } from "uuid";
import { DBField, writeDB } from "../dbController";

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

const productResolver: Resolver = {
  Query: {
    products: (parent, { cursor = "" }, { db }) => {
      const fromIndex =
        db.products.findIndex((product) => product.id === cursor) + 1;
      return db.products.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
  Mutation: {
    addProduct: (parent, { imageUrl, price, title, description }, { db }) => {
      const newProduct = {
        id: uuid(),
        imageUrl,
        price,
        title,
        description,
        createdAt: Date.now(),
      };
      db.products.push(newProduct);
      setJSON(db.products);
      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex < 0) {
        throw new Error("없는 상품입니다.");
      }
      const updateItem = {
        ...db.products[existProductIndex],
        ...data,
      };
      db.products.splice(existProductIndex, 1, updateItem);
      setJSON(db.products);
      return updateItem;
    },
    deleteProduct: (parent, { id }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);
      if (existProductIndex < 0) {
        throw new Error("없는 상품입니다.");
      }
      const deleteItem = {
        ...db.products[existProductIndex],
      };
      delete deleteItem.createdAt;
      db.products.splice(existProductIndex, 1, deleteItem);
      setJSON(db.products);
      return id;
    },
  },
};

export default productResolver;
