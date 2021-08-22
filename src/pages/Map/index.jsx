import React, { useEffect, Component } from 'react';
import NavHeader from '@/components/NavHeader';
import { getCurCity } from '@/utils/ext';
import { Toast } from "antd-mobile";

import './index.scss';
import styles from './Index.module.css';
import axios from '@/http/request';


const labelStyle = {
  cursor: "pointer",
  border: '1px solid rgb(255, 0, 0)',
  padding: "0",
  whiteSpace: 'nowrap',
  fontSize: "12px",
  color: 'rgb(255, 255, 255)',
  textAlign: "center"
}
class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      houseList: [],
      isShowList: false
    }
  }
  //渲染覆盖物入口
  //1.接收区域id参数，获取该区域下的房源数据
  //2.获取房源类型以及下级地图缩放级别
  renderOverLays = async (id) => {
    try {
      Toast.loading("loading", 0, null, false);
      const { data } = await axios.get("/area/map?id=" + id);
      Toast.hide();
      //获取渲染级别和类型
      const { nextZoom, type } = this.getTypeAndZoom();
      data.body.forEach(item => {
        //创建覆盖物
        this.createOverLays(item, nextZoom, type)
      })
    } catch(e) {
      Toast.hide();
    }
    
  }
  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区   -> 11 ，范围：>=10 <12
  // 镇   -> 13 ，范围：>=12 <14
  // 小区 -> 15 ，范围：>=14 <16
  getTypeAndZoom = () => {
    // 调用地图的 getZoom() 方法，来获取当前缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type

    // console.log('当前地图缩放级别：', zoom)
    if (zoom >= 10 && zoom < 12) {
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物（区、镇）
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }

    return {
      nextZoom,
      type
    }
  }
  //创建覆盖物
  createOverLays = (data, nextZoom, type) => {
    const { 
      coord: { longitude, latitude },
      label: areaName,
      count, value
     } = data;
    const areaPoint = new window.BMapGL.Point(longitude, latitude)
    if(type === "circle") {
      //区域镇
      this.createCicle(areaPoint, areaName, count, value, nextZoom);
    } else  {
      //小区
      this.createRect(areaPoint, areaName, count, value);
    }
  }
  // getCityInfo = async (value) => {
  //   const { data } = await axios.get(`/area/map?id=${value}`);
  //   return data.body;
  // } 
  createCicle = (point, name, count, value, zoom) => {
    // 创建覆盖物
    const label = new window.BMapGL.Label('', {
      position: point,
      offset: new window.BMapGL.Size(-35, -35)
    })

    // 给 label 对象添加一个唯一标识
    label.id = value

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', () => {
      // 调用 renderOverlays 方法，获取该区域下的房源数据
      this.renderOverLays(value)

      // 放大地图，以当前点击的覆盖物为中心放大地图
      this.map.centerAndZoom(point, zoom)

      // 清除当前覆盖物信息
      this.map.clearOverlays()
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }
  createRect = (point, name, count, value) => {
    const label = new window.BMapGL.Label("", {
      position: point,
      offset: new window.BMapGL.Size(-50, -28)
    })
    label.id = value;
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    label.setStyle(labelStyle);
    label.addEventListener('click', (ev) => {
      this.getHousesList(value);
      //在渲染房屋数据之前调用panBy()方法，移动地图到中间位置
      // 公式
      // 垂直位移: (window.innerHeight -330) / 2) - target.clientY
      // 水平位移: (window.innerWidth / 2) - target.clientX;
      const target = ev.domEvent.changedTouches[0];
      this.map.panBy(window.innerWidth / 2 - target.clientX,
         (window.innerHeight -330) / 2 - target.clientY, );

    })
    this.map.addOverlay(label)
  }
  getHousesList = async (id) => {
    try {
      Toast.loading("加载中", 0, null, false);
      const { data } = await axios.get(`/houses?cityId=${id}`);
      this.setState({
        houseList: data.body.list
      }, () => {
        Toast.hide();
        this.setState({
          isShowList: true
        })
      })
    } catch(e) {
      Toast.hide();
    }
    
  }
  setupMap = async () => {
    //创建地图实例
    this.map = new window.BMapGL.Map("container");
    //获取当前地址信息
    const { label, value } = await getCurCity();
    //创建地址解析器
    const myGeo = new window.BMapGL.Geocoder();
    myGeo.getPoint(label, async (point) => {
      if(point) {
        this.map.centerAndZoom(point, 11);
        this.map.addOverlay(new window.BMapGL.Marker(point));
        // 添加比例尺控件
        this.map.addControl(new window.BMapGL.ScaleControl());
        //添加平移缩放控件
        this.map.addControl(new window.BMapGL.ZoomControl())
        this.map.enableScrollWheelZoom(true);

        //获取区域数据
        this.renderOverLays(value)
        
      } else{
        alert('您选择的地址没有解析到结果！');
      }
    }, label)
    // 设置中心点坐标
    // var point = new window.BMapGL.Point(116.404, 39.915);
    // // 地图初始化，同时设置地图展示级别
    // this.map.centerAndZoom(point, 15);
    this.map.addEventListener("movestart", () => {
      if(this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    }, false);

  }
  componentDidMount() {
    this.setupMap();
  }
  render() {
    const { houseList, isShowList } = this.state;
    return (
      <div className="map">
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container"></div>

        {/* 房源列表 */}
        <div className={[styles.houseList, isShowList ? styles.show : ""].join(" ")}>
          <div className={styles.titleWrap}>
            <div className={styles.listTitle}>房屋列表</div>
            <a href="#" className={styles.more}>更多房源</a>
          </div>
          <div className={styles.houseItems}>
            {
              houseList && houseList.map(item => (
                <div className={styles.house} key={item.houseCode}>
                  <div className={styles.imgWrap}>
                    <img src={`http://localhost:8080${item.houseImg}`} className={styles.img} />
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{ item.desc }</div>
                    <div className={styles.tags}>
                      {
                        item.tags && item.tags.map((cItem,index) => (
                          <span key={cItem} className={[styles.tag, styles[`tag${index + 1}`]].join(" ")}>{cItem}</span>
                        ))
                      }
                    </div>
                    <div className={styles.priceWrap}><span className={styles.price}>{item.price} </span>元/月</div>
                  </div>
                </div>
              ))
            }
            
          </div>
          
        </div>
      </div>
    )
  }
}

