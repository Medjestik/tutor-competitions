import { useState, type FC } from 'react';
import type { IParticipant } from '../interface/interface';

import ExpertDashboardPieChart from './ExpertDashboardPieChart';
import ParticipantInfoPopup from './ParticipantInfoPopup';

import { buildPieDataByNomination, buildPieDataByNominationStatus } from '../utils/buildPieData';
import { nominationMap } from '../../../../../shared/utils/nominations';

interface IExpertDashboardPieChartsProps {
  data: IParticipant[];
}

const ExpertDashboardPieCharts: FC<IExpertDashboardPieChartsProps> = ({ data }) => {

  const [selectedNomination, setSelectedNomination] = useState<string | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);

  const pieDataByNomination = buildPieDataByNomination(data);
  const pieDataByStatus = buildPieDataByNominationStatus(data, selectedNomination);

  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[] | null>(null);
  const [popupNominationName, setPopupNominationName] = useState<string | null>(null);
  const [popupStatusLabel, setPopupStatusLabel] = useState<string | null>(null);
  const [isShowParticipantInfo, setIsShowParticipantInfo] = useState<boolean>(false);

  const handleOpenParticipantInfo = (participants: IParticipant[], statusLabel: string | null, nominationName: string | null) => {
    setCurrentParticipants(participants);
    setPopupStatusLabel(statusLabel);
    setPopupNominationName(nominationName);
    setIsShowParticipantInfo(true);
  };
  
  const closePopup = () => {
    setIsShowParticipantInfo(false);
    setSelectedStatusId(null);
  };

  return (
    <section className='dashboard__section' style={{ display: 'flex', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <h2 className='dashboard__section-title'>Статистика по номинациям</h2>
        <div className='dashboard__graph' style={{ height: 335 }}>
          <ExpertDashboardPieChart
            data={pieDataByNomination}
            onClickSector={(id) => {
              setSelectedNomination(prev => (prev === id ? null : id));
            }}
            selectedId={selectedNomination}
          />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h2 className='dashboard__section-title'>
          {selectedNomination
            ? `Статистика по статусам: ${selectedNomination}`
            : 'Статистика по статусам (все номинации)'}
        </h2>
        <div className='dashboard__graph' style={{ height: 335 }}>
          <ExpertDashboardPieChart
            data={pieDataByStatus}
            colors={['#F57C00', '#4CAF50', '#7B1FA2']}
            onClickSector={(statusId) => {
              setSelectedStatusId(prev => (prev === statusId ? null : statusId));

              const filtered = data.filter(p => {
                const nominationMatch =
                  !selectedNomination ||
                  Object.entries(nominationMap).find(([, name]) => name === selectedNomination)?.[0] == String(p.nomination);
              
                if (!nominationMatch) return false;
              
                if (statusId === 'Выбрали номинацию') {
                  return p.nomination != null && !p.isSubmitted && !p.isScored;
                }
                if (statusId === 'Отправили анкету') {
                  return p.isSubmitted && !p.isScored;
                }
                if (statusId === 'Анкета оценена') {
                  return p.isScored;
                }
              
                return false;
              });

              handleOpenParticipantInfo(filtered, statusId, selectedNomination);
            }}
            selectedId={selectedStatusId}
          />
        </div>
      </div>
      {
      isShowParticipantInfo && currentParticipants !== null &&
        <ParticipantInfoPopup 
          isOpen={isShowParticipantInfo}
          onClose={closePopup}
          currentParticipants={currentParticipants}
          subtitleText={`Номинация - ${popupNominationName ? popupNominationName : 'Все номинации'}`}
          statusLabel={popupStatusLabel ?? ''}
        />
      }
    </section>
  );
};

export default ExpertDashboardPieCharts;
