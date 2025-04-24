import type { FC, FormEvent } from 'react';
import type { IUploadFilePopupProps } from '../interface/interface';
import type { IFormFieldError } from '../../Form/interface/interface';

import { useState, useEffect } from 'react';

import Popup from './Popup';
import Form from '../../Form/ui/Form';
import Button from '../../Button/ui/Button';
import FormField from '../../Form/components/FormField/ui/FormField';
import FormInputString from '../../Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../Form/components/FormSubmit/ui/FormSubmit';
import FormError from '../../Form/components/FormError/ui/FormError';

import GetBase64File from '../../../../custom/GetBase64File';

const UploadFilePopup: FC<IUploadFilePopupProps> = ({ isOpen, onClose, onUpload, isLoading, isShowRequestError }) => {

  const btnStyle = {
    width: '100%',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '18px',
    lineHeight: '1',
  };

  const [title, setTitle] = useState<string>('');
  const [isShowErrorTitle, setIsShowErrorTitle] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [fileName, setFileName] = useState<{ isShow: boolean, name: string }>({ isShow: false, name: '', });
  const [fileError, setFileError] = useState<IFormFieldError>({ isShow: false, text: '' });

  const [contentFile, setContentFile] = useState<{ file: string | null }>({ file: null });

  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(true);


  const handleChangeTitle = (value: string) => {
    setTitle(value);
    setIsShowErrorTitle(value.length > 0 ? { isShow: false, text: '' } : { isShow: true, text: 'Поле не может быть пустым' });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = { file: contentFile.file, fileName: fileName.name, name: title };
    onUpload(file);
  };

  function handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileName({ isShow: false, name: '' });
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10485760) {
        setFileError({ text: 'Размер файла превышает 10 MB, пожалуйста, прикрепите ссылку на него', isShow: true });
      } else {
        setFileError({ text: '', isShow: false });
        GetBase64File(file)
          .then(base64 => {
            if (typeof base64 === 'string') {
              setFileName({ isShow: true, name: file.name });
              setContentFile({ file: base64 });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  useEffect(() => {
    if ((contentFile.file === null) || (title.length < 1)) { 
      setIsBlockSubmitButton(true);
    } else {
      setIsBlockSubmitButton(false);
    }
  // eslint-disable-next-line
  }, [title, contentFile]);

  useEffect(() => {
    setTitle('');
    setIsShowErrorTitle({ text: '', isShow: false });
    setIsBlockSubmitButton(true);
  }, [isOpen]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='large' closeOutside>
      <h2 className='popup__title'>Добавление файла</h2>
      <p className='popup__subtitle'>Введите наименование вашей работы и прикрепите файл</p>

      <Form formName='upload-file' type='popup' onSubmit={handleSubmit}>
        <FormField title='Наименование работы'>
          <FormInputString 
            value={title} 
            placeholder='Введите наименование..' 
            onChange={handleChangeTitle} 
            error={isShowErrorTitle} 
          />
        </FormField>
        <FormField title='Выберите файл'>
          <div className='upload-form__container'>
            <div className='upload-form__section'>
              <label htmlFor={'file-upload'} className='upload-form__field'>
                <p className='upload-form__text'>{fileName.isShow ? fileName.name : ''}</p>
                <div className='upload-form__icon'></div>
              </label>
              <input onChange={handleChangeFile} id={'file-upload'} name={'file-upload'} className='upload-form__input' type="file" />
            </div>
          </div>
          <span className={`popup__input-error ${fileError.isShow ? 'popup__input-error_status_show' : ''}`}>
            {fileError.text}
          </span>
        </FormField>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Отменить' color='cancel' onClick={onClose} />
          <FormSubmit text='Загрузить' isBlock={isBlockSubmitButton} isLoading={isLoading} loadingText='Загрузка..' />
        </div>
        <FormError isShow={isShowRequestError} text='К сожалению, произошла ошибка!' />
      </Form>
    </Popup>
  );
};

export default UploadFilePopup;