export default Map



// const ret = await this.getCityInfo(value);
// ret.forEach(item => {
//   const { coord: { latitude, longitude } } = item;
//   const areaPoint = new window.BMapGL.Point(longitude, latitude)
//   //添加文本覆盖物
//   const myLabel = new window.BMapGL.Label(``, {
//     position: areaPoint,
//     offset: new window.BMapGL.Size(-35, -35)
//   });
//   //给每一个覆盖物添加标识
//   myLabel.id = item.value;

//   myLabel.setContent(`
//     <div class=${styles.bubble}>
//       <p class=${styles.name}>${item.label}</p>
//       <p>${item.count}套</p>
//     </div>
//   `)
//   myLabel.setStyle({                              // 设置label的样式
//     cursor: "pointer",
//     border: '1px solid rgb(255, 0, 0)',
//     padding: "0",
//     whiteSpace: 'nowrap',
//     fontSize: "12px",
//     color: 'rgb(255, 255, 255)',
//     textAlign: "center"
//   })
//   myLabel.addEventListener('click', () => {
//     //放大地图,以点击的覆盖物为中心放大地图
//     this.map.centerAndZoom(areaPoint , 13);
//     //清楚当前覆盖物信息
//     this.map.clearOverlays();

//   }, false);
//   this.map.addOverlay(myLabel); 
// })