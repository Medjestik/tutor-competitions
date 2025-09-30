import type { FC } from 'react';

import { useState, useEffect } from 'react';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Link from '../../../../../shared/components/Link/ui/Link';

import { convertDate } from '../../../../../shared/utils/formatDate';

import workshopImg from '../../../../../shared/images/workshop.svg';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

interface IWebinarData {
  admin_link: string;
  date: string;
  guest_link: string;
  id: number;
  time: string;
  user: number;
}

const PersonStageWorkshop: FC = () => {

  const [webinarData, setWebinarData] = useState<IWebinarData | null>(null);
  const [isSelectTime, setIsSelectTime] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getWebinars(token)
      .then((res) => {
        setWebinarData(res);
        setIsSelectTime(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);
  

  return (
    <div className='person-stage'>
      {
        isLoadingData
        ?
        <Preloader />
        :
        <>
        <h2 className='person-stage__title'>Расписание мастер-классов</h2>
        {
          isSelectTime && webinarData
          ?
          <>
            <p className='person-stage__subtitle'>Дата и время проведения вашего онлайн-мастер-класса по московскому времени: <span className='person-stage__text-bold'>{convertDate(webinarData.date)}, {webinarData.time}</span></p>
            <p className='person-stage__subtitle'>Для участия в качестве спикера используйте следующую ссылку для подключения к вебинару: <Link text='Ссылка на вебинар' path={webinarData.admin_link || ''} /></p>
            <p className='person-stage__subtitle'>Проверьте, что вы заранее подготовили материал и загрузили его в личный кабинет (кнопка «03»).</p>
            <p className='person-stage__subtitle'>Рекомендуем заранее проверить работу оборудования и стабильность интернет-соединения, чтобы ваше выступление прошло без заминок. Если у вас возникнут вопросы или вам потребуется техническая помощь, обращайтесь в поддержку.</p>
          </>
          :
          <>
            <p className='person-stage__subtitle'>Здесь скоро появится расписание онлайн-мастер-классов — мы уже работаем над ним и скоро всё опубликуем. Следите за обновлениями!</p>
            
          </>
        }
        <img className="person-stage__img" src={workshopImg} alt='изображение'></img>
      </>
      }
    </div>
  );
};

export default PersonStageWorkshop;
