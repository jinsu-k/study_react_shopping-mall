import React from 'react';
import GlobalLayout from './pages/_layout';

const Index = React.lazy(() => import('./pages/index'));
const CartIndex = React.lazy(() => import('./pages/cart/index'));
const PaymentIndex = React.lazy(() => import('./pages/payment/index'));
const ProductsIndex = React.lazy(() => import('./pages/products/index'));
const ProductsId = React.lazy(() => import('./pages/products/[id]'));
const AdminIndex = React.lazy(() => import('./pages/admin/index'));

export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      { path: '/', element: <Index />, index: true },
      { path: '/cart', element: <CartIndex />, index: true },
      { path: '/payment', element: <PaymentIndex />, index: true },
      { path: '/products', element: <ProductsIndex />, index: true },
      { path: '/products/:id', element: <ProductsId /> },
      { path: '/admin', element: <AdminIndex />, index: true },
    ],
  },
];

export const pages = [
  { route: '/' },
  { route: '/cart' },
  { route: '/payment' },
  { route: '/products' },
  { route: '/products/:id' },
  { route: '/admin' },
];
