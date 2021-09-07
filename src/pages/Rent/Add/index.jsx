import { Component } from 'react';
import NavHeader from '@/components/NavHeader';
import HousePackage from '../../../components/HousePackage';
import styles from './index.module.css';
import { List, InputItem, Picker, ImagePicker, TextareaItem, Flex, Toast } from 'antd-mobile';
import axios from '@/http/request';


const Item = List.Item;
// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]
// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]
class Add extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      community: this.props.location.state ? { ...this.props.location.state } : { name: "", id: "" },
      price: "",
      size: "",
      roomType: "",
      floor: "",
      oriented: "",
      title: "",
      supporting: "",
      tempSlides: [],
      description: ""
    }
  }
  getValue = (name, val) => {

    this.setState({
      [name]: Array.isArray(val) ? val[0] : val
    })
  }
  onSupport = (selectedName) => {
    this.setState({ supporting: selectedName.join("|") })
  }
  handleHouseImg = (files) => {
    this.setState({
      tempSlides: files
    })
  }
  addHouse = async () => {
    //1.判断是否有房屋图片数据
    const { tempSlides, community, price, size, roomType, floor, oriented, title, description, supporting } = this.state;
    let houseImg = ""
    if (tempSlides.length > 0) {
      //2.如果有图片，创建FormData对象上床图片去获取图片路径
      const form = new FormData();
      tempSlides.forEach(item => {
        form.append("file", item.file);
      });
      const { data } = await axios({
        url: "/houses/image",
        method: "post",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      //3.通过接口返回图片路径
      houseImg = data.body.join("|")
      //发布房源
      const ret = await axios.post("/user/houses", {
        houseImg, price, size, roomType, floor, oriented, title, description, supporting, community: community.id
      });
      console.log(ret)
      if (ret.data.status === 200) {   //发布成功
        Toast.info("发布成功", 1, null, false);
        this.props.history.push('/rent')
      } else {
        Toast.fail("服务器开小差了", 1, null, false);
      }
    }
  }
  render() {
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      tempSlides,
      description,
      supporting
    } = this.state;
    return (
      <div className={styles.root}>
        <NavHeader className={styles.addNavHeader}>
          发布房源
        </NavHeader>
        <List renderHeader={() => "房源信息"}>
          {/* 选择所在小区 */}
          <Item
            extra={community.name || "请输入小区名称"}
            arrow="horizontal"
            onClick={() => this.props.history.push('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="0.00"
            extra="¥/月"
            value={price}
            onChange={(val) => this.getValue("price", val)}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem placeholder="请输入建筑面积" extra="㎡"
            value={size}
            onChange={(val) => this.getValue("size", val)}
          >
            建筑面积
          </InputItem>
          <Picker data={roomTypeData} cols={1} value={[roomType]}
            onChange={(val) => this.getValue("roomType", val)}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>
          <Picker data={floorData} cols={1} value={[floor]}
            onChange={(val) => this.getValue("floor", val)}
          >
            <Item arrow="horizontal">
              所在楼层
            </Item>
          </Picker>
          <Picker data={orientedData} cols={1} value={[oriented]}
            onChange={(val) => this.getValue("oriented", val)}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.houstTitleList}
          renderHeader={() => "房屋标题"}
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => this.getValue("title", val)}
          />
        </List>

        <List
          renderHeader={() => "房屋图像"}
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={this.handleHouseImg}
          />
        </List>

        {/* 房屋配置 */}
        <List renderHeader={() => "房屋配置"}>
          <HousePackage select onSelected={this.onSupport} />
        </List>
        <List renderHeader={() => "房屋描述"}>
          <TextareaItem
            rows={4}
            autoHeight
            placeholder="请输入房屋描述信息"
            value={description}
            onChange={(val) => this.getValue("description", val)}
          />
        </List>
        <Flex className={styles.footer}>
          <Flex.Item className={styles.cancelBtn}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.okBtn} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}

export default Add;