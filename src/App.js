import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Router from './Router';

import CityList from './pages/CityList';
import Map from './pages/Map'
import Detail from './pages/Detail';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Router} />
          <Route path="/citylist" component={CityList} />
          <Route path="/map" component={Map} />
          <Route path="/detail/:id" component={Detail} />
          <Redirect from="/" to="/home"/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
