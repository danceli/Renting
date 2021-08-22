import React from 'react';
import { Carousel, Flex } from 'antd-mobile';
import SwiperItem from './swiperItem';
import { withRouter } from 'react-router-dom'
import './index.scss';
import SearchHeader from '@/components/SearchHeader';
const Swiper = ({swiperData, history, curCityInfo}) => {
  console.log(curCityInfo)
  return (
    <div className="swiper">
      <Carousel
        autoplay={true}
        infinite
        frameOverflow="hidden"
        slideWidth={1}
      >
        {
          swiperData.map(item => (
          <SwiperItem key={item.id} data={item} />
          ))
        }
      </Carousel>
      <SearchHeader history={history} cityName={curCityInfo.label} />
    </div>
    
  )
}

export default withRouter(Swiper);