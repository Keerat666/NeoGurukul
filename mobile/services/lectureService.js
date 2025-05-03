const BASE_URL = 'https://neogurukul.onrender.com/api/v1/lecture';
const LOCAL_BASE_URL = 'http://localhost:8000/api/v1/lecture';

export const createLecture = async (lectureData) => {
  try {
    const response = await fetch(`${LOCAL_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lectureData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create lecture');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
