import { NavBar } from 'antd-mobile';
import './index.scss';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavHeader = ({ children, history }) => {
  return (
    <NavBar
      className="my-nav-bar"
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => history.go(-1)}
    >
      { children }
    </NavBar>
  )  
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}
export default withRouter(NavHeader)