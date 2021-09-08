import React, { Component, lazy, Suspense } from 'react';
import Tab from '../components/TabBar';
import Home from '../pages/Home';
import { Route } from 'react-router-dom';
import { tabConfig } from '../utils/common';


const News = lazy(() => import("../pages/News"));
const Profile = lazy(() => import("../pages/Profile"));
const HourseList = lazy(() => import("../pages/HourseList"));


class Router extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      selectedTab: this.props.location.pathname
    }
  }
  handleSelected = (select) => {
    this.setState({
      selectedTab: select
    }, () => {
      this.props.history.push(this.state.selectedTab)
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  render() {
    const { selectedTab } = this.state;
    return (
      <div style={{ paddingBottom: "50px" }}>
        <Route exact path="/home" component={Home} />
        <Suspense fallback={<div>loading</div>}>
          <Route path="/home/news" component={News} />
          <Route path="/home/list" component={HourseList} />
          <Route path="/home/profile" component={Profile} />
        </Suspense>

        <Tab selectedTab={selectedTab} handleSelected={this.handleSelected} tabConfig={tabConfig} />
      </div>
    )
  }
}

export default Router;