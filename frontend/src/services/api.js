const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1`
  : '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Authentication failed');
    return res.json();
  },

  async getDashboardSummary(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/dashboard/summary?${query}` : `${API_BASE}/dashboard/summary`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  async getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/projects?${query}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getProjectById(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch project ${projectId}`);
    return res.json();
  },

  async getPayments(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/payments`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getProgress(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/progress`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getRiskAssessment(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/risk`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  },

  async runRiskAnalysis(projectId) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/analyze`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to run risk analysis pipeline');
    return res.json();
  },

  async getNearbyProjects(projectId, radiusKm = 5.0) {
    const res = await fetch(`${API_BASE}/projects/nearby?projectId=${projectId}&radiusKm=${radiusKm}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch nearby projects');
    return res.json();
  },

  async getMapProjects() {
    const res = await fetch(`${API_BASE}/projects/map`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getDistricts() {
    const res = await fetch(`${API_BASE}/projects/districts`, {
      headers: getHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async generateReport(projectId) {
    const res = await fetch(`${API_BASE}/reports/${projectId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },

  async importCSV(csvContent) {
    const res = await fetch(`${API_BASE}/projects/import-csv`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Content-Type': 'text/plain'
      },
      body: csvContent
    });
    if (!res.ok) throw new Error('Failed to import and analyze CSV dataset');
    return res.json();
  }
};