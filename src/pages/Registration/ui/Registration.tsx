import type { FC } from 'react';

import { useEffect, useState } from 'react';

import PublicLayout from '../../../shared/components/Layout/ui/PublicLayout';
import PublicHeader from '../../../shared/components/Layout/components/PublicHeader/ui/PublicHeader';
import PublicFooter from '../../../shared/components/Layout/components/PublicFooter/ui/PublicFooter';
import { getSettings } from '../../../shared/api/settings';

import RegistrationClosed from './RegistrationClosed';
import RegistrationForm from './RegistrationForm';

import styles from '../styles/registration.module.scss';

const Registration: FC = () => {
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    setIsLoadingSettings(true);
    getSettings()
      .then((settings) => {
        setRegistrationOpen(settings.registration_open === true);
      })
      .catch((err) => {
        console.error(err);
        setRegistrationOpen(false);
      })
      .finally(() => setIsLoadingSettings(false));
  }, []);

  return (
    <PublicLayout>
      <PublicHeader />
      {isLoadingSettings ? (
        <main className={styles.main} />
      ) : registrationOpen ? (
        <RegistrationForm />
      ) : (
        <RegistrationClosed />
      )}
      <PublicFooter withCopy={false} />
    </PublicLayout>
  );
};

export default Registration;
