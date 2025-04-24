import type { ICurrentTeam } from '../components/App/interface';

import { createContext } from 'react';

export const initialTeam: ICurrentTeam = { id: 0, name: '', university: null, case: null,  current_stage: 0 };

export const CurrentTeamContext = createContext(initialTeam);
