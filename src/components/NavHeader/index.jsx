import { NavBar } from 'antd-mobile';
import './index.scss';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavHeader = ({ children, history, className, rightContent }) => {
  return (
    <NavBar
      className={className ? className : ""}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => history.go(-1)}
      rightContent={rightContent && rightContent}
    >
      { children }
    </NavBar>
  )  
}
NavHeader.propTypes = {
  children: PropTypes.string
}
export default withRouter(NavHeader)