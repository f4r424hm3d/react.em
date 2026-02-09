import api from '../api';

/**
 * Apply for a course/program
 * @param {number|string} courseId - The course/program ID
 * @returns {Promise<Object>} Response data
 */
export const applyCourse = async (courseId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await api.get(`/student/apply-program/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Get all applied courses for the current student
 * @returns {Promise<Array>} Array of applied courses
 */
export const getAppliedCourses = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await api.get('/student/applied-courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch applied courses:', error);
    return [];
  }
};

/**
 * Check if a course is already applied
 * @param {number|string} courseId - The course/program ID
 * @param {Array} appliedCourses - Array of applied courses
 * @returns {boolean} True if course is applied
 */
export const isCourseApplied = (courseId, appliedCourses) => {
  return appliedCourses.some(course => course.id === parseInt(courseId));
};
