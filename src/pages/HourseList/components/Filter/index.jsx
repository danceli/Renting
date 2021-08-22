import React, { Component } from 'react';
import FilterTitle from '../FilterTitle';
import FilterPicker from '../FilterPicker';
import './index.scss'



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
      openType: "price"  //控制filterPicker或者filterMore的显示隐藏
    }
  }
  onTitleClick = (type) => {
    const { titleSelectedStatus } = this.state;
    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus,
       [type]: !titleSelectedStatus[type]
      }
    })
  }
  render() {
    const { titleSelectedStatus, openType } = this.state;
    return (
      <div className="filter">
        {/* 遮罩层 */}
        {
          openType === "area" || openType === "mode" || openType === "price"  && <div className="mask"></div>
        }
        
        <FilterTitle  titleSelectedStatus={titleSelectedStatus} onTitleClick={this.onTitleClick}/>

        {
          openType === "area" || openType === "mode" || openType === "price" ? (
            <FilterPicker />
          ) : null
        }
      </div>
    )
  }
}

export default Filter;