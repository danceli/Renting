import PropTypes from 'prop-types';
import styles from './index.module.css';
import { withRouter } from 'react-router-dom';

const HouseItem = ({ houseCode, houseImg, title, desc, tags, price, history }) => {
  return (
    <div className={styles.house} key={houseCode} onClick={() => history.push(`/detail/${houseCode}`)}>
      <div className={styles.imgWrap}>
        <img src={`http://localhost:8080${houseImg}`} className={styles.img} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{ desc }</div>
        <div className={styles.tags}>
          {
            tags && tags.map((cItem,index) => (
              <span key={cItem} className={[styles.tag, styles[`tag${index + 1}`]].join(" ")}>{cItem}</span>
            ))
          }
        </div>
        <div className={styles.priceWrap}><span className={styles.price}>{price} </span>元/月</div>
      </div>
    </div>
  )
}
HouseItem.propTypes = {
  houseCode: PropTypes.string.isRequired,
  houseImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number.isRequired
}
export default withRouter(HouseItem);
