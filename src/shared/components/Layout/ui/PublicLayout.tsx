import type { FC, PropsWithChildren, } from 'react';

import '../styles/style.css';

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='public-layout'>
      {children}
    </div>
  );
};

export default PublicLayout;
