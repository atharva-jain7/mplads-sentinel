export const DEFAULT_USER = {
  token: 'token-ministry-2026',
  username: 'ministry@nic.in',
  fullName: 'Dr. Alok Verma, IAS',
  role: 'CENTRAL_MINISTRY',
  roleId: 'MINISTRY',
  designation: 'Joint Secretary, MoSPI',
  jurisdiction: 'National Central Oversight (All India)',
  district: 'All India',
  state: 'National'
};

export const authService = {
  login(userData) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : DEFAULT_USER;
  },
  isAuthenticated() {
    return !!localStorage.getItem('token') || !!localStorage.getItem('user');
  }
};