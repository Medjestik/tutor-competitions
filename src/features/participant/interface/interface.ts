import type { ICourse } from '../../../pages/Registration/interface/interface';

export interface IParticipant {
  firstName: string;
  secondName: string;
  middleName: string;
  course: { id: number; name: string; };
  group: string;
  mail: string;
  phone: string;
  telegram?: string;
  uniqId: string;
}

export interface IParticipantItemProps {
  item: IParticipant;
  onEdit: (participant: IParticipant) => void;
  onRemove: (participant: IParticipant) => void;
  windowWidth: number;
}

export interface IParticipantListProps {
  items: IParticipant[];
  onAdd: () => void;
  onEdit: (participant: IParticipant) => void;
  onRemove: (participant: IParticipant) => void;
  windowWidth: number;
}

export interface IAddParticipantPopupProps {
  isOpen: boolean;
  currentParticipant: IParticipant;
  courses: ICourse[];
  onClose: () => void;
  onSubmit: (participant: IParticipant) => void;
}
