import type { FC, FormEvent } from 'react';
import type { IAddParticipantPopupProps } from '../interface/interface';
import type { IFormFieldError } from '../../../shared/components/Form/interface/interface';
import type { ISelectOption } from '../../../shared/components/Select/interface/interface';

import { useState, useEffect } from 'react';
import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';
import Form from '../../../shared/components/Form/ui/Form';
import FormField from '../../../shared/components/Form/components/FormField/ui/FormField';
import FormInputString from '../../../shared/components/Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import SelectWithSearch from '../../../shared/components/Select/ui/SelectWithSearch';

import '../styles/style.css';

const AddParticipantPopup: FC<IAddParticipantPopupProps> = ({ isOpen, currentParticipant, courses, onClose, onSubmit }) => {

  const [firstName, setFirstName] = useState<string>(currentParticipant.firstName);
  const [isShowErrorFirstName, setIsShowErrorFirstName] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [secondName, setSecondName] = useState<string>(currentParticipant.secondName);
  const [isShowErrorSecondName, setIsShowErrorSecondName] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [middleName, setMiddleName] = useState<string>(currentParticipant.middleName);
  const [isShowErrorMiddleName, setIsShowErrorMiddleName] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [course, setCourse] = useState<ISelectOption>(currentParticipant.course);
  const [group, setGroup] = useState<string>(currentParticipant.group);
  const [isShowErrorGroup, setIsShowErrorGroup] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [mail, setMail] = useState<string>(currentParticipant.mail);
  const [isShowErrorMail, setIsShowErrorMail] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [phone, setPhone] = useState<string>(currentParticipant.phone);
  const [isShowErrorPhone, setIsShowErrorPhone] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [telegram, setTelegram] = useState<string>(currentParticipant.telegram ? currentParticipant.telegram : '');
  const [isShowErrorTelegram, setIsShowErrorTelegram] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(true);

  const btnStyle = {
    width: '100%',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const handleChangeFirstName = (value: string) => {
    setFirstName(value);
    setIsShowErrorFirstName(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleChangeSecondName = (value: string) => {
    setSecondName(value);
    setIsShowErrorSecondName(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleChangeMiddleName = (value: string) => {
    setMiddleName(value);
    setIsShowErrorMiddleName({ isShow: false, text: '' });
  };

  const handleChangeCourse = (option: ISelectOption) => {
    setCourse(option);
  };

  const handleChangeGroup = (value: string) => {
    setGroup(value);
    setIsShowErrorGroup(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleChangeMail = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setMail(value);
  
    if (value.length === 0) {
      setIsShowErrorMail({ isShow: true, text: 'Поле не может быть пустым' });
    } else if (!emailPattern.test(value)) {
      setIsShowErrorMail({ isShow: true, text: 'Неверный формат электронной почты' });
    } else {
      setIsShowErrorMail({ isShow: false, text: '' });
    }
  };

  const handleChangePhone = (value: string) => {
    const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
    setPhone(value);
  
    if (value.length === 0) {
      setIsShowErrorPhone({ isShow: true, text: 'Поле не может быть пустым' });
    } else if (!phoneRegex.test(value)) {
      setIsShowErrorPhone({ isShow: true, text: 'Неверный формат номера телефона' });
    } else {
      setIsShowErrorPhone({ isShow: false, text: '' });
    }
  };

  const handleChangeTelegram = (value: string) => {
    const telegramRegex = /^(https:\/\/t\.me\/[a-zA-Z0-9_]{5,})?$/;
    
    if (value.length === 0) {
      setIsShowErrorTelegram({ isShow: false, text: '' });
    } else if (!telegramRegex.test(value)) {
      setIsShowErrorTelegram({ isShow: true, text: 'Некорректная ссылка на Telegram' });
    } else {
      setIsShowErrorTelegram({ isShow: false, text: '' });
    }
  
    setTelegram(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ...currentParticipant,
      secondName,
      firstName,
      middleName,
      course,
      group,
      mail,
      phone,
      telegram,
    };
    onSubmit(data);
  };

  useEffect(() => {
    const isAnyFieldEmpty = firstName.length < 1 || secondName.length < 1 || group.length < 1 || mail.length < 1 || phone.length < 1;
    const hasAnyError = isShowErrorMail.isShow || isShowErrorPhone.isShow || isShowErrorTelegram.isShow; 
  
    if (isAnyFieldEmpty || hasAnyError || course.id === 0) {
      setIsBlockSubmitButton(true);
    } else {
      setIsBlockSubmitButton(false);
    }
  }, [firstName, secondName, course, group, mail, phone, isShowErrorMail, isShowErrorPhone, isShowErrorTelegram]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='large'>
      <h2 className='popup__title'>Добавление участника</h2>
      <Form formName='add-participant' type='popup' onSubmit={handleSubmit}>
        <FormField title='Фамилия'>
          <FormInputString 
            value={secondName} 
            placeholder='Введите фамилию..' 
            onChange={handleChangeSecondName} 
            error={isShowErrorSecondName} 
          />
        </FormField>
        <FormField title='Имя'>
          <FormInputString 
            value={firstName} 
            placeholder='Введите имя..' 
            onChange={handleChangeFirstName} 
            error={isShowErrorFirstName} 
          />
        </FormField>
        <FormField title='Отчество (при наличии)'>
          <FormInputString 
            value={middleName} 
            placeholder='Введите отчество..' 
            onChange={handleChangeMiddleName}
            error={isShowErrorMiddleName}
          />
        </FormField>
        <FormField title='Курс' marginBottom='large'>
          <SelectWithSearch 
            options={courses}
            currentOption={course} 
            onChooseOption={handleChangeCourse}
          />
        </FormField>
        <FormField title='Учебная группа'>
          <FormInputString 
            value={group} 
            placeholder='Введите группу..' 
            onChange={handleChangeGroup}
            error={isShowErrorGroup}
          />
        </FormField>
        <FormField title='Почта'>
          <FormInputString 
            value={mail} 
            placeholder='Введите почту..' 
            onChange={handleChangeMail} 
            error={isShowErrorMail} 
          />
        </FormField>
        <FormField title='Телефон'>
          <FormInputString 
            value={phone} 
            placeholder='Введите телефон..' 
            onChange={handleChangePhone} 
            error={isShowErrorPhone} 
          />
        </FormField>
        <FormField title='Telegram (необязательно)'>
          <FormInputString 
            value={telegram} 
            placeholder='Введите ссылку (пример https://t.me/telegram)' 
            onChange={handleChangeTelegram} 
            error={isShowErrorTelegram} 
          />
        </FormField>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Назад' color='cancel' onClick={onClose} />
          <FormSubmit text='Сохранить' isBlock={isBlockSubmitButton} />
        </div>
      </Form>
    </Popup>
  );
};

export default AddParticipantPopup;
