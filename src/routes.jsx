
import Main from './components/Main';
import ProductDetail from './components/shop/ProductDetail';
import ShopCar from './components/shop/ShopCar';
import AddressManage from './components/pay/AddressManage';
import AddressAdd from './components/pay/AddressAdd';


const routes = {
  path: '/',
  component: Main,
  indexRoute: {component: Main},
  childRoutes: [
    // {
    //   path: 'inbox',
    //   component: Inbox,
    //   childRoutes: [{
    //     path: 'messages/:id',
    //     onEnter: ({ params }, replace) => replace(`/messages/${params.id}`)
    //   }]
    // },
    {path: 'productDetail', component: ProductDetail},
    {path: 'addressManage', component: AddressManage},
    {path: 'addressAdd', component: AddressAdd},
    {path: 'shopCar', component: ShopCar}
  ]
};

export default routes;
