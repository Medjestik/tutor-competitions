import type { FC, PropsWithChildren } from 'react';

import '../styles/style.css';

const Section: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className='section'>
      {children}
    </section>
  );
};

export default Section;
