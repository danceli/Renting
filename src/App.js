import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Router from './Router';
import { getToken, isAuth } from './utils/auth';
import axios from '@/http/request';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/store/User/actions';
import PrivateRouter from './components/PrivateRouter';
import Loading from '@/components/Loading';

const CityList = lazy(() => import("./pages/CityList"))
const Map = lazy(() => import("./pages/Map"))
const Detail = lazy(() => import("./pages/Detail"));
const Login = lazy(() => import("./pages/Login"));
const Rent = lazy(() => import("./pages/Rent"));
const RentAdd = lazy(() => import("./pages/Rent/Add"));
const RentSearch = lazy(() => import("./pages/Rent/Search"));


function App() {
  const dispatch = useDispatch();
  const setup = async () => {
    if(isAuth()) {
      const token = getToken();
      
      dispatch(setUserInfo(token));
    }
  }
  useEffect(() => {
    setup();
  }, [])
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Suspense fallback={<Loading />}>
            <Route path="/home" component={Router} />
            <Route path="/citylist" component={CityList} />
            <PrivateRouter path="/map" component={Map} />
            <Route path="/detail/:id" component={Detail} />
            <Route path="/login" component={Login} />
            <PrivateRouter path="/rent" exact component={Rent} />
            <PrivateRouter path="/rent/add" component={RentAdd} />
            <PrivateRouter path="/rent/search" component={RentSearch} />
            <Redirect from="/" to="/home"/>
          </Suspense>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
