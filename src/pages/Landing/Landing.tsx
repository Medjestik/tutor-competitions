import { useState, type FC } from 'react';

import Header from './components/Header/ui/Header';
import Main from './components/Main/ui/Main';
import Description from './components/Description/ui/Description';
import Recruitment from './components/Recruitment/ui/Recruitment';
import Advantages from './components/Advantages/ui/Advantages';
import Nominations from './components/Nominations/ui/Nominations';
import Prize from './components/Prize/ui/Prize';
import Stages from './components/Stages/ui/Stages';
import FAQ from './components/FAQ/ui/FAQ';
import International from './components/International/ui/International';
import Document from './components/Document/ui/Document';
import Footer from './components/Footer/ui/Footer';
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
        <Nominations windowWidth={windowWidth} />
        <Prize />
        <Stages windowWidth={windowWidth} />
        <FAQ />
        <International />
        <Document windowWidth={windowWidth} />
        <Footer windowWidth={windowWidth} />
        </>
      }
      <div className='footer__background'></div>
    </div>
  );
};

export default Landing;
