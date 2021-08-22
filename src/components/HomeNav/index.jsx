import { Flex } from 'antd-mobile';
import { HomeNavConfig } from '@/utils/common';
import { withRouter } from 'react-router-dom'
import './index.scss';

const HomeNav = ({history}) => {
  return (
    <Flex className="nav">
      {
        HomeNavConfig.map(item => (
          <Flex.Item key={item.id} onClick={() => history.push(item.path)}>
            <img className="img" src={item.img} alt="" />
            <h3>{item.title}</h3>
          </Flex.Item>
        ))
      }
      
    </Flex>
  )
}

export default withRouter(HomeNav)
