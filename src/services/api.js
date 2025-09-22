// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;

    // in-memory copies to minimize localStorage churn
    this.token = localStorage.getItem('authToken') || null;
    this.refreshTokenValue = localStorage.getItem('refreshToken') || null;

    // external hook (AuthProvider sets this to logout)
    this.onUnauthorized = undefined;

    // to dedupe concurrent refreshes
    this._refreshPromise = null;
  }

  // ===== token helpers =====
  setToken(token) {
    this.token = token || null;
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }

  setRefreshToken(rt) {
    this.refreshTokenValue = rt || null;
    if (rt) localStorage.setItem('refreshToken', rt);
    else localStorage.removeItem('refreshToken');
  }

  logout() {
    this.setToken(null);
    this.setRefreshToken(null);
    localStorage.removeItem('user');
  }

  // ===== headers =====
  getHeaders() {
    const latestToken = localStorage.getItem('authToken') || this.token;
    const headers = {
      'Content-Type': 'application/json',
      accept: '*/*',
    };
    if (latestToken) headers.Authorization = `Bearer ${latestToken}`;
    return headers;
  }

  // ===== core fetch with auto refresh-on-401 =====
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    };

    try {
      let response = await fetch(url, config);
      let { parsed: data, contentType } = await this._parseResponse(response);

      if (response.ok) return data;

      // If 401, try refresh flow (unless we're already refreshing or hitting auth endpoints)
      if (response.status === 401 && this._canAttemptRefresh(endpoint)) {
        const refreshed = await this._ensureRefresh();
        if (refreshed) {
          // retry original request with fresh token
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${localStorage.getItem('authToken') || this.token || ''}`,
            },
          };
          const retryResp = await fetch(url, retryConfig);
          const retryParsed = await this._parseResponse(retryResp);

          if (retryResp.ok) return retryParsed.parsed;

          // If retry still unauthorized => hard logout
          if (retryResp.status === 401) {
            this.logout();
          }

          // throw retry error
          const retryErr = new Error(retryResp.statusText || `HTTP error! status: ${retryResp.status}`);
          retryErr.status = retryResp.status;
          retryErr.data = retryParsed.parsed;
          throw retryErr;
        } else {
          this.logout();
          if (typeof this.onUnauthorized === 'function') this.onUnauthorized()
        }
      }

      // non-OK and not handled by refresh
      const err = new Error(response.statusText || `HTTP error! status: ${response.status}`);
      err.status = response.status;
      err.data = data;
      throw err;
    } catch (error) {
      // network or thrown above
      if (error.status && error.data) throw error;

      const enhancedError = new Error(error.message || 'Network request failed');
      enhancedError.status = 0;
      enhancedError.data = { message: error.message };
      throw enhancedError;
    }
  }

  _canAttemptRefresh(endpoint) {
    // avoid infinite loops when calling login/refresh endpoints
    const path = endpoint.toLowerCase();
    return !(
      path.includes('/auth/login') ||
      path.includes('/auth/refresh') ||
      path.includes('/auth/forgot-password') ||
      path.includes('/auth/reset-password')
    );
  }

  async _parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    let parsed;
    try {
      parsed = contentType.includes('application/json') ? await response.json() : await response.text();
    } catch {
      parsed = null;
    }
    return { parsed, contentType };
  }

  // Ensure only one refresh request runs at a time
  async _ensureRefresh() {
    if (this._refreshPromise) return this._refreshPromise;

    this._refreshPromise = (async () => {
      const rt = localStorage.getItem('refreshToken') || this.refreshTokenValue;
      if (!rt) return false;

      try {
        const resp = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', accept: '*/*' },
          body: JSON.stringify({ refreshToken: rt }),
        });
        const { parsed } = await this._parseResponse(resp);

        if (!resp.ok) {
          // if refresh unauthorized, nuke tokens
          this.setToken(null);
          this.setRefreshToken(null);
          return false;
        }

        // Expecting: { token, refreshToken? }
        if (parsed?.token) this.setToken(parsed.token);
        if (parsed?.refreshToken) this.setRefreshToken(parsed.refreshToken);

        return true;
      } catch {
        return false;
      } finally {
        this._refreshPromise = null;
      }
    })();

    return this._refreshPromise;
  }

  // ===== Domain APIs =====

  // Questions
  async getQuestionsResponse(page = 0, size = 10, sort = 'DESC') {
    return this.request(`/questions/with-responses?page=${page}&size=${size}&sort=${sort}`);
  }

  async getQuestions(page = 0, size = 10, sort = 'DESC') {
    return this.request(`/questions/list?page=${page}&size=${size}&sort=${sort}`);
  }

  async voteOnQuestion(questionId, answerOptionId) {
    return this.request(`/questions/${questionId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ answerOptionId }),
    });
  }

  async getComments(questionId, page = 0, size = 100, sort = ['DESC']) {
    const sortParam = Array.isArray(sort) ? sort.join(',') : sort;
    return this.request(`/comments/question/${questionId}?page=${page}&size=${size}&sort=${sortParam}`);
  }

  async addComment(questionId, text) {
    return this.request(`/comments/question/${questionId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async likeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, { method: 'POST', body: '' });
  }

  async unlikeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, { method: 'DELETE', body: '' });
  }

  async reportComment(commentId, { reason, description }) {
    if (!commentId) throw new Error('commentId is required');
    if (!reason?.trim()) throw new Error('reason is required');
    return this.request(`/comments/${commentId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason.trim(), description: (description || '').trim() }),
    });
  }

  async reportQuestion(questionId, { reason, description }) {
    if (!questionId) throw new Error('questionId is required');
    return this.request(`/questions/${questionId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, description: description || '' }),
    });
  }

  async suggestQuestion(payload) {
    return this.request('/suggestions/questions', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Waitlist / Invites
  async requestInvite(email) {
    return this.request('/waitlist/join', { method: 'POST', body: JSON.stringify({ email, instituteName: 'NITK' }) });
  }
  async sendInvite(email) {
    return this.request('/waitlist/invite', { method: 'POST', body: JSON.stringify({ email }) });
  }
  async completeSignup({ token, name, collegeId, alternateEmail, password, confirmPassword }) {
    return this.request('/waitlist/complete-signup', {
      method: 'POST',
      body: JSON.stringify({ token, name, collegeId: 11, alternateemail: alternateEmail, password, confirmPassword }),
    });
  }

  // Auth
  async login({ usernameOrEmail, password }) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (data?.token) this.setToken(data.token);
    if (data?.refreshToken) this.setRefreshToken(data.refreshToken);

    if (data?.id || data?.email || data?.username) {
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, username: data.username }));
    }

    return data;
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
  }

  // Feedback
  async sendFeedback({ subject, message, type = 'HELP' }) {
    if (!message?.trim()) throw new Error('message is required');
    if (!subject?.trim()) throw new Error('subject is required');
    return this.request('/feedback', { method: 'POST', body: JSON.stringify({ subject, message, type }) });
  }

  // Notifications
  async getNotifications(page = 0, size = 10) {
    return this.request(`/notifications?page=${page}&size=${size}`);
  }
}

export const apiService = new ApiService();
export default apiService;
