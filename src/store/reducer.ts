import { combineSlices } from '@reduxjs/toolkit';
import { userSlice } from './user/reducer';

export const rootReducer = combineSlices(
	userSlice,
);
