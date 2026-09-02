import type { FC } from 'react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import '../../../../../shared/lib/pdfWorker';

import pdfFile from './leaders.pdf';

const HistoryPdfViewer: FC = () => {
  const [numPages, setNumPages] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
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
  );
};

export default HistoryPdfViewer;
