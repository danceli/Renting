import React, { Component } from 'react'
import { Spring, animated } from 'react-spring';

import './index.scss';

export default class Profile extends Component {
  state = {
    show: false
  }
  render() {
    const { show } = this.state;
    return (
      <div>
        {
          show && <Spring from={{opacity: 0}} to={{opacity: 1, backgroundColor: "green"}}>
          {styles => (
            <animated.div style={styles} className="mine">
            animated
          </animated.div>
          )}
        </Spring>
        }
        <button onClick={() => {
          this.setState({show: !show})
        }}>toggle</button>
      </div>
    )
  }
}
