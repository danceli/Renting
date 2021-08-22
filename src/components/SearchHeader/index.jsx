import React from 'react';
import { Flex } from 'antd-mobile';
import PropsType from 'prop-types';

import './index.scss';

const SearchHeader = ({ cityName, history, className }) => {

  return (
    <Flex className={["search-header", className || ""]}>
      <Flex className="search">
        <div className="location" onClick={() => history.push('/cityList')}>
          <span>{ cityName }</span>
          <i className="iconfont icon-arrow"></i>
        </div>
        <div className="search-form" onClick={() => history.push("/search")}>
          <i className="iconfont icon-seach"></i>
          <span>请输入搜索内容</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => history.push('/map')}></i>
    </Flex>
  )
}
SearchHeader.propsType = {
  cityName: PropsType.string.isRequired
}
export default SearchHeader