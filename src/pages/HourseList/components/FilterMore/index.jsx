import { useState } from 'react';

import FilterFooter from '@/components/FilterFooter';
import './index.scss';
const FilterMore = ({ data, openType, onSave, selectedVal, onCancel }) => {
  const { roomType, oriented, floor, characteristic } = data;
  const [selectedValue, setSelected] = useState(selectedVal);

  const handleSelect = ({ value }) => {
    if(selectedValue.indexOf(value) !== -1) {
      const index = selectedValue.findIndex(val => val === value);
      selectedValue.splice(index, 1)
      setSelected([...selectedValue])
    } else {
      setSelected([...selectedValue, value])
    }
  }
  const renderFilter = (data) => {
    return (
      data.map(item => {
        return <span onClick={() => handleSelect(item)} key={item.value} className={ selectedValue.includes(item.value) ? "tag selected" : "tag"}>{ item.label }</span>
      })
    )
  }
  const onClear = () => {
    setSelected([]);
  }
  const onOk = () => {
    onSave(openType, selectedValue);
  }
  return (
    <div className="filter-more">
      <div className="mask" onClick={() => onCancel(openType)}></div>
      <div className="tags">
        <dl className="dl"> 
          <dt className="dt">户型</dt>
          <dd className="dd">
            { renderFilter(roomType) }
          </dd>
          <dt className="dt">朝向</dt>
          <dd className="dd">
            { renderFilter(oriented) }  
          </dd>

          <dt className="dt">楼层</dt>
          <dd className="dd">
            { renderFilter(floor) }
          </dd>

          <dt className="dt">房屋高亮</dt>
          <dd className="dd">
            { renderFilter(characteristic) }
          </dd>
        </dl>
        <div className="footer">
          <FilterFooter cancelText="清除" onCancel={onClear} onSave={onOk} />
        </div>
      </div>
      
    </div>
  )
}

export default FilterMore;