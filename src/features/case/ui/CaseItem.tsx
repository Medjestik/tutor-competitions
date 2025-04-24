import type { FC } from 'react';
import type { ICaseItemProps } from '../interface/interface';

import Button from '../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const CaseItem: FC<ICaseItemProps> = ({ item, selectItemId, onSelect, onDetail, windowWidth }) => {

  const btnStyle = {
    margin: '0 0 0 40px',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const btnMobileStyle = {
    margin: '4px 0 0 0',
    padding: '6px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: '1',
  };

  const closedId = '6100eede-a79a-40be-a695-5aec7004b6f5';

  return (
    <li className='case-item'>
      {
        item.id === closedId
        ?
        <div className='case-item__close'></div>
        :
        <label className='radio'>
          <input 
            name='registration-case'
            type='radio'
            id='registration-case'
            defaultChecked={selectItemId === item.id}
            onChange={() => onSelect(item.id)} 
          >
          </input>
          <span></span>
        </label>
      }
      {
        windowWidth > 1000
        ?
        <>
          <h4 className='case-item__title'>Кейс «{item.title}»</h4>
          <img className='case-item__icon' src={item.icon} alt='иконка'></img>
          <Button text='Подробнее' color='secondary' style={btnStyle} onClick={() => onDetail(item)}></Button>
        </>
        :
        <>
        <div className='case-item__info'>
          <h4 className='case-item__title'>Кейс «{item.title}»</h4>
          <Button text='Подробнее' color='secondary' style={btnMobileStyle} onClick={() => onDetail(item)}></Button>
        </div>
        <img className='case-item__icon' src={item.icon} alt='иконка'></img>
        </>

      }
      

    </li>
  );
};

export default CaseItem;
