import { useState } from 'react';
import { PickerView } from 'antd-mobile';
import FilterFooter from '@/components/FilterFooter';


const FilterPicker = ({ onCancel, onSave, data, cols, type, defaultSelectVal }) => {
  const [value, setValue] = useState(defaultSelectVal);
  return (
    <div>
      <PickerView
        data={data}
        value={value}
        cols={cols}
        onChange={(val) => setValue(val)}
      />

      {/* 底部按钮 */}
      <FilterFooter onSave={() => onSave(type, value)} onCancel={() => onCancel(type)} />
    </div>
  )
}

export default FilterPicker;