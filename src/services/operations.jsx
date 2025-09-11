import apiService from './api.js';

// Fallback to local data
const loadFallbackData = async () => {
  try {
    const response = await fetch('/src/data/data.json');
    if (!response.ok) throw new Error('Failed to fetch fallback data');
    return await response.json();
  } catch (error) {
    console.error('Fallback data load failed:', error);
    return [];
  }
};

export const fetchAllCards = async () => {
  try {
    const response = await apiService.getQuestionsResponse(0, 10, 'DESC');
    return response || [];

  } catch (error) {
    console.error('API fetch failed, using fallback:', error);
    return await loadFallbackData();
  }
};

export const fetchOpinions = async () => {
  try {
    const response = await fetch('/data/commentsData.json');
    if (!response.ok) throw new Error('Failed to fetch opinions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching opinions:', error);
    throw error;
  }
};

export const fetchCardComments = async (questionId) => {
  try {
    const response = await apiService.getComments(questionId);
    return response.content || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const voteOnCard = async (questionId, answerOptionId) => {
  try {
    const response = await apiService.voteOnQuestion(questionId, answerOptionId);
    return response;
  } catch (error) {
    console.error('Error voting on card:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    // TODO: Implement login API and set token
    // const response = await apiService.request('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials)
    // });
    // apiService.setToken(response.token);
    return { success: true, token: 'mock-token' };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const likeComment = async (commentId) => {
  try {
    return await apiService.likeComment(commentId);
  } catch (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
};

export const unlikeComment = async (cardId, commentId) => {
  // TODO: Implement unlike comment API
  return { success: true };
};

export const submitSuggestion = async (suggestion) => {
  // TODO: Implement suggestion API
  return { success: true };
};

export const fetchUserProfile = async () => {
  // TODO: Implement user profile API
  return { name: 'User', email: 'user@example.com' };
};

export const logout = async () => {
  apiService.setToken(null);
  return true;
};

export const fetchUserNotifications = async () => {
  // TODO: Implement notifications API
  return [];
};

export const postCommentOnCard = async (questionId, commentText) => {
  try {
    return await apiService.addComment(questionId, commentText);
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const createCard = async (cardData) => {
  // TODO: Implement create card API
  return { success: true };
};

export { apiService };