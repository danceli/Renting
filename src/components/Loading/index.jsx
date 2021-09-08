import styles from './index.module.css';
import loadImg from '@/assets/imgs/loading.gif'
const Loading = () => {

  return (
    <div className={styles.loading}>
      <img className={styles.loadingImg} src={loadImg} alt="" />
    </div>
  )
}

export default Loading;