import React, { Component } from 'react'
import './index.scss';
import { Flex, Toast } from "antd-mobile";
import axios from '@/http/request';
import SearchHeader from '@/components/SearchHeader';
import Filter from './components/Filter';
import Sticky from '@/components/Sticky';

import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';
import HouseItem from '../../components/HouseItem';
import NoHouse from '../../components/NoHouse';
import { getCurCity } from '@/utils/ext';

// const { label, value } = JSON.parse(localStorage.getItem("curCity"));

export default class HourseList extends Component {
  constructor(props) {
    super(props);
    this.filters = {};
    this.state = {
      list: [],
      count: 0,
      loading: false
    }
  }
  async componentDidMount() {
    const { label, value } = await getCurCity();
    this.label = label;
    this.value = value;
    this.searchHouseList();
  }
  onFilter = (filters) => {
    this.filters = filters;
    this.searchHouseList();
  }
  searchHouseList = async () => {
    //每次筛选返回页面顶部
    window.scrollTo(0, 0);
    this.setState({ loading: true });
    Toast.loading("Loading", 0, null, false)
    const { data } = await axios.get("/houses", { 
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
     });
    this.setState({
      list: data.body.list,
      count: data.body.count,
      loading: false
    }, () => {
      const { count } = this.state;
      Toast.hide();
      if(count != 0) {
        Toast.info(`共找到了${count}套房源`, 1, null, true);
      }
    })
  }
  rowRenderer = ({key, index, style}) => {
    const { list } = this.state;
    const data = list[index];
    //判断data是否存在如果不存在渲染Loading
    if(!data) {
      return (
        <div key={key} style={style}>
          <p className="loading"></p>
        </div>
      )
    }
    return (
      <HouseItem key={key} style={style} {...data} />
    )
  }
  //判断列表中的每一项是否加载成功
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  //用来获取更多房屋列表数据
  //该方法的返回值为Promise对象，
  loadMoreRows = ({startIndex, stopIndex}) => {
    return new Promise(resolve => {
      //数据加载完成调用resove即可
      axios.get("/houses", { 
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
       }).then((res) => {
         //合并数据到list
          this.setState({
            list: [...this.state.list, ...res.data.body.list]
          })
          //调用resolve完成
          resolve();
       })

    })
  }
  render() {
    const { count, loading } = this.state;
    const { history } = this.props;
    return (
      <div className="house-list">
        <Flex className="search-box">
          <i className="iconfont icon-back" onClick={() => history.go(-1)}></i>
          <SearchHeader history={history} cityName={this.label} className="noPosi" />
        </Flex>
        {/* 筛选栏 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>
        
        {
          (count === 0 && loading === false) ? <NoHouse>未找到房源,请换个搜索条件吧！</NoHouse>  : (
            <div className="houseItems">
              <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
              >
                {
                  ({onRowsRendered, registerChild}) => (
                    <WindowScroller>
                    {
                      ({height, isScrolling, scrollTop}) => (
                        <AutoSizer>
                          {
                            ({width}) => (
                              <List
                                ref={registerChild}
                                onRowsRendered={onRowsRendered}
                                autoHeight
                                width={width}
                                height={height}
                                rowCount={count}
                                rowHeight={120}
                                rowRenderer={this.rowRenderer}
                                isScrolling={isScrolling}
                                scrollTop={scrollTop}
                              />
                            )
                          }
                        </AutoSizer>
                      )
                    }
                  </WindowScroller>
                  )
                }
              </InfiniteLoader>
              
            </div>
          )
        }
        
        
        
      </div>
    )
  }
}
