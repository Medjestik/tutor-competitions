import type { FC } from 'react';

import PublicLayout from '../../../shared/components/Layout/ui/PublicLayout';
import PublicHeader from '../../../shared/components/Layout/components/PublicHeader/ui/PublicHeader';
import PublicFooter from '../../../shared/components/Layout/components/PublicFooter/ui/PublicFooter';

import '../styles/style.css';


const Registration: FC = () => {

  return (
    <PublicLayout>
      <PublicHeader />
      <PublicFooter />
    </PublicLayout>
  );
};

export default Registration; 
