import type { FC, FormEvent } from 'react';
import type { IFormFieldError } from '../../../shared/components/Form/interface/interface';
import type { ISelectOption } from '../../../shared/components/Select/interface/interface';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as api from '../../../shared/utils/api';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import Form from '../../../shared/components/Form/ui/Form';
import FormField from '../../../shared/components/Form/components/FormField/ui/FormField';
import FormInputString from '../../../shared/components/Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import Link from '../../../shared/components/Link/ui/Link';
import SelectWithSearch from '../../../shared/components/Select/ui/SelectWithSearch';

import RegistrationSuccessPopup from './RegistrationSuccessPopup';
import RegistrationErrorPopup from './RegistrationErrorPopup';

import { timezone } from '../../../shared/utils/timezone';
import { educationalOrganization } from '../../../shared/utils/educationalOrganization';

import '../styles/style.css';

interface IRegistrationProps {
  windowWidth: number;
}

const Registration: FC<IRegistrationProps> = ({ windowWidth }) => {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>('');
  const [isShowErrorFirstName, setIsShowErrorFirstName] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [secondName, setSecondName] = useState<string>('');
  const [isShowErrorSecondName, setIsShowErrorSecondName] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [middleName, setMiddleName] = useState<string>('');
  const [isShowErrorMiddleName, setIsShowErrorMiddleName] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [mail, setMail] = useState<string>('');
  const [isShowErrorMail, setIsShowErrorMail] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [phone, setPhone] = useState<string>('');
  const [isShowErrorPhone, setIsShowErrorPhone] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [telegram, setTelegram] = useState<string>('');
  const [isShowErrorTelegram, setIsShowErrorTelegram] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [job, setJob] = useState<string>('');
  const [isShowErrorJob, setIsShowErrorJob] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [organization, setOrganization] = useState<ISelectOption>({ id: 0, name: 'Введите образовательную организацию высшего образования, которую вы представляете..'});
  const [organizationText, setOrganizationText] = useState<string>('');

  const [currentTimezone, setCurrentTimezone] = useState<ISelectOption>({ id: 0, name: 'Выберите часовой пояс..'});
  const [login, setLogin] = useState<string>('');
  const [isShowErrorLogin, setIsShowErrorLogin] = useState<IFormFieldError>({ isShow: false, text: '' });
  const [password, setPassword] = useState<string>('');
  const [isShowErrorPassword, setIsShowErrorPassword] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [isCheckFirst, setIsCheckFirst] = useState<boolean>(false);
  const [isCheckSecond, setIsCheckSecond] = useState<boolean>(false);
  const [isCheckThird, setIsCheckThird] = useState<boolean>(false);

  const [isOpenRegistrationSuccessPopup, setIsOpenRegistrationSuccessPopup] = useState<boolean>(false);
  const [isOpenRegistrationErrorPopup, setIsOpenRegistrationErrorPopup] = useState<boolean>(false);

  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(true);

  const closeRegistration = () => {
    navigate('/');
  };

  const closePopup = () => {
    setIsOpenRegistrationErrorPopup(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsBlockSubmitButton(true);
    e.preventDefault();
    const data = {
      first_name: firstName,
      last_name: secondName,
      middle_name: middleName,
      email: mail,
      phone_number: phone,
      telegram_username: telegram,
      username: login,
      password: password,
      educational_organization: organization.id === 0 ? organizationText : organization.name,
      main_position: job,
      timezone: currentTimezone.name,
    };
    api.registration(data)
    .then(() => {
      setIsOpenRegistrationSuccessPopup(true);
    })
    .catch((err) => {
      console.log(err);
      setIsOpenRegistrationErrorPopup(true);
    })
    .finally(() => setIsBlockSubmitButton(false));
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

  const handleChangeJob = (value: string) => {
    setJob(value);
    setIsShowErrorJob(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleChangeOrganization = (option: ISelectOption) => {
    setOrganizationText('');
    setOrganization(option);
  };

  const handleChangeOrganizationText = (value: string) => {
    setOrganization({ id: 0, name: 'Введите образовательную организацию высшего образования, которую вы представляете..'});
    setOrganizationText(value);
  };

  const handleChangeLogin = (value: string) => {
    setLogin(value);
    setIsShowErrorLogin(value.length > 5 ? { isShow: false, text: '' } : { isShow: true, text: 'Логин должен содержать минимум 6 символов' });
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
  
    const passwordPattern = /^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,}$/;
  
    if (value.length === 0) {
      setIsShowErrorPassword({ isShow: true, text: 'Поле не может быть пустым' });
    } else if (!passwordPattern.test(value)) {
      setIsShowErrorPassword({ isShow: true, text: 'Пароль должен содержать минимум 8 символов, заглавную букву, строчную букву и цифру' });
    } else {
      setIsShowErrorPassword({ isShow: false, text: '' });
    }
  };

  const handleChangeTime = (option: ISelectOption) => {
    setCurrentTimezone(option);
  };
  
  useEffect(() => {
    const isOrganizationValid = isCheckFirst 
      ? organizationText.trim().length > 0 
      : organization.id !== 0;
  
    const isAnyFieldEmpty = (
      firstName.trim().length < 1 ||
      secondName.trim().length < 1 ||
      mail.trim().length < 1 ||
      phone.trim().length < 1 ||
      job.trim().length < 1 ||
      login.trim().length < 1 ||
      password.trim().length < 1 ||
      !isOrganizationValid
    );
  
    const hasAnyError = (
      isShowErrorMail.isShow ||
      isShowErrorPhone.isShow ||
      isShowErrorTelegram.isShow ||
      isShowErrorLogin.isShow ||
      isShowErrorPassword.isShow ||
      isShowErrorJob.isShow
    );
  
    if (isAnyFieldEmpty || hasAnyError || !isCheckSecond || !isCheckThird) {
      setIsBlockSubmitButton(true);
    } else {
      setIsBlockSubmitButton(false);
    }
  }, [
    firstName, secondName, mail, phone, job, login, password, 
    organization, organizationText, isCheckFirst, 
    isShowErrorMail, isShowErrorPhone, isShowErrorTelegram, 
    isShowErrorLogin, isShowErrorPassword, isShowErrorJob,
    isCheckSecond, isCheckThird
  ]);

  return (
    <>
    <MainLayout windowWidth={windowWidth} isLoggedIn={false} >
      <h1 className='layout__title'>Регистрация</h1>

      <Form formName={'registration-form'} onSubmit={onSubmit}>

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
        <FormField title='Образовательная организация'>
          {
            isCheckFirst 
            ?
            <FormInputString 
              value={organizationText} 
              placeholder='Введите образовательную организацию высшего образования, которую вы представляете..' 
              onChange={handleChangeOrganizationText} 
            />
            : 
            <SelectWithSearch 
              options={educationalOrganization}
              currentOption={organization} 
              onChooseOption={handleChangeOrganization}
            />
          }
          <div className='checkbox__item checkbox__item_margin_top'>
            <label className='checkbox'>
              <input 
                name='registration-check-first'
                type='checkbox'
                id='registration-check-first'
                defaultChecked={isCheckFirst}
                onChange={() => setIsCheckFirst(!isCheckFirst)}
              >
              </input>
              <span></span>
            </label>
            <div className='checkbox__text'>Другая образовательная организация высшего образования</div>
          </div>
        </FormField>
        <FormField title='Основная должность'>
          <FormInputString 
            value={job} 
            placeholder='Введите должность..' 
            onChange={handleChangeJob} 
            error={isShowErrorJob} 
          />
        </FormField>
        <FormField title='Выберите свой часовой пояс'>
          <SelectWithSearch 
            options={timezone}
            currentOption={currentTimezone} 
            onChooseOption={handleChangeTime}
          />
        </FormField>
        <FormField title='Придумайте логин для входа в личный кабинет'>
          <FormInputString 
            value={login} 
            placeholder='Введите логин..' 
            onChange={handleChangeLogin} 
            error={isShowErrorLogin} 
          />
        </FormField>
        <FormField title='Придумайте пароль для входа в личный кабинет'>
          <FormInputString 
            value={password} 
            placeholder='Введите пароль..' 
            onChange={handleChangePassword} 
            error={isShowErrorPassword} 
          />
        </FormField>

        <FormField title='Персональные данные'>
          <div className='checkbox__item checkbox__item_margin_top'>
            <label className='checkbox'>
              <input 
                name='registration-check-second'
                type='checkbox'
                id='registration-check-second'
                defaultChecked={isCheckSecond}
                onChange={() => setIsCheckSecond(!isCheckSecond)}
              >
              </input>
              <span></span>
            </label>
            <div className='checkbox__text'>
              {'Подтверждаю, что ознакомился (-ась) с '}
              <Link text='Положением об обработке персональных данных РУТ (МИИТ),' path='https://rut-miit.ru/org/privacy' />
              {'принимаю условия этого Положения и даю своё согласие на обработку персональных данных.'}
            </div>
          </div>
          <div className='checkbox__item checkbox__item_margin_top'>
            <label className='checkbox'>
              <input 
                name='registration-check-third'
                type='checkbox'
                id='registration-check-third'
                defaultChecked={isCheckThird}
                onChange={() => setIsCheckThird(!isCheckThird)}
              >
              </input>
              <span></span>
            </label>
            <div className='checkbox__text'>
            {'Подтверждаю, что ознакомился (-ась) и согласен (-а) с условиями и правилами участия в конкурсе, изложенными в '}
              <Link text='Положении' path='https://cloud.mail.ru/public/D2WW/96UszWzkP' />
              {' и '}
              <Link text='Регламенте' path='https://cloud.mail.ru/public/krgk/cMSykKYCT' />
              {'.'}
            </div>
          </div>
        </FormField>

        <FormSubmit text='Регистрация' isBlock={isBlockSubmitButton} /> 

      </Form>

      {
        isOpenRegistrationSuccessPopup &&
        <RegistrationSuccessPopup
          isOpen={isOpenRegistrationSuccessPopup} 
          onClose={closeRegistration} 
        />
      }

      {
        isOpenRegistrationErrorPopup &&
        <RegistrationErrorPopup
          isOpen={isOpenRegistrationErrorPopup} 
          onClose={closePopup} 
        />
      }

    </MainLayout>
    </>
  );
};

export default Registration; 
