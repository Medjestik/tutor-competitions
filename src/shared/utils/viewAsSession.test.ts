import {
  ACCESS_TOKEN_KEY,
  STAFF_VIEW_AS_TOKEN_KEY,
  beginViewAsSession,
  clearAllAuthTokens,
  endViewAsSession,
  restoreStaffTokenAfterViewAs401,
} from './viewAsSession';

describe('viewAsSession storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('backs up the staff token and stores the view-as token', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'staff-token');
    beginViewAsSession('view-as-token');
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('view-as-token');
    expect(localStorage.getItem(STAFF_VIEW_AS_TOKEN_KEY)).toBe('staff-token');
  });

  it('restores the staff token on return', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'staff-token');
    beginViewAsSession('view-as-token');
    const restored = endViewAsSession();
    expect(restored).toBe('staff-token');
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('staff-token');
    expect(localStorage.getItem(STAFF_VIEW_AS_TOKEN_KEY)).toBeNull();
  });

  it('clears both tokens on logout', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'view-as-token');
    localStorage.setItem(STAFF_VIEW_AS_TOKEN_KEY, 'staff-token');
    clearAllAuthTokens();
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(STAFF_VIEW_AS_TOKEN_KEY)).toBeNull();
  });

  it('restores staff token once after view-as 401', () => {
    localStorage.setItem(ACCESS_TOKEN_KEY, 'view-as-token');
    localStorage.setItem(STAFF_VIEW_AS_TOKEN_KEY, 'staff-token');
    const restored = restoreStaffTokenAfterViewAs401();
    expect(restored).toBe('staff-token');
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe('staff-token');
    expect(localStorage.getItem(STAFF_VIEW_AS_TOKEN_KEY)).toBeNull();
    expect(restoreStaffTokenAfterViewAs401()).toBeNull();
  });
});
