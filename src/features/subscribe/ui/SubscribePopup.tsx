import type { FC, FormEvent } from 'react';
import type { ISubscribePopupProps } from '../interface/interface';
import type { IFormFieldError } from '../../../shared/components/Form/interface/interface';

import { useState, useEffect } from 'react';
import Popup from '../../../shared/components/Popup/ui/Popup';
import Button from '../../../shared/components/Button/ui/Button';
import Form from '../../../shared/components/Form/ui/Form';
import FormField from '../../../shared/components/Form/components/FormField/ui/FormField';
import FormInputString from '../../../shared/components/Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import FormError from '../../../shared/components/Form/components/FormError/ui/FormError';
import Link from '../../../shared/components/Link/ui/Link';

import telegramIcon from '../../../shared/icons/telegram.png';

const SubscribePopup: FC<ISubscribePopupProps> = ({ isOpen, onClose, onSubmit, subscribeError, isLoadingRequest }) => {

  const [mail, setMail] = useState<string>('');
  const [isShowErrorMail, setIsShowErrorMail] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(true);

  const btnStyle = {
    width: '100%',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleChangeMail = (value: string) => {
    setMail(value);
  
    if (!value) {
      setIsShowErrorMail({ isShow: true, text: 'Поле не может быть пустым' });
    } else if (!isValidEmail(value)) {
      setIsShowErrorMail({ isShow: true, text: 'Некорректный формат почты' });
    } else {
      setIsShowErrorMail({ isShow: false, text: '' });
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ mail });
  };

  useEffect(() => {
    const isAnyFieldEmpty = mail.length < 1;
    const hasAnyError = isShowErrorMail.isShow;
  
    if (isAnyFieldEmpty || hasAnyError) {
      setIsBlockSubmitButton(true);
    } else {
      setIsBlockSubmitButton(false);
    }
  }, [mail]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium'>
      <h2 className='popup__title'>Подписка на рассылку</h2>
      <p className='popup__subtitle'>Отправим на указанную электронную почту уведомление о начале регистрации на сезон 2025 года</p>
      <Form formName='subscribe' type='popup' onSubmit={handleSubmit}>
        <FormField title='Почта'>
          <FormInputString 
            value={mail} 
            placeholder='Введите почту..' 
            onChange={handleChangeMail} 
            error={isShowErrorMail} 
          />
        </FormField>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Назад' color='cancel' onClick={onClose} />
          <FormSubmit text='Отправить' isBlock={isBlockSubmitButton || isLoadingRequest} />
        </div>
        <FormError isShow={subscribeError.isShow} text={subscribeError.text} />
        <div className='popup__author'>
          <img className='popup__author-img popup__author-img_size_small' src={telegramIcon} alt='телеграм'></img>
          <div className='popup__author-info'>
            <p className='popup__author-title'>Не пользуетесь электронной почтой? Следите за&nbsp;новостями в&nbsp;нашем <Link text='Телеграм-канале' path='https://t.me/contestmiit' /></p>
          </div>
        </div>
        <p className='popup__text'>Нажимая на кнопку "Отправить", вы соглашаетесь получать информацию и предложения от&nbsp;РУТ&nbsp;(МИИТ), подтверждаете, что ознакомились с <Link text='Положением об обработке персональных данных' path='https://rut-miit.ru/org/privacy' /> РУТ&nbsp;(МИИТ) и принимаете условия этого Положения.</p>
      </Form>
    </Popup>
  );
};

export default SubscribePopup;
