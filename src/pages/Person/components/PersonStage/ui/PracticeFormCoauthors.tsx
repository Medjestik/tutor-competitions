import type { FC } from 'react';
import type { ICoauthor } from '../../../interface/interface';
import type { ISelectOption } from '../../../../../shared/components/Select/interface/interface';

import { FormField } from '../../../../../shared/components/Form/components/FormField/form-field';
import { FormInput } from '../../../../../shared/components/Form/components/FormInput/form-input';
import SelectWithSearch from '../../../../../shared/components/Select/ui/SelectWithSearch';
import {
  ORGANIZATION_OPTIONS,
  ORGANIZATION_PLACEHOLDER,
} from '../../../../Registration/lib/organizations';

const EMPTY_COAUTHOR: ICoauthor = {
  full_name: '',
  position: '',
  educational_organization: '',
};

type TPracticeFormCoauthorsProps = {
  coauthors: ICoauthor[];
  onChange: (coauthors: ICoauthor[]) => void;
  fieldErrors?: Record<string, string>;
};

const PracticeFormCoauthors: FC<TPracticeFormCoauthorsProps> = ({
  coauthors,
  onChange,
  fieldErrors,
}) => {
  const slots = [...coauthors];
  while (slots.length < 4) {
    slots.push({ ...EMPTY_COAUTHOR });
  }

  const updateSlot = (index: number, patch: Partial<ICoauthor>) => {
    const next = slots.map((item, slotIndex) =>
      slotIndex === index ? { ...item, ...patch } : item,
    );
    onChange(next);
  };

  const handleOrganizationChange = (index: number, option: ISelectOption) => {
    updateSlot(index, {
      educational_organization: option.id === 0 ? '' : option.name,
    });
  };

  return (
    <div className='practice-form__coauthors'>
      <h3 className='practice-form__section-title'>Соавторы (необязательно)</h3>
      <p className='practice-form__section-caption'>
        Вы можете указать до 4 соавторов практики, если они есть.
      </p>
      {fieldErrors?.coauthors && (
        <p className='practice-form__error'>{fieldErrors.coauthors}</p>
      )}
      {slots.map((coauthor, index) => {
        const organizationOption =
          ORGANIZATION_OPTIONS.find(
            (option) => option.name === coauthor.educational_organization,
          ) ?? ORGANIZATION_PLACEHOLDER;

        return (
          <div className='practice-form__coauthor-card' key={`coauthor-${index}`}>
            <p className='practice-form__coauthor-title'>Соавтор {index + 1}</p>
            <FormField title='Фамилия Имя Отчество'>
              <FormInput
                name={`coauthor-full-name-${index}`}
                value={coauthor.full_name}
                placeholder='Фамилия Имя Отчество'
                onChange={(event) =>
                  updateSlot(index, { full_name: event.target.value })
                }
              />
            </FormField>
            <FormField title='Должность'>
              <FormInput
                name={`coauthor-position-${index}`}
                value={coauthor.position}
                placeholder='Должность'
                onChange={(event) =>
                  updateSlot(index, { position: event.target.value })
                }
              />
            </FormField>
            <FormField title='Образовательная организация'>
              <SelectWithSearch
                options={ORGANIZATION_OPTIONS}
                currentOption={organizationOption}
                onChooseOption={(option) => handleOrganizationChange(index, option)}
              />
            </FormField>
          </div>
        );
      })}
    </div>
  );
};

export default PracticeFormCoauthors;
