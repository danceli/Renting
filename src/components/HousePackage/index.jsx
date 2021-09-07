import styles from './index.module.css';
import { useState } from 'react';
//房屋配置
const HOUSE_PACKAGE = [
  {
    id: 1,
    name: '衣柜',
    icon: 'icon-wardrobe'
  },
  {
    id: 2,
    name: '洗衣机',
    icon: 'icon-wash'
  },
  {
    id: 3,
    name: '空调',
    icon: 'icon-air'
  },
  {
    id: 4,
    name: '天然气',
    icon: 'icon-gas'
  },
  {
    id: 5,
    name: '冰箱',
    icon: 'icon-ref'
  },
  {
    id: 6,
    name: '暖气',
    icon: 'icon-Heat'
  },
  {
    id: 7,
    name: '电视',
    icon: 'icon-vid'
  },
  {
    id: 8,
    name: '热水器',
    icon: 'icon-heater'
  },
  {
    id: 9,
    name: '宽带',
    icon: 'icon-broadband'
  },
  {
    id: 10,
    name: '沙发',
    icon: 'icon-sofa'
  }
]
const HousePackage = ({ list, select, onSelected }) => {
  const [selectedName, setSelectedName] = useState([]);

  const toggleSelect = (item) => {
    if (select) {
      let newSelectedName;
      if (selectedName.indexOf(item.name) === -1) {
        newSelectedName = [...selectedName, item.name];
        setSelectedName([...newSelectedName])
      } else {
        newSelectedName = selectedName.filter(c => c !== item.name);
        setSelectedName([...newSelectedName]);
      }
      onSelected(newSelectedName)
    } else {
      return;
    }

  }
  const renderItem = () => {
    const data = select ? HOUSE_PACKAGE : HOUSE_PACKAGE.filter(item => list ? list.includes(item.name) : true);
    return data.map(item => (
      <li key={item.name} className={[styles.houstItem, selectedName.includes(item.name) ? styles.selected : ""].join(" ")} onClick={() => toggleSelect(item)}>
        <p><i className={`iconfont ${styles.icon} ${item.icon}`}></i></p>
        {item.name}
      </li>
    ))
  }
  return (
    <ul className={styles.root}>
      {
        renderItem()
      }
    </ul>
  )
}

export default HousePackage;