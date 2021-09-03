import PropTypes from 'prop-types';
import "./index.scss";

const NoHouse = ({ children }) => {

  return (
    <div className="no-house">
      <img src="http://localhost:8080/img/not-found.png" alt="" />
      <p>{ children }</p>
    </div>
  )
}

NoHouse.propTypes = {
  children: PropTypes.string.isRequired
}

export default NoHouse;