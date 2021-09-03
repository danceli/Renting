import React, { Component } from 'react';
import axios from '@/http/request';
import styles from './index.module.css';

import NavHeader from '@/components/NavHeader';
import { Carousel, Flex } from 'antd-mobile';

class Detail extends Component {
  state = {
    houseDetail: {},
    loading: false
  }
  componentDidMount() {
    this.getHouseDetail();
  }
  getHouseDetail = async () => {
    const { id } = this.props.match.params;
    this.setState({ loading: true })
    const { data } = await axios.get(`/houses/${id}`);
    this.setState({
      houseDetail: data.body,
      loading: false
    })
  }
  renderSwiper = () => {
    const { houseImg } = this.state.houseDetail;

    return houseImg && houseImg.map(item => (
      <a key="item" href="www.baidu.com">
        <img src={"http://localhost:8080" + item} className={styles.imgHeight} alt="" />
      </a>
    ))
  }
  render() {
    const { houseDetail: { community, title, tags, price, roomType, size, floor, oriented }, loading } = this.state;
    console.log(this.state.houseDetail)
    return (
      <div className="detail">
        {/* 导航栏 */}
        <NavHeader 
          className={styles.navNoMargin}
          rightContent={<i key="share" className="iconfont icon-share"></i>}
        >
          { community && community } 
        </NavHeader>
        {/* 轮播图 */}
        <div className={styles.detailSlider}>
          {
            !loading ? <Carousel infinite autoplay={true}>
              { this.renderSwiper() }
            </Carousel> : null
          }
        </div>
        {/* 房屋基本信息 */}
        <div className={styles.info}>
          <h3 className={styles.title}>{ title }</h3>
          <Flex className={styles.tags}>
            <Flex.Item>
              {
                tags && tags.map((item, i) => (
                  <span key={item} className={[styles.tag, styles["tag" + (i + 1)]].join(" ")}>{item}</span>
                ))
              }
            </Flex.Item>
          </Flex>
           {/* 价钱信息 */}
          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{ price }/月</div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{ roomType }</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{ size }平米</div>
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
                { floor }
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
      </div>
    )
  }
}


export default Detail;