import { FC, useState, useEffect, useContext } from 'react';

import type { ISLot } from '../../../../../shared/utils/api';
import type { ITimeInterval } from '../../../../../widgets/TimeSelect/interface/interface';

import { Calendar } from '../../../../../widgets/Calender/ui/Calender';
import { TimeSelect } from '../../../../../widgets/TimeSelect/ui/TimeSelect';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';

import { formatDateShort } from '../../../../../shared/utils/formatDate';
import { CurrentUserContext } from '../../../../../shared/context/team';

import scheduleImg from '../../../../../shared/images/schedule.svg';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

interface ISelectedSlot {
  date: string; // YYYY-MM-DD
  slots: ITimeInterval[];
}

const btnStyle = {
  margin: '12px 0 0 0',
  fontSize: '18px',
  height: '40px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const formatDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

const generateIntervals = (): ITimeInterval[] => {
  const result: ITimeInterval[] = [];
  let hour = 9;
  let minute = 0;

  while (hour < 15) {
    const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`;

    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }

    const end = `${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`;

    result.push({ start, end, status: 'free' });
  }

  return result;
};

const PersonStageSchedule: FC = () => {

  const currentUser = useContext(CurrentUserContext);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selections, setSelections] = useState<ISelectedSlot[]>([]);
  const [isSelectDate, setIsSelectDate] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelectTime = (slots: ITimeInterval[]) => {
    if (!selectedDate) return;

    const dateKey = formatDateKey(selectedDate);

    setSelections(prev => {
      // remove existing entry for this date
      const others = prev.filter(s => s.date !== dateKey);

      // if no slots selected -> just remove the date (don't add empty)
      if (!slots || slots.length === 0) {
        return others;
      }

      // otherwise add updated entry
      return [...others, { date: dateKey, slots }];
    });
  };

  const handleSelectSlots = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const slotsToSend: ISLot[] = selections.flatMap(s =>
      s.slots.map(slot => ({
        date: s.date,
        time: `${slot.start}-${slot.end}`,
      }))
    );

    api.SelectSlots(token, slotsToSend)
    .then(() => {
      setIsSelectDate(true);
    })
    .catch((err) => {
      console.error(err);
    });
  };

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getSlots(token)
      .then((res) => {
        if (res.length > 0) {
          setIsSelectDate(true);
        } else {
          setIsSelectDate(false);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
  };

  const currentSelected =
    selectedDate &&
    selections.find(s => s.date === formatDateKey(selectedDate))?.slots;

  const totalSelectedSlots = selections.reduce(
    (acc, s) => acc + s.slots.length,
    0
  );

  const isBlock = totalSelectedSlots < 3;

  console.log(isBlock);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="person-stage">
      {
        isLoadingData
        ?
        <Preloader />
        :
        <>
          <h2 className="person-stage__title">Выбор времени для онлайн-мастер-класса</h2>
          {
            isSelectDate 
            ?
            <>
              <p className="person-stage__subtitle person-stage__text-bold">Готово! Ваши предпочтения по времени сохранены.</p>
              <p className="person-stage__subtitle">Скоро мы сформируем расписание онлайн-мастер-классов и сообщим точную дату и время вашего выступления — уведомление придёт на электронную почту и отобразится в личном кабинете.</p>
              <img className="person-stage__img" src={scheduleImg} alt='изображение'></img>
            </>
            :
            <>
              <p className="person-stage__subtitle">
                Пожалуйста, отметьте все временные слоты (минимум 3), в которые вы готовы провести
                мастер-класс. Время указано по московскому часовому поясу. Форму необходимо
                заполнить <span className="person-stage__text-bold">до 29.09.2025 г.</span>
              </p>
              <p className="person-stage__subtitle">
                После завершения сбора информации мы сформируем расписание и направим вам
                точное время проведения выступления — оно будет доступно в личном кабинете и
                Telegram-канале конкурса.
              </p>

              <div className="person-stage__container">
                {
                  currentUser.nomination &&
                  <Calendar
                    year={2025}
                    month={9}
                    startDay={currentUser.nomination.id === 3 ? 9 : 1}
                    endDay={currentUser.nomination.id === 3 ? 15 : 8}
                    onSelectDate={handleSelectDate}
                  />
                }

                {selectedDate && (
                  <TimeSelect
                    intervals={generateIntervals()}
                    selected={currentSelected || []}
                    onChange={handleSelectTime}
                  />
                )}
              </div>

              {
                selections.length > 0 &&
                <>
                <div className='person-stage__result'>
                  <h3 className='person-stage__title-row'>Выбранные даты и время:</h3>
                  <ul className='slots__list'>
                    {selections.flatMap(s =>
                      s.slots.map(slot => (
                        <li className='slots__item' key={`${s.date}-${slot.start}-${slot.end}`}>
                          {formatDateShort(s.date)} {slot.start} - {slot.end}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <Button text='Отправить' style={btnStyle} onClick={handleSelectSlots} />
                </>
              }
            </>
          }
        </>
      }
      
    </div>
  );
};

export default PersonStageSchedule;
