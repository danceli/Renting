import React, { Component, createRef } from 'react'
import { Toast } from 'antd-mobile';
import axios from '@/http/request';
import { formatCityList, getCurCity, formatCityLetter } from '@/utils/ext';
import { List, AutoSizer } from 'react-virtualized';
import NavBar from '@/components/NavHeader'

import './index.scss';

const TITLE_HEIGHT = 36,
      NAME_HEIGHT = 50;
const HOUSE_CITY = ["北京", "上海", "广州", "深圳"]
class CityList extends Component {
  constructor(props) {
    super(props);

    this.list = createRef(null)
    this.state = {
      cityList: {},
      cityKey: [],
      activeKey: 0
    }
  }
  getCityList = async () => {
    const { data } = await axios.get('/area/city', {
      params: {
        "level": "1"
      }
    });
    const {cityList, cityKey} = formatCityList(data.body);
    const res = await axios.get('area/hot');
    cityList["hot"] = res.data.body;
    cityKey.unshift("hot");

    //获取当前定位城市
    const curCity = await getCurCity();
    //将当前定位城市添加到cityList, 和cityKey
    cityList['#'] = [curCity];
    cityKey.unshift("#");
    this.setState({
      cityList: cityList,
      cityKey: cityKey
    })
  }
  selectCity = ({label, value}) => {
    if(HOUSE_CITY.includes(label)) {
      localStorage.setItem("curCity", JSON.stringify({ label, value }))
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源信息", 1, null, false);
    }
  }
  rowRenderer = ({key, index, style}) => {
    const { cityKey, cityList } = this.state;
    const letter = cityKey[index];
    const row = cityList[letter];
    return (
      <div key={key} style={style} className="city">
        <div className="city-title">{formatCityLetter(letter)}</div>
        {
          row.map(item => (
            <div className="city-name" key={item.label} onClick={() => this.selectCity(item)}>{item.label}</div>
          ))
        }
      </div>
    )
  }
  onRowsRendered = ({startIndex}) => {
    this.setState({
      activeKey: startIndex
    })
  }
  async componentDidMount() {
    await this.getCityList();

    //调用 measureAllRows, 提前计算List中每一行的高度，实现scrollToRow的精确跳转
    //注意： 调用这个方法的时候，需要保证List组件中已经有了数据，如果List组件中的数据为空，就会导致该方法报错
    this.list.measureAllRows();
  }
  getHeight = ({ index }) => {
    return TITLE_HEIGHT + NAME_HEIGHT * this.state.cityList[this.state.cityKey[index]].length;
  }
  scrollToRow = (key) => {
    this.list.scrollToRow(key)
  }
  render() {
    const { cityKey, cityList, activeKey } = this.state;
    return (
      <div className="city-list">
        
        <NavBar>城市列表</NavBar>  
        {/* 列表渲染 */}
        
        <AutoSizer>
          {({width, height}) => (
            <List
              ref={el => this.list = el}
              width={width}
              height={height}
              rowCount={cityKey.length}
              rowHeight={this.getHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <ul className="city-key">
          {
            cityKey.map((item, index) => (
              <li key={item} className="city-key-item" onClick={() => this.scrollToRow(index)}>
                <span className={ activeKey === index ? "key-active" : "" }>
                  { item === "hot" ? "热门" : item.toLocaleUpperCase() }
                </span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default CityList
