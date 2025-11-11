import apiService from './api.js';
import { toast } from 'react-hot-toast';
import { getApiErrorMessage } from '../utils/apiError';

// Helper to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Fallback to local data
const loadFallbackData = async () => {
  try {
    const response = await fetch('/src/data/data.json');
    if (!response.ok) throw new Error('Failed to fetch fallback data');
    return await response.json();
  } catch (error) {
    console.error('Fallback data load failed:', error);
    toast.error(getApiErrorMessage(error));
    return [];
  }
};

// Transform public API response to match expected format
const transformPublicQuestions = (apiResponse) => {
  if (!apiResponse?.content) return [];

  return apiResponse.content.map((q) => {
    // Transform from API format to frontend format
    const question = {
      id: q.id,
      question: q.text,
      backgroundImageUrl: q.backgroundImage,
      commentCount: q.commentCount || 0,
      answerOptions: [
        {
          id: 1, // Assuming Yes is option 1
          value: 'Yes',
          votes: q.yesVotes || 0,
          percentage: q.yesVotes && q.noVotes ?
            ((q.yesVotes / (q.yesVotes + q.noVotes)) * 100).toFixed(1) : '0'
        },
        {
          id: 2, // Assuming No is option 2
          value: 'No',
          votes: q.noVotes || 0,
          percentage: q.yesVotes && q.noVotes ?
            ((q.noVotes / (q.yesVotes + q.noVotes)) * 100).toFixed(1) : '0'
        }
      ],
      userResponse: q.userVote ? {
        answered: true,
        selectedOptionId: q.userVote
      } : null
    };
    return question;
  });
};

export const fetchAllCards = async () => {
  try {
    if (isAuthenticated()) {
      // Use authenticated endpoint
      const response = await apiService.getQuestionsResponse(0, 1000, 'DESC');
      return response || [];
    } else {
      // Use public endpoint
      const response = await apiService.getQuestionsPublic(0, 1000, 'DESC');
      return transformPublicQuestions(response) || [];
    }
  } catch (error) {
    console.error('API fetch failed, using fallback:', error);
    toast.error(getApiErrorMessage(error));
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
    toast.error(getApiErrorMessage(error));
    throw error;
  }
};

export const fetchCardComments = async (questionId) => {
  // Don't fetch comments if user is not authenticated
  if (!isAuthenticated()) {
    return [];
  }

  try {
    const response = await apiService.getComments(questionId);
    return response.content || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    toast.error(getApiErrorMessage(error));
    return [];
  }
};

export const voteOnCard = async (questionId, answerOptionId) => {
  try {
    const response = await apiService.voteOnQuestion(questionId, answerOptionId);
    return response;
  } catch (error) {
    console.error('Error voting on card:', error);
    toast.error(getApiErrorMessage(error));
    throw error;
  }
};

export const likeComment = async (commentId) => {
  try {
    return await apiService.likeComment(commentId);
  } catch (error) {
    console.error('Error liking comment:', error);
    toast.error(getApiErrorMessage(error));
    throw error;
  }
};

export const unlikeComment = async (commentId) => {
  try {
    return await apiService.unlikeComment(commentId);
  } catch (error) {
    console.error('Error unliking comment:', error);
    toast.error(getApiErrorMessage(error));
    throw error;
  }
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
    toast.error(getApiErrorMessage(error));
    throw error;
  }
};

export const createCard = async (cardData) => {
  // TODO: Implement create card API
  return { success: true };
};

export { apiService };
