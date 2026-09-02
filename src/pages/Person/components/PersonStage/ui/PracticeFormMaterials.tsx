import type { FC, ChangeEvent } from 'react';
import type { IResource } from '../../../interface/interface';
import type { IUploadFile, IUploadLink } from '../../../../../shared/components/Popup/interface/interface';

import { useRef, useState } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import { FormField } from '../../../../../shared/components/Form/components/FormField/form-field';
import { FormInput } from '../../../../../shared/components/Form/components/FormInput/form-input';
import { GetBase64File } from '../../../../../shared/lib/getBase64File';

const MAX_RESOURCES = 3;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const addButtonStyle = {
  margin: 0,
  fontSize: '16px',
  height: '48px',
  lineHeight: '16px',
  padding: '16px 24px',
  flexShrink: 0,
};

const resourceActionStyle = {
  margin: 0,
  fontSize: '14px',
  height: '36px',
  lineHeight: '1',
  padding: '8px 16px',
  borderRadius: '12px',
  whiteSpace: 'nowrap' as const,
};

const resourceRemoveStyle = {
  ...resourceActionStyle,
  backgroundColor: '#E5A100',
  border: '1px solid #E5A100',
};

type TPracticeFormMaterialsProps = {
  resources: IResource[];
  isLoading: boolean;
  errorMessage?: string;
  onUploadLink: (data: IUploadLink) => void;
  onUploadFile: (data: IUploadFile) => void;
  onRemove: (id: string) => void;
};

const PracticeFormMaterials: FC<TPracticeFormMaterialsProps> = ({
  resources,
  isLoading,
  errorMessage,
  onUploadLink,
  onUploadFile,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState('');

  const canAddMore = resources.length < MAX_RESOURCES;

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setLocalError('Размер файла не должен превышать 10 МБ.');
      event.target.value = '';
      return;
    }
    setLocalError('');
    setSelectedFile(file);
    if (!fileName.trim()) {
      setFileName(file.name);
    }
    event.target.value = '';
  };

  const handleUploadSelectedFile = async () => {
    if (!selectedFile || !fileName.trim()) {
      setLocalError('Укажите название и выберите файл.');
      return;
    }
    if (selectedFile.size > MAX_FILE_BYTES) {
      setLocalError('Размер файла не должен превышать 10 МБ.');
      return;
    }
    setLocalError('');
    const base64 = await GetBase64File(selectedFile);
    onUploadFile({
      file: base64,
      fileName: selectedFile.name,
      name: fileName.trim(),
    });
    setSelectedFile(null);
    setFileName('');
  };

  const handleUploadLink = () => {
    if (!linkName.trim() || !linkUrl.trim()) {
      setLocalError('Укажите название и ссылку.');
      return;
    }
    setLocalError('');
    onUploadLink({
      name: linkName.trim(),
      link: linkUrl.trim(),
    });
    setLinkName('');
    setLinkUrl('');
  };

  return (
    <div className='practice-form__materials'>
      <h3 className='practice-form__section-title'>Дополнительные материалы</h3>
      <p className='practice-form__section-caption'>
        При необходимости прикрепите до 3 файлов до 10 МБ или ссылку на облачное хранилище.
      </p>
      {(localError || errorMessage) && (
        <p className='practice-form__error'>{localError || errorMessage}</p>
      )}

      {canAddMore && (
        <>
          <FormField title='Ссылка на материал'>
            <FormInput
              name='material-link-name'
              value={linkName}
              placeholder='Название материала'
              onChange={(event) => setLinkName(event.target.value)}
            />
            <div className='practice-form__material-row'>
              <FormInput
                name='material-link-url'
                value={linkUrl}
                placeholder='https://...'
                onChange={(event) => setLinkUrl(event.target.value)}
              />
              <Button
                text='Добавить ссылку'
                color='primary'
                style={addButtonStyle}
                onClick={handleUploadLink}
                disabled={isLoading}
              />
            </div>
          </FormField>

          <FormField title='Файл'>
            <FormInput
              name='material-file-name'
              value={fileName}
              placeholder='Название файла'
              onChange={(event) => setFileName(event.target.value)}
            />
            <div className='practice-form__material-row'>
              <button
                type='button'
                className='practice-form__file-picker'
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {selectedFile?.name || 'Выберите файл'}
              </button>
              <input
                ref={fileInputRef}
                type='file'
                hidden
                onChange={handleFileSelect}
              />
              <Button
                text='Добавить файл'
                color='primary'
                style={addButtonStyle}
                onClick={handleUploadSelectedFile}
                disabled={isLoading}
              />
            </div>
          </FormField>
        </>
      )}

      <h4 className='practice-form__list-title'>Прикреплённые материалы</h4>
      {resources.length > 0 ? (
        <ul className='practice-form__resource-list'>
          {resources.map((resource, index) => (
            <li className='practice-form__resource-item' key={resource.id}>
              <span className='practice-form__resource-index'>{index + 1}.</span>
              <p className='practice-form__resource-title' title={resource.description}>
                {resource.description}
              </p>
              <div className='practice-form__resource-actions'>
                <Button
                  text='Открыть'
                  type='link'
                  href={resource.type === 'link' ? resource.link : resource.file}
                  color='primary'
                  style={resourceActionStyle}
                />
                <Button
                  text='Удалить'
                  style={resourceRemoveStyle}
                  onClick={() => onRemove(resource.id.toString())}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span className='practice-form__resource-empty'>Список материалов пока пуст.</span>
      )}
    </div>
  );
};

export default PracticeFormMaterials;
