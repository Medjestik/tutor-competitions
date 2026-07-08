export interface IUserStore {
	isAuthChecked: boolean;
	isLoading: boolean;
	isLoadingRequest: boolean;
	error: string | null;
}

export interface IAuthResponse {
	key: string;
}
