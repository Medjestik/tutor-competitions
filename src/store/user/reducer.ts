import type { IUserStore } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IUserStore = {
	user: null,
  settings: null,
	isAuthChecked: false,
	isLoading: false,
	isLoadingRequest: false,
  isLoadingSettings: false,
	error: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
  reducers: {
		setIsAuthChecked: (state, action) => {
			state.isAuthChecked = action.payload;
		},
		setUserStage: (state, action: PayloadAction<number>) => {
			if (state.user) {
				state.user.current_stage_id = action.payload;
			}
		},
	},
	selectors: {
		getUser: (state) => state.user,
		getIsAuthChecked: (state) => state.isAuthChecked,
	},
	extraReducers: (builder) => {
		builder
      .addCase(actions.setUser, (state, action) => {
        state.user = action.payload || null;
      })
			.addCase(actions.loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.loginUser.fulfilled, (state) => {
				state.isLoading = false;
				state.isAuthChecked = true;
			})
			.addCase(actions.loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Произошла ошибка';
			})
      .addCase(actions.logoutUser.fulfilled, (state) => {
				state.user = null;
			})
      .addCase(actions.getSettingsAction.pending, (state) => {
				state.isLoadingSettings = true;
				state.error = null;
			})
			.addCase(actions.getSettingsAction.fulfilled, (state, action) => {
				state.isLoadingSettings = false;
				state.settings = action.payload;
			})
			.addCase(actions.getSettingsAction.rejected, (state, action) => {
				state.isLoadingSettings = false;
				state.error = action.error?.message || 'Произошла ошибка';
			});
	},
});

export const { setIsAuthChecked, setUserStage } = userSlice.actions;
export const { getIsAuthChecked, getUser } = userSlice.selectors;
