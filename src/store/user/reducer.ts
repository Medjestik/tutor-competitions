import type { IUserStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IUserStore = {
	isAuthChecked: false,
	isLoading: false,
	isLoadingRequest: false,
	error: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
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
			});
	},
});
