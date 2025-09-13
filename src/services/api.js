const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Load any persisted token on startup
    this.token = localStorage.getItem('authToken') || null;
  }

  /** Keep memory + localStorage in sync */
  setToken(token) {
    this.token = token || null;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /** Always read latest token from localStorage to avoid staleness */
  getHeaders() {
    const latestToken = localStorage.getItem('authToken') || this.token;
    const headers = {
      'Content-Type': 'application/json',
      accept: '*/*',
    };
    if (latestToken) {
      headers.Authorization = `Bearer ${latestToken}`;
    }
    return headers;
  }

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
      const response = await fetch(url, config);

      // Optional: handle 401 -> clear token (comment out if you don’t want auto-logout)
      if (response.status === 401) {
        this.logout();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ===== Questions API =====
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
    return this.request(
      `/comments/question/${questionId}?page=${page}&size=${size}&sort=${sortParam}`
    );
  }

  async addComment(questionId, text) {
    return this.request(`/comments/question/${questionId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async likeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, {
      method: 'POST',
      body: '',
    });
  }

  async unlikeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, {
      method: 'DELETE',
      body: '',
    });
  }

  // ===== Waitlist / Invites =====
  async requestInvite(email) {
    // POST /api/waitlist/join  -> body: { email, instituteName }
    return this.request(`/waitlist/join`, {
      method: 'POST',
      body: JSON.stringify({ email, instituteName: 'NITK' }),
    });
  }

  async sendInvite(email) {
    // POST /api/waitlist/invite -> body: { email }
    return this.request(`/waitlist/invite`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Complete signup (from invite link)
  async completeSignup({ token, name, collegeId, alternateEmail, password, confirmPassword }) {
    // collegeId can be omitted/null if your backend infers it from token
    return this.request(`/waitlist/complete-signup`, {
      method: 'POST',
      body: JSON.stringify({ token, name, collegeId: 11, alternateemail: alternateEmail, password, confirmPassword }),
    });
  }

  // ===== Auth =====
  async login({ usernameOrEmail, password }) {
    const data = await this.request(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    // Expecting: { token, type, refreshToken, id, username, email }
    if (data?.token) this.setToken(data.token);
    if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

    if (data?.id || data?.email || data?.username) {
      localStorage.setItem(
        'user',
        JSON.stringify({ id: data.id, email: data.email, username: data.username })
      );
    }

    return data;
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();
export default apiService;
