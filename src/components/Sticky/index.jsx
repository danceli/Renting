import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class Sticky extends Component {
  placeHolder = createRef(null);
  content = createRef(null);

  handleScroll = () => {
    const { top } = this.placeHolder.getBoundingClientRect();
    if(top < 0) {
      //吸顶
      this.content.classList.add("sticky");
      this.placeHolder.style.height = `${this.props.height}px`;

    } else {
      //取消吸顶
      this.content.classList.remove("sticky")
      this.placeHolder.style.height = "0px";
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll, false);
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        {/* 占位元素 */}
        <div ref={el => this.placeHolder = el}>

        </div>
        {/* 筛选组件 */}
        <div ref={el => this.content = el}>{ children }</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}

export default Sticky;