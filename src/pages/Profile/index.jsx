import React, { Component } from 'react'
import { Button, Grid, Modal } from 'antd-mobile';
import axios from '@/http/request';
import { connect } from 'react-redux';
import { BASE_URL } from '../../utils/common';
import { unInstall } from '@/store/User/actions';
import { bindActionCreators } from 'redux';
import styles from './index.module.css';
// 菜单数据

const Alert = Modal.alert;

const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]


class Profile extends Component {
  componentDidMount() {

  }
  handleLogout = () => {
    Alert("退出", "你确定要注销账号", [
      { text: "取消" },
      { text: "确定", onPress: () => this.props.logout() }
    ])
  }
  render() {
    const { isLogin, userInfo: { avatar, nickname } } = this.props.user;
    return (
      <div className={styles.profile}>
        <div className={styles.title}>
          <img src="http://localhost:8080/img/profile/bg.png" alt="" />
          <div className={styles.info}>
            <div className={styles.myAvatar}>
              <img className={styles.avatar} src={BASE_URL + (avatar || "/img/profile/avatar.png")} alt="" />
            </div>
            <div className={styles.user}>
              <div className={styles.username}>{nickname || "游客"}</div>
              {
                isLogin ? (
                  <>
                    <div className={styles.auth}>
                      <span onClick={this.handleLogout}>退出</span>
                    </div>
                    <div className={styles.edit}>
                      编辑个人资料
                      <span className={styles.arrow}>
                        <i className="iconfont icon-arrow" />
                      </span>
                    </div>
                  </>
                ) : (
                  <div className={styles.edit}>
                    <Button size="small" type="primary" inline onClick={() => this.props.history.push("/login")}>去登陆</Button>
                  </div>
                )
              }

            </div>
          </div>
        </div>
        {/* 九宫格 */}
        <Grid data={menus} hasLine={false}
          columnNum={3}
          renderItem={(item) => (
            <div className={styles.menuItem}>
              <i className={"iconfont " + item.iconfont}></i>
              <span>
                {item.name}
              </span>
            </div>
          )}
        />
        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={"http://localhost:8080" + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
const mapActionsToProps = dispatch => ({
  logout: bindActionCreators(unInstall, dispatch)
})
export default connect(state => state, mapActionsToProps)(Profile);