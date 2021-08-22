import React, { PureComponent } from 'react';
import { TabBar } from 'antd-mobile';
import './index.scss';

class Tab extends PureComponent {

  render() {
    const { selectedTab, handleSelected, tabConfig } = this.props;
    return (
      <TabBar
          tintColor="#21b97a"
          barTintColor="white"
          noRenderContent={true}
        >
          {
            tabConfig.map(item => (
              <TabBar.Item
                title={item.title}
                key={item.title}
                icon={
                  <i className={`iconfont ${item.icon}`}></i>
                }
                selectedIcon={
                  <i className={`iconfont ${item.icon} icon-selected`}></i>
                }
                selected={selectedTab === item.path}
                onPress={() => handleSelected(item.path)}
                data-seed="logId"
              >
              </TabBar.Item>
            ))
          }
        
      </TabBar>
    )
  }
}

export default Tab