import { Component } from 'react';

import NavHeader from "@/components/NavHeader";
import HouseItem from '@/components/HouseItem';
import NoHouse from '@/components/NoHouse';
import { Link } from 'react-router-dom';

import axios from '@/http/request';

import styles from './index.module.css';

class Rent extends Component {
  state = {
    houseList: []
  }
  componentDidMount() {
    this.getHouse();
  }
  getHouse = async () => {
    const { data } = await axios.get("/user/houses");
    const { location, history } = this.props;
    if (data.status === 200) {
      this.setState({
        houseList: data.body
      })
    } else {  //token失效
      history.replace("/login", {
        pathname: location.pathname
      })
    }
  }
  renderHouseItem = () => {
    const { houseList } = this.state;
    if (houseList.length > 0) {
      return houseList.map(item => (
        <HouseItem key={item.houseCode} {...item} />
      ))
    } else {
      return <NoHouse>
        <Link to="/rent/add">去添加</Link>
      </NoHouse>
    }
  }
  render() {
    const { history } = this.props;
    console.log(this.state)
    return (
      <div>
        <NavHeader onLeftClick={() => history.go(-1)} className={styles.rentNavHeader}>
          房屋管理
        </NavHeader>
        {this.renderHouseItem()}
      </div>
    )
  }
}

export default Rent;