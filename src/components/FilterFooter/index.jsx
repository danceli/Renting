import { Flex } from 'antd-mobile';
import styles from './index.module.css';


const FilterFooted = ({ onCancel, onSave, className, cancelText }) => {
  return (
    <Flex>
      <button className={[styles.cancleBtn, styles.btn].join(" ")} onClick={onCancel}>{cancelText ? cancelText : '取消'}</button>
      <button className={[styles.okBtn, styles.btn].join(" ")} onClick={onSave}>确定</button>
    </Flex>
  )
}

export default FilterFooted;