import type { ICurrentUser } from '../components/App/interface';

import { createContext } from 'react';

export const initialUser: ICurrentUser = { 
  id: 0, username: '', 
  first_name: '', 
  last_name: '', 
  middle_name: '', 
  current_stage_id: 0, 
  educational_organization: '',
  email: '',
  main_position: '',
  phone_number: '',
  role: '',
  telegram_username: '',
  timezone: '',
};

export const CurrentUserContext = createContext(initialUser);
