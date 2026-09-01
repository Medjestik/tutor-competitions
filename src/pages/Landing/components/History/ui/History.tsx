import type { FC } from 'react';
import { lazy, Suspense } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import { useWindowWidth } from '../../../../../shared/hooks/useWindowWidth';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/style.css';

const HistoryPdfViewer = lazy(() => import('./HistoryPdfViewer'));

const DESKTOP_MIN_WIDTH = 1000;

const History: FC = () => {
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= DESKTOP_MIN_WIDTH;

  return (
    <div className="history" id={ENAV.DOCUMENT}>
      <h2 className="history__title">ЛУЧШИЕ ПРАКТИКИ 2025&nbsp;ГОДА</h2>

      {isDesktop && (
        <Suspense fallback={null}>
          <HistoryPdfViewer />
        </Suspense>
      )}

      <div className="history__info">
        <p className="history__info-text">
          Хотите ознакомиться с результатами подробнее?Скачайте итоги конкурса в
          удобном формате.
        </p>
        <Button
          text="Скачать итоги конкурса"
          type="link"
          href="https://cloud.mail.ru/public/pFAF/Za3dRyRjF"
          color="gradient"
        />
      </div>
    </div>
  );
};

export default History;
