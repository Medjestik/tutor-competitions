import { useState, type FC } from 'react';

import Header from './components/Header/ui/Header';
import Main from './components/Main/ui/Main';
import Description from './components/Description/ui/Description';
import Recruitment from './components/Recruitment/ui/Recruitment';
import Advantages from './components/Advantages/ui/Advantages';
import MobileMenu from './components/MobileMenu/ui/MobileMenu';

import './Landing.css';

interface ILandingProps {
  windowWidth: number;
}

const Landing: FC<ILandingProps> = ({ windowWidth }) => {

  const [isShowMobileMenu, setIsShowMobileMenu] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsShowMobileMenu(!isShowMobileMenu);
  };

  return (
    <div className='landing'>
      <div className='landing__background'></div>
      <div className='landing__lines'></div>
      {
        <>
        {
          windowWidth < 1001 &&
          <MobileMenu isShow={isShowMobileMenu} onClose={toggleMobileMenu} />
        }
        <Header windowWidth={windowWidth} showMobileMenu={toggleMobileMenu} />
        <Main windowWidth={windowWidth} />
        <Description windowWidth={windowWidth} />
        <Recruitment />
        <Advantages windowWidth={windowWidth} />

        {
          /*
          <LeaderBoard windowWidth={windowWidth} />

          <Stages />
          <Cases cases={cases} />

          <FAQ />
          <Document />
          <Footer windowWidth={windowWidth} />
          */
        }

        </>
      }
    </div>
  );
};

export default Landing;
