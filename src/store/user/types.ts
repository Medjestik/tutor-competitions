export interface IUserStore {
	user: IUser | null;
  settings: ISettings | null;
	isAuthChecked: boolean;
	isLoading: boolean;
  isLoadingSettings: boolean;
	isLoadingRequest: boolean;
	error: string | null;
}

export interface IUser {
  id: number; 
  username: string; 
  first_name: string; 
  last_name: string; 
  middle_name: string;
  current_stage_id: number; 
  educational_organization: string;
  email: string;
  main_position: string;
  phone_number: string;
  role: string;
  telegram_username: string
  timezone: string;
  passed_second_stage: boolean;
  is_staff: boolean;
  nomination: null;
}

export interface ISettings {
	can_login?: boolean;
	[key: string]: boolean | string | undefined;
}

export interface IAuthResponse {
	access: string;
}

export interface ITokenRequest {
	token: string;
}

export interface IMessageResponse {
	id?: number;
	message: string;
}
