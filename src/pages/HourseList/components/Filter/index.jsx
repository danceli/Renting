import React, { Component } from 'react';
import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import FilterMore from '../FilterMore';
import { Spring, animated } from 'react-spring';

import './index.scss'
import axios from '@/http/request';



class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleSelectedStatus: {
        area: false,
        mode: false,
        price: false,
        more: false
      },
      openType: "",  //控制filterPicker或者filterMore的显示隐藏,
      filterData: {},
      //筛选条件选中值
      selectedValues: {
        "area": ['area', "null"],
        "mode": ['null'],
        "price": ['null'],
        "more": []
      }
    }
  }
  renderMask = () => {
    const { openType } = this.state;
    const isHide = (openType === "area" || openType === "mode" || openType === "price")
    return <Spring from={{opacity: 0}} to={{opacity: isHide ? 1 : 0}}>
            
    {styles => {
      const isOpacity = styles.opacity.animation.from;
      if(isHide === false) return null;
      return (
        <animated.div style={styles} className="mask" onClick={() => this.onCancel(openType)}></animated.div>
      )
    }}
    
    </Spring> 
    // return openType === "area" || openType === "mode" || openType === "price" ? <Spring from={{opacity: 0}} to={{opacity: 1}}>
            
    //   {styles => <animated.div style={styles} className="mask" onClick={this.onCancle}></animated.div>}
      
    //   </Spring> 
    //   : null
  }
  getFiltersData = async () => {
    //获取当前定位id
    const { value } = JSON.parse(localStorage.getItem('curCity'));
    const { data } = await axios.get(`/houses/condition?id=${value}`);
    this.setState({
      filterData: data.body
    })
  }
  renderFilterPicker = () => {
    const { openType, filterData: { area, subway, rentType, price }, selectedValues } = this.state;
    if(openType !== "area" && openType !== "price" && openType !== "mode") return null;

    let data = [];
    let cols = 3;
    const defaultSelectVal = selectedValues[openType];
    switch(openType) {
      case "area":
        data = [area, subway];
        cols = 3;
        break;
      case 'mode':
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1
        break;
      default:
        break;

    }
    return <FilterPicker key={openType} defaultSelectVal={defaultSelectVal} type={openType} cols={cols} data={data} onSave={this.onSave} onCancel={this.onCancel} />
  }
  componentDidMount() {
    this.getFiltersData();
    this.body = document.querySelector("body");
  }
  onTitleClick = (type) => {
    // 在显示遮罩层的时候让body->overflow -> hidden取消滚动
    this.body.classList.add('body-fixed');
    const { titleSelectedStatus, selectedValues } = this.state;

    //创建新的标题选中状态
    const newTitleSelectStatus = {...titleSelectedStatus};
    Object.keys(titleSelectedStatus).forEach(key => {
      if(type === key) {
        newTitleSelectStatus[key] = true;
      } else {
        //其他标题
        const selectVal = selectedValues[key];

        if(key === "area" && (selectVal.length !== 2 || selectVal[0] !== 'area')) {
          newTitleSelectStatus[key] = true;
        } else if(key === "mode" && selectVal[0] !== "null") {
          newTitleSelectStatus[key] = true;
        } else if(key === "price" && selectVal[0] !== 'null') {
          newTitleSelectStatus[key] = true;
        } else if(key === "more" && selectVal.length !== 0) {
          newTitleSelectStatus[key] = true;
        } else {
          newTitleSelectStatus[key] = false;
        }
      }
    })
    this.setState({
      titleSelectedStatus: newTitleSelectStatus,
      openType: type
    })
  }
  onCancel = (type) => {
    const { selectedValues, titleSelectedStatus } = this.state,
          selectVal = selectedValues[type],
          newTitleSelectStatus = {...titleSelectedStatus};
    //再点取消的时候看看当前title是否有选中的值，选中的话就高亮，没选中不高亮
    if(type === "area" && (selectVal.length !== 2 || selectVal[0] !== 'area')) {
      newTitleSelectStatus[type] = true;
    } else if(type === "mode" && selectVal[0] !== "null") {
      newTitleSelectStatus[type] = true;
    } else if(type === "price" && selectVal[0] !== 'null') {
      newTitleSelectStatus[type] = true;
    } else if(type === "more" && selectVal.length !== 0) {
      newTitleSelectStatus[type] = true;
    } else {
      newTitleSelectStatus[type] = false;
    }
      
    this.setState({
      openType: '',
      titleSelectedStatus: {...newTitleSelectStatus}
    })
    //再关闭对话框中移除body的限制滚动类
    this.body.classList.remove("body-fixed");
  }
  onSave = (type, value) => {
    this.body.className = ""
    const { titleSelectedStatus } = this.state;

    const selectVal = value;
    const newTitleSelectStatus = {...titleSelectedStatus};
   
    //再点确定的时候看看当前title是否有选中的值，选中的话就高亮，没选中不高亮
    if(type === "area" && (selectVal.length !== 2 || selectVal[0] !== 'area')) {
      newTitleSelectStatus[type] = true;
    } else if(type === "mode" && selectVal[0] !== "null") {
      newTitleSelectStatus[type] = true;
    } else if(type === "price" && selectVal[0] !== 'null') {
      newTitleSelectStatus[type] = true;
    } else if(type === "more" && selectVal.length !== 0) {
      newTitleSelectStatus[type] = true;
    } else {
      newTitleSelectStatus[type] = false;
    }
    


    this.setState({
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      },
      openType: '',
      titleSelectedStatus: {...newTitleSelectStatus}
    }, () => {
          //获取筛选值
        const filters = {};
        const { area, mode, price, more } = this.state.selectedValues;
        let areaValue = "null";

        if(area.length === 3) {
          areaValue = area[2] !== "null" ? area[2] : area[1];
        }
        filters[area[0]] = areaValue;
        filters.mode = mode[0];
        filters.price = price[0];
        filters.more = more.join(",");
        this.props.onFilter(filters);
      });
  }
  render() {
    const { titleSelectedStatus, selectedValues, openType, filterData: { roomType, oriented, floor, characteristic } } = this.state;
    const data = { roomType, oriented, floor, characteristic };
    return (
      <div className="filter">
        {/* 遮罩层 */}
        {
          this.renderMask()
        }
        
        <div className="filter-content">
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onTitleClick={this.onTitleClick}/>

          { this.renderFilterPicker() }
          {/* 更多筛选栏 */}
          { openType === "more" && <FilterMore onCancel={this.onCancel} selectedVal={selectedValues[openType]} openType={openType} onSave={this.onSave} data={data} /> }
        </div>
      </div>
    )
  }
}

export default Filter;