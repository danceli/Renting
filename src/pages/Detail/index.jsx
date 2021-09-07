import React, { Component } from 'react';
import axios from '@/http/request';
import styles from './index.module.css';
import { connect } from 'react-redux';
import { BASE_URL } from '@/utils/common';

import NavHeader from '@/components/NavHeader';
import HousePackage from '@/components/HousePackage';
import HouseItem from '@/components/HouseItem';

import { Carousel, Flex, Modal, Toast } from 'antd-mobile';
const Alert = Modal.alert;

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}
const list = [
  '电视', '冰箱', '洗衣机', "空调", "热水器", "沙发", "衣柜", "天然气"
]
class Detail extends Component {
  state = {
    houseDetail: {},
    loading: false,
    isFavorite: false
  }
  componentDidMount() {
    this.getHouseDetail();
    this.checkFavorite()
  }
  getHouseDetail = async () => {
    const { id } = this.props.match.params;
    this.setState({ loading: true })
    const { data } = await axios.get(`/houses/${id}`);
    this.setState({
      houseDetail: data.body,
      loading: false
    }, () => {
      //渲染地图

      this.renderMap(this.state.houseDetail.community, this.state.houseDetail.coord);
    });
  }
  renderSwiper = () => {
    const { houseImg } = this.state.houseDetail;

    return houseImg && houseImg.map(item => (
      <a key="item" href="www.baidu.com">
        <img src={"http://localhost:8080" + item} className={styles.imgHeight} alt="" />
      </a>
    ))
  }
  renderMap = (community, coord) => {
    const map = new window.BMapGL.Map("containerMap");
    const point = new window.BMapGL.Point(coord.longitude, coord.latitude);
    map.centerAndZoom(point, 17);
    const label = new window.BMapGL.Label('', {
      position: point,
      offset: new window.BMapGL.Size(0, -36)
    });
    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label);
  }
  checkFavorite = async () => {
    const { user: { isLogin }, match: { params } } = this.props;
    if (!isLogin) return;
    const { data } = await axios.get(`/user/favorites/${params.id}`);

    if (data.status === 200 && data.body.isFavorite) {
      this.setState({ isFavorite: data.body.isFavorite })
    }
  }
  handleFavorite = async () => {
    const { user: { isLogin }, history, location, match } = this.props;
    if (!isLogin) {    //如果未登录，用Modal提示用户去登录
      Alert("提示", "确认登录后才能收藏房源", [
        { text: "取消" },
        {
          text: "去登录", onPress: () => history.push('/login', {
            pathname: location.pathname
          })
        }
      ])
    }
    const { isFavorite } = this.state;
    const { id } = match.params;

    if (isFavorite) {  //已经收藏, 应该删除收藏
      this.setState({ isFavorite: false })
      const { data } = await axios.delete(`/user/favorites/${id}`);
      if (data.status === 200) {
        Toast.info("取消收藏成功", 1, null, false);
      } else {
        //token超时
        Toast.info("登录超时, 请重新登录", 1, null, false);
      }

    } else {  //未收藏,应该添加收藏
      const { data } = await axios.post(`/user/favorites/${id}`);
      if (data.status === 200) {
        Toast.success("收藏成功", 1, null, false);
        this.setState({ isFavorite: true });
      } else {
        Toast.info("登录超时, 请重新登录", 1, null, false);
      }
    }
  }
  render() {
    const { houseDetail: { community, title, tags, price, roomType, size, floor, oriented, supporting, description }, loading, isFavorite } = this.state;
    return (
      <div className={styles.detail}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navNoMargin}
          rightContent={<i key="share" className="iconfont icon-share"></i>}
        >
          {community && community}
        </NavHeader>
        {/* 轮播图 */}
        <div className={styles.detailSlider}>
          {
            !loading ? <Carousel infinite autoplay={true}>
              {this.renderSwiper()}
            </Carousel> : null
          }
        </div>
        {/* 房屋基本信息 */}
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {
                tags && tags.map((item, i) => (
                  <span key={item} className={[styles.tag, (i + 1 < 3) ? styles["tag" + (i + 1)] : styles.tag3].join(" ")}>{item}</span>
                ))
              }
            </Flex.Item>
          </Flex>
          {/* 价钱信息 */}
          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{price}/月</div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>
                {oriented && oriented.join("、")}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>
        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区: <span className={styles.mapTitleArea}>{community}</span>
          </div>
          <div id="containerMap" className={styles.mapContainer}>

          </div>
        </div>
        {/* 房屋配套     */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {
            (!supporting || supporting.length === 0) ? (
              <div className={styles.noData}>暂无数据</div>
            ) : (
              <HousePackage list={supporting && supporting} />
            )
          }

        </div>
        {/* 房源概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div className={styles.concact}>
            <div className={styles.user}>
              <img className={styles.avatar} src="http://localhost:8080/img/avatar.png" alt="" />
              <div className={styles.userTag}>
                <div>王女士</div>
                <div className={styles.userAuth}><i className={`iconfont icon-auth ${styles.authIcon}`} />已认证房主</div>
              </div>
            </div>
            <div>
              <button className={styles.btn}>发消息</button>
            </div>
          </div>
          <div className={styles.describe}>
            {description ? description : "暂无房间描述..."}
          </div>
        </div>
        {/* 猜你喜欢 */}
        <div className={styles.love}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div>
            {
              recommendHouses.map(item => (
                <HouseItem key={item.id}
                  houseCode={String(item.id)}
                  houseImg={item.src}
                  title={item.title}
                  desc={item.desc}
                  tags={item.tags}
                  price={item.price}
                />
              ))
            }
          </div>
        </div>
        {/* 底部按钮 */}
        <Flex className={styles.bottomAction}>
          <Flex.Item className={styles.actionItem} onClick={this.handleFavorite}>
            <img
              src={BASE_URL + (isFavorite ? "/img/star.png" : "/img/unstar.png")}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>{isFavorite ? "已收藏" : "收藏"}</span>
          </Flex.Item>
          <Flex.Item className={styles.actionItem}>
            <span>电话预约</span>
          </Flex.Item>
          <Flex.Item className={styles.actionItem} style={{ backgroundColor: "#67C23A", color: '#fff' }}>
            <span>在线咨询</span>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}


export default connect(state => state)(Detail);