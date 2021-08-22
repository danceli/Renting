import React, { Component } from 'react'
import './index.scss';
import { Flex } from "antd-mobile";

import SearchHeader from '@/components/SearchHeader';
import Filter from './components/Filter';


const city = JSON.parse(localStorage.getItem("curCity"));

export default class HourseList extends Component {
  render() {
    const { history } = this.props;
    return (
      <div className="house-list">
        <Flex className="search-box">
          <i className="iconfont icon-back" onClick={() => history.go(-1)}></i>
          <SearchHeader history={history} cityName={city.label} className="noPosi" />
        </Flex>
        {/* 筛选栏 */}
        <Filter />
      </div>
    )
  }
}
