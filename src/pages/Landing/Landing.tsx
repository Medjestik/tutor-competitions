import { useState, type FC } from 'react';

import PublicLayout from '../../shared/components/Layout/ui/PublicLayout';
import Header from './components/Header/ui/Header';
import Main from './components/Main/ui/Main';
import LeaderBoard from './components/LeaderBoard/ui/LeaderBoard';
import Description from './components/Description/ui/Description';
import Stages from './components/Stages/ui/Stages';
import Recruitment from './components/Recruitment/ui/Recruitment';
import FAQ from './components/FAQ/ui/FAQ';
import Document from './components/Document/ui/Document';
import Footer from './components/Footer/ui/Footer';
import MobileMenu from './components/MobileMenu/ui/MobileMenu';

import './Landing.css';

interface ILandingProps {
  windowWidth: number;
  onLogin: () => void;
}

const Landing: FC<ILandingProps> = ({ windowWidth, onLogin }) => {

  const [isShowMobileMenu, setIsShowMobileMenu] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsShowMobileMenu(!isShowMobileMenu);
  };

  return (
    <PublicLayout>
      <div className='landing'>
        {
          <>
          {
            windowWidth < 1001 &&
            <MobileMenu isShow={isShowMobileMenu} onClose={toggleMobileMenu} />
          }
          <Header windowWidth={windowWidth} showMobileMenu={toggleMobileMenu} />
          <Main windowWidth={windowWidth} onLogin={onLogin} />
          <LeaderBoard windowWidth={windowWidth} />
          <Description windowWidth={windowWidth} />
          <Stages />
          {
            /*
            <Cases cases={cases} />
            */
          }
          <Recruitment />
          <FAQ />
          <Document />
          <Footer windowWidth={windowWidth} />
          </>
        }
      </div>
    </PublicLayout>
  );
};

export default Landing;
