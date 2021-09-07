import { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Router from './Router';
import { getToken, isAuth } from './utils/auth';
import axios from '@/http/request';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/store/User/actions';
import PrivateRouter from './components/PrivateRouter';
import CityList from './pages/CityList';
import Map from './pages/Map'
import Detail from './pages/Detail';
import Login from './pages/Login';
import Rent from './pages/Rent';
import RentAdd from './pages/Rent/Add';
import RentSearch from './pages/Rent/Search';

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
          <Route path="/home" component={Router} />
          <Route path="/citylist" component={CityList} />
          <PrivateRouter path="/map" component={Map} />
          <Route path="/detail/:id" component={Detail} />
          <Route path="/login" component={Login} />
          <PrivateRouter path="/rent" exact component={Rent} />
          <PrivateRouter path="/rent/add" component={RentAdd} />
          <PrivateRouter path="/rent/search" component={RentSearch} />
          <Redirect from="/" to="/home"/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
