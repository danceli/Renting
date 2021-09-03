import React, { Component } from 'react'
import { Flex } from 'antd-mobile';

import './index.scss'
const config = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" },
]

class FilterTitle extends Component {
  render() {
    const { titleSelectedStatus, onTitleClick } = this.props;
    return (
      <Flex align="center" className="root">
        {
          config.map(item => (
            <Flex.Item key={item.title} onClick={() => onTitleClick(item.type)}>
              <span className={ titleSelectedStatus[item.type] ? "dropdown selected" : "dropdown" }>
                <span>{ item.title }</span>
                <i className="iconfont icon-arrow"></i>
              </span>
            </Flex.Item>
          ))
        }
      </Flex>
    )
  }
}


export default FilterTitle