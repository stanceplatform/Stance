const BASE_URL = 'http://localhost:8080';

export const fetchAnswerOptions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/answers`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching answer options:', error);
      
      // throw error;
    }
  };


  // New function to load comments from local JSON file
export const fetchOpinions = async () => {
    try {
      const response = await fetch('/data/commentsData.json'); // Adjust the path as necessary
      if (!response.ok) {
        throw new Error('Failed to fetch opinions');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching opinions:', error);
      throw error;
    }
  };

export const login = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const fetchAllCards = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    // Fallback to local JSON file
    try {
      const fallbackResponse = await fetch('/src/data/data.json');
      if (!fallbackResponse.ok) {
        throw new Error('Failed to fetch fallback cards');
      }
      const fallbackData = await fallbackResponse.json();
      return fallbackData;
    } catch (fallbackError) {
      console.error('Error fetching fallback cards:', fallbackError);
      throw fallbackError;
    }
  }
};

export const fetchCardComments = async (cardId) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/comments/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch card comments');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching card comments:', error);
    // Fallback to local JSON file
    try {
      const fallbackResponse = await fetch('/src/data/commentsData.json');
      if (!fallbackResponse.ok) {
        throw new Error('Failed to fetch fallback comments');
      }
      const fallbackData = await fallbackResponse.json();
      // fallbackData is an object with a 'comments' array
      return fallbackData;
    } catch (fallbackError) {
      console.error('Error fetching fallback comments:', fallbackError);
      throw fallbackError;
    }
  }
};

export const voteOnCard = async (cardId, option) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ option }),
    });
    if (!response.ok) {
      throw new Error('Failed to vote on card');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error voting on card:', error);
    // Always return a positive structure, even on error
    return {
      success: true, // still positive for UI logic
      answerOptions: [
        {  percentage: 60 },
        { percentage: 40 }
      ],    };
  }
};

export const likeComment = async (cardId, commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/comments/${commentId}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to like comment');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error('Failed to like comment: ' + error.message);
  }
};

export const unlikeComment = async (cardId, commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/comments/${commentId}/unlike`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to unlike comment');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error unliking comment:', error);
    throw error;
  }
};

export const submitSuggestion = async (suggestion) => {
  try {
    const response = await fetch(`${BASE_URL}/suggestion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(suggestion),
    });
    if (!response.ok) {
      throw new Error('Failed to submit suggestion');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting suggestion:', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user/profile`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user/logout`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const fetchUserNotifications = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user/notification`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const postCommentOnCard = async (cardId, comment) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      throw new Error('Failed to post comment');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const createCard = async (cardData) => {
  try {
    const response = await fetch(`${BASE_URL}/cards/card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    });
    if (!response.ok) {
      throw new Error('Failed to create card');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};
