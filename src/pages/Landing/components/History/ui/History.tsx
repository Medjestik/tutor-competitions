import type { FC } from 'react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import Button from '../../../../../shared/components/Button/ui/Button';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/style.css';

import pdfFile from './leaders.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const History: FC = () => {
  const [numPages, setNumPages] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="history" id={ENAV.DOCUMENT}>
      <h2 className="history__title">ЛУЧШИЕ ПРАКТИКИ 2025&nbsp;ГОДА</h2>

      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {numPages > 0 && (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						loop={true}
            className="history-swiper"
          >
            {Array.from({ length: numPages }, (_, index) => (
              <SwiperSlide key={index}>
                <div className="history-slide">
								<Page
									pageNumber={index + 1}
									height={520}
									scale={2}
									renderTextLayer={false}
									renderAnnotationLayer={false}
								/>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Document>

			<div className="history__info">
				<p className="history__info-text">Хотите ознакомиться с результатами подробнее?Скачайте итоги конкурса в удобном формате.</p>
				<Button 
            text='Скачать итоги конкурса' 
            type='link' 
            href='https://cloud.mail.ru/public/pFAF/Za3dRyRjF'
            color='gradient'
          />
			</div>
    </div>
  );
};

export default History;
