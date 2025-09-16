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

      // Optional: handle 401 -> clear token (comment out if you don't want auto-logout)
      // if (response.status === 401) {
      //   this.logout();
      // }

      // Get the response data (whether success or error)
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Create an error object with full response details
        const error = new Error(response.statusText || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);

      // If it's already our enhanced error, just rethrow it
      if (error.status && error.data) {
        throw error;
      }

      // For other errors (network errors, etc.), wrap them in a similar structure
      const enhancedError = new Error(error.message || 'Network request failed');
      enhancedError.status = 0;
      enhancedError.data = { message: error.message };
      throw enhancedError;
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

  async reportComment(commentId, { reason, description }) {
    if (!commentId) throw new Error("commentId is required");
    if (!reason?.trim()) throw new Error("reason is required");

    return this.request(`/comments/${commentId}/report`, {
      method: "POST",
      body: JSON.stringify({
        reason: reason.trim(),
        description: (description || "").trim(),
      }),
    });
  }

  async reportQuestion(questionId, { reason, description }) {
    if (!questionId) throw new Error("questionId is required");
    return this.request(`/questions/${questionId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, description: description || '' }),
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

  async forgotPassword(email) {
    return this.request(`/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request(`/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // ===== Feedback =====
  async sendFeedback({ subject, message, type = "HELP" }) {
    if (!message?.trim()) throw new Error("message is required");
    if (!subject?.trim()) throw new Error("subject is required");

    return this.request(`/feedback`, {
      method: "POST",
      body: JSON.stringify({ subject, message, type }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;