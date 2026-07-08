import type { FC, PropsWithChildren, } from 'react';

import '../styles/style.css';

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='public-layout'>
      <div className='public-lines'></div>
      <div className='public-container'>
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;
