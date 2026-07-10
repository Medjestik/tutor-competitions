import type { FC } from 'react';

import FooterSocialLink from '../../../../../../pages/Landing/components/Footer/ui/FooterSocialLink';

interface IPublicFooterProps {
  withCopy?: boolean;
}

const PublicFooter: FC<IPublicFooterProps> = ({ withCopy }) => {
  return (
    <footer className='public-footer'>
      <FooterSocialLink withCopy={withCopy} />
    </footer>
  );
};

export default PublicFooter;
