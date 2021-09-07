import { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import { getCity } from '@/utils/city';
import { debounce } from "@/utils/ext";
import axios from '@/http/request';
import styles from './index.module.css';


class Search extends Component {
  cityId = getCity().value;
  t = null
  state = {
    searchTxt: "",
    tipList: []
  }
  handleSearchText = (value) => {
    this.setState({ searchTxt: value }, async () => {
      if (!this.state.searchTxt) {
        this.setState({ tipList: [] });
        return;
      }
      //函数防抖
      if (this.t) {
        clearTimeout(this.t);
      }
      let exec = !this.t;
      this.t = setTimeout(() => {
        this.t = null
      }, 500);
      if (exec) {
        await this.getTipsList();
      }
    })
  }
  getTipsList = async () => {
    const { searchTxt } = this.state;
    const { data } = await axios.get("/area/community", {
      params: {
        name: searchTxt,
        id: this.cityId
      }
    });
    console.log(searchTxt)
    this.setState({ tipList: data.body })
  }
  onTipClick = (item) => {
    this.props.history.replace("/rent/add", {
      name: item.communityName,
      id: item.community
    })
  }
  render() {
    const { searchTxt, tipList } = this.state;
    console.log(tipList)
    return (
      <div className={styles.root}>
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          onChange={this.handleSearchText}
          showCancelButton={true}
        />
        <ul className={styles.tips}>
          {
            tipList && tipList.map(item => (
              <li key={item.communityName} className={styles.tip} onClick={() => this.onTipClick(item)}>{item.communityName}</li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default Search;