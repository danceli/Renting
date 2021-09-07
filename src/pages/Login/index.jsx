import { Component } from 'react';
import NavHeader from '@/components/NavHeader';
import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile';
import { withFormik, Form, Field, ErrorMessage } from 'formik';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { setUserInfo } from '@/store/User/actions';

import * as Yup from 'yup';

import axios from '@/http/request.js';


import styles from './index.module.css';;

class Login extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { values, handleSubmit, user: { isLogin }, history } = this.props;
    const { pathname } = history.location.state;
    if (isLogin) {
      return <Redirect to={pathname} />
    }
    return (
      <div>
        <NavHeader className={styles.noMargin}>
          登录
        </NavHeader>
        <WhiteSpace size="xl" />
        <WingBlank>
          <Form className={styles.form}>
            <div className={styles.formItem}>
              <Field className={styles.input} type="text" name="username" placeholder="请输入账号" />
              {/* <input
                type="text"
                name="username"
                placeholder="请输入账号"
                className={styles.input}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}
            </div>
            <ErrorMessage className={styles.error} name="username" component="div" />
            {/* {errors.username && touched.username && <div className={styles.error}>{errors.username}</div>} */}
            <div className={styles.formItem}>
              <Field className={styles.input} type="password" name="password" placeholder="请输入密码" />
              {/* <input
                type="text"
                name="password"
                type="password"
                placeholder="请输入密码"
                className={styles.input}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              /> */}
            </div>
            {/* {errors.password && touched.password && <div className={styles.error}>{errors.password}</div>} */}
            <ErrorMessage className={styles.error} name="password" component="div" />
          </Form>

          <Flex className={styles.loginBox}>
            <Flex.Item>
              <button className={styles.login} onClick={handleSubmit}>登录</button>
            </Flex.Item>
          </Flex>
        </WingBlank>
        <div className={styles.register}>还没有账号，去注册~</div>
      </div>
    )
  }
}
Login = withFormik({
  mapPropsToValues: () => ({ username: "", password: "" }),
  handleSubmit: async (values, { props }) => {
    const { username, password } = values;
    const { data: { status, body, description } } = await axios.post("/user/login", {
      username, password
    });

    if (status === 200) {
      // 登录成功
      //存储数据到redux中
      props.handleSetup(body.token);
      // props.history.go(-1);

    } else {  //登陆失败
      Toast.info(description, 2, null, false);
    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required("账号为必填项").matches(/^[a-zA-Z_\d]{5,8}$/, "长度为5-8位，只能出现数字,字母,下划线"),
    password: Yup.string().required("密码为必填项").matches(/^[a-zA-Z_\d]{5,12}/, "长度为5-12位，只能出现数字,字母,下划线")
  })
})(Login)

const mapActionsToProps = dispatch => ({
  handleSetup: bindActionCreators(setUserInfo, dispatch)
})

export default connect(state => state, mapActionsToProps)(Login);