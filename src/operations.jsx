export const fetchAnswerOptions = async () => {
    try {
      const response = await fetch('/api/answers');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching answer options:', error);
      throw error;
    }
  };

export const fetchQuestionData = async () => {
  try {
    const response = await fetch('/api/question');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching question data:', error);
    throw error;
  }
};

export const vote = async (option) => {
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ option }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  };

  // New function to load comments from local JSON file
export const fetchOpinions = async () => {
    try {
      const response = await fetch('/data/mockOpinions.json'); // Adjust the path as necessary
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