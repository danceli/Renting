import { Flex } from 'antd-mobile';
import styles from './index.module.css';


const FilterFooted = () => {
  return (
    <Flex>
      <button className={[styles.cancleBtn, styles.btn].join(" ")}>取消</button>
      <button className={[styles.okBtn, styles.btn].join(" ")}>确定</button>
    </Flex>
  )
}

export default FilterFooted;