import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SwiperItem = ({data}) => {
  const [imgHeight, setImgHeight] = useState(200)
  return (
    <Link style={{display: "inline-block", width: "100%", height: imgHeight}} to="http://baidu.com">
      <img 
        style={{width: '100%', verticalAlign: "top"}}
        src={"http://localhost:8080" + data.imgSrc}
        onLoad={() => {
          window.dispatchEvent(new Event("resize"));
          setImgHeight("auto")
        }}
      />
    </Link>
  )
}

export default SwiperItem;