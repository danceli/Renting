import Nav1 from '@/assets/imgs/nav-1.png';
import Nav2 from '@/assets/imgs/nav-2.png';
import Nav3 from '@/assets/imgs/nav-3.png';
import Nav4 from '@/assets/imgs/nav-4.png';


export const tabConfig = [
  {
    id: 1,
    title: "首页",
    icon: "icon-ind",
    path: '/home'
  },
  {
    id: 2,
    title: "找房",
    icon: "icon-findHouse",
    path: '/home/list'
  },
  {
    id: 3,
    title: "咨询",
    icon: "icon-infom",
    path: '/home/news'
  },
  {
    id: 4,
    title: "我的",
    icon: "icon-my",
    path: '/home/profile'
  }
]

//导航菜单的数据
export const HomeNavConfig = [
  {
    id: 1,
    img: Nav1,
    title: "整租",
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent'
  }
]