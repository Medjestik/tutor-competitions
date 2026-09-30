export const ACCESS_TOKEN_KEY = 'token';
export const STAFF_VIEW_AS_TOKEN_KEY = 'staffViewAsToken';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getStaffViewAsBackupToken = (): string | null =>
  localStorage.getItem(STAFF_VIEW_AS_TOKEN_KEY);

export const beginViewAsSession = (viewAsAccessToken: string): void => {
  const current = getAccessToken();
  if (current) {
    localStorage.setItem(STAFF_VIEW_AS_TOKEN_KEY, current);
  }
  setAccessToken(viewAsAccessToken);
};

export const endViewAsSession = (): string | null => {
  const staffToken = getStaffViewAsBackupToken();
  localStorage.removeItem(STAFF_VIEW_AS_TOKEN_KEY);
  if (staffToken) {
    setAccessToken(staffToken);
  }
  return staffToken;
};

export const clearAllAuthTokens = (): void => {
  clearAccessToken();
  localStorage.removeItem(STAFF_VIEW_AS_TOKEN_KEY);
};

export const restoreStaffTokenAfterViewAs401 = (): string | null => {
  const staffToken = getStaffViewAsBackupToken();
  if (!staffToken) {
    return null;
  }
  localStorage.removeItem(STAFF_VIEW_AS_TOKEN_KEY);
  setAccessToken(staffToken);
  return staffToken;
};
