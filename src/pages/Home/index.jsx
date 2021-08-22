import React, { Component } from 'react';
import Swiper from '../../components/Swiper';
import HomeNav from '@/components/HomeNav';
import axios from '@/http/request';
import { Grid, Flex, WingBlank } from 'antd-mobile';
import { getCurCity } from '@/utils/ext';

import './index.scss';

class Home extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      swiperData: [],
      groups: [],
      news: [],
      curCityInfo: {}
    }
  }
  getSwiperData = async () => {
    const { data } = await axios.get('/home/swiper');
    const { status, body } = data;
    if(status === 200) {
      this.setState({
        swiperData: [...body]
      })
    }
  }
  getGroup = async () => {
    const { data } = await axios.get("/home/groups");
    this.setState({
      groups: data.body
    })
  }
  getNews = async () => {
    const { data } = await axios.get("/home/news");
    this.setState({
      news: data.body
    })
  }
  getGeoLocation = async () => {
    const ret = await getCurCity();
    this.setState({
      curCityInfo: ret
    })
  }
  componentDidMount() {
    this.getSwiperData();
    this.getGroup();
    this.getNews();
    this.getGeoLocation();
  }
  render() {
    const { swiperData, groups, news, curCityInfo } = this.state;
    return (
      <div className="home">
        {(swiperData && curCityInfo) && <Swiper curCityInfo={curCityInfo} swiperData={swiperData} /> }
        <HomeNav />

        {/* 租房小组 */}
        <div className="group">
          <h3>租房小组</h3>
          <span className="more">更多</span>
        </div>
        <div className="grid-group">
          <Grid
            data={groups}
            square={false}
            hasLine={false}
            columnNum={2}
            renderItem={item => (
              <Flex justify="around" className="list-item">
                <div className="desc">
                  <h3 className="title">{ item.title }</h3>
                  <span className="info">{ item.desc }</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
          )} />
        </div>

        {/* 新闻资讯 */}
        <div className="news">
          <h3 className="new-title">新闻资讯</h3>
          <WingBlank>
            {
              news.map(item => (
                <div className="news-item" key={item.id}>
                  <Flex style={{height: "100%"}}>
                    <div className="imgWrap">
                      <img className="img" src={`http://localhost:8080${item.imgSrc}`} alt="" />
                    </div>
                    <Flex className="content" direction="column" justify="between">
                      <h3>{ item.title }</h3>
                      <Flex className="info" justify="between">
                        <span>{ item.from }</span>
                        <span>{ item.date }</span>
                      </Flex>
                    </Flex>
                  </Flex>
                </div>
              ))
            }
          </WingBlank>
        </div>
      </div>
    )
  }
}

export default Home
