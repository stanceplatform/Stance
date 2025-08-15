const API_BASE_URL = 'http://stance.ap-south-1.elasticbeanstalk.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzU1MjUyNDA3LCJleHAiOjE3NTUzMzg4MDd9.e5cOuICht7HGXA__NuSqBwmFWtWmfYX2HrKiLfdg6Nc';
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'accept': '*/*'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Questions API
  async getQuestions(page = 0, size = 10, sort = 'DESC') {
    return this.request(`/questions/list?page=${page}&size=${size}&sort=${sort}`);
  }

  async voteOnQuestion(questionId, answerOptionId) {
    return this.request(`/questions/${questionId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ answerOptionId })
    });
  }

  async getComments(questionId, page = 0, size = 100, sort = ['DESC']) {
    const sortParam = Array.isArray(sort) ? sort.join(',') : sort;
    return this.request(`/comments/question/${questionId}?page=${page}&size=${size}&sort=${sortParam}`);
  }

  async addComment(questionId, text) {
    return this.request(`/comments/question/${questionId}`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  async likeComment(commentId) {
    return this.request(`/comments/${commentId}/like`, {
      method: 'POST',
      body: ''
    });
  }
}

export const apiService = new ApiService();
export default apiService;