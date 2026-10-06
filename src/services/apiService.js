const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Universal fetch wrapper that attaches Bearer JWT token if available.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('prep_ai_jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && !token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ') ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    // If backend isn't reached or server error, bubble up or let caller handle
    console.warn(`[PrepAI API] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const apiService = {
  // Auth
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(fullName, email, password, targetCompany) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, targetCompany }),
    });
  },

  async getProfile() {
    return request('/auth/me', { method: 'GET' });
  },

  // Subjects & Topics
  async getSubjects() {
    return request('/subjects', { method: 'GET' });
  },

  async getSubject(id) {
    return request(`/subjects/${id}`, { method: 'GET' });
  },

  async getSubjectTopics(id) {
    return request(`/subjects/${id}/topics`, { method: 'GET' });
  },

  // Diagnostic & Company-Specific Assessment (Serving real questions from PostgreSQL)
  async getQuestions(subjectId = 'os', count = 15, companyType = null) {
    const query = companyType 
      ? `?count=${count}&companyType=${encodeURIComponent(companyType)}` 
      : `?count=${count}`;
    return request(`/assessments/${subjectId}/questions${query}`, { method: 'GET' });
  },

  async submitAssessment(subjectId, answers, durationSeconds = 900, companyType = null) {
    return request(`/assessments/${subjectId}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        subjectId,
        answers,
        durationSeconds,
        companyType,
      }),
    });
  },

  // Topic-specific modular assessments & targeted learning
  async getTopicQuestions(topicId, count = 16) {
    return request(`/assessments/topic/${topicId}/questions?count=${count}`, { method: 'GET' });
  },

  async submitTopicAssessment(topicId, answers, durationSeconds = 600) {
    return request(`/assessments/topic/${topicId}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        subjectId: 'os',
        answers,
        durationSeconds,
      }),
    });
  },

  async getAssessmentHistory() {
    return request('/assessments/history', { method: 'GET' });
  },

  // Study Plan Roadmap
  async getStudyPlan(subjectId = 'os') {
    return request(`/study-plans/${subjectId}`, { method: 'GET' });
  },

  async toggleTopic(topicId) {
    return request(`/study-plans/topics/${topicId}/toggle`, { method: 'POST' });
  },

  // RAG Chat Doubt Resolution
  async askDoubt(message, subjectId = 'os') {
    return request('/chat/ask', {
      method: 'POST',
      body: JSON.stringify({ message, subjectId }),
    });
  },
};

export default apiService;
