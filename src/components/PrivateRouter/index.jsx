import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux'
const PrivateRouter = ({ component: Comp, ...rest }) => {
  const { isLogin } = useSelector(state => state.user);
  return (
    <Route {...rest} render={props => isLogin ? <Comp {...props} /> : <Redirect to={{
      pathname: "/login",
      state: {
        pathname: props.location.pathname
      }
    }} />} />
  )
}

export default PrivateRouter;