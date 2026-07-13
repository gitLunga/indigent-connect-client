// services/api.js
import axios from 'axios';
//import { API_URL } from '@env';

// Get base URL from environment variables (Vite or CRA)
const getBaseURL = () => {
    // For Vite: import.meta.env.VITE_API_URL
    // if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    //     return import.meta.env.VITE_API_URL;
    // }

    // In development (npm start), use relative URL so the proxy works
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:5000/api';
    }

    // For Create React App: process.env.REACT_APP_API_URL
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    // Fallback
    return 'https://api.malcam.co.za/api';
};

const BASE_URL = getBaseURL();

console.log('🌐 Using API URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach auth token + logging
api.interceptors.request.use(
    (config) => {
        console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        const token = localStorage.getItem('applicantToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        console.error('❌ Request setup error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor – preserves response object for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Error:', error.message);

        if (error.response) {
            const customError = new Error(
                error.response.data?.message || `Server error: ${error.response.status}`
            );
            Object.defineProperty(customError, 'response', {
                value: error.response,
                enumerable: true,
                configurable: true,
            });
            throw customError;
        } else if (error.request) {
            const customError = new Error(
                `Cannot connect to server at ${BASE_URL}. Check if backend is running.`
            );
            Object.defineProperty(customError, 'request', {
                value: error.request,
                enumerable: true,
                configurable: true,
            });
            throw customError;
        } else {
            throw new Error('Request configuration error: ' + error.message);
        }
    }
);

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = {
    registerApplicant: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('🔴 Registration error:', error);
            throw error;
        }
    },

    // Uploads supporting documents (ID, proof of income required; proof of
    // residence and affidavit optional) and marks the profile ready for intake review.
    completeProfile: async (applicantId, profileData) => {
        try {
            console.log('📤 Starting profile completion for applicant:', applicantId);

            const formData = new FormData();

            if (profileData.id_document instanceof File) {
                formData.append('id_document', profileData.id_document);
            }
            if (profileData.income_document instanceof File) {
                formData.append('income_document', profileData.income_document);
            }
            if (profileData.residence_document instanceof File) {
                formData.append('residence_document', profileData.residence_document);
            }
            if (profileData.affidavit_document instanceof File) {
                formData.append('affidavit_document', profileData.affidavit_document);
            }

            const response = await api.post(
                `/auth/complete-profile/${applicantId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000,
                }
            );

            console.log('✅ Profile completed:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Complete profile error:', error);
            throw error;
        }
    },

    login: async (loginData) => {
        try {
            console.log('🔵 Login request for:', loginData.email);
            const response = await api.post('/auth/login', loginData);
            console.log('✅ Login successful');
            return response.data;
        } catch (error) {
            console.error('🔴 Login error:', error);
            throw error;
        }
    },

    testConnection: () => api.get('/test'),
};

// ─── Application API ─────────────────────────────────────────────────────────
export const applicationAPI = {
    submitApplication: (applicantId) =>
        api.post('/applications/applications', { applicant_id: applicantId }),
    getUserApplications: (applicantId) =>
        api.get(`/applications/users/${applicantId}/applications`),
    getApplicationDetails: (applicantId, applicationId) =>
        api.get(`/applications/users/${applicantId}/applications/${applicationId}`),
    cancelApplication: (applicantId, applicationId) =>
        api.put(`/applications/users/${applicantId}/applications/${applicationId}/cancel`),
    resubmitApplication: (applicantId, applicationId) =>
        api.post(`/applications/users/${applicantId}/applications/${applicationId}/resubmit`),
    getApplicationSummary: (applicantId) =>
        api.get(`/applications/users/${applicantId}/applications/summary`),
    checkEligibility: (applicantId) =>
        api.get(`/applications/users/${applicantId}/eligibility`),
};

// ─── Notification API ───────────────────────────────────────────────────────
export const notificationAPI = {
    getUserNotifications: (userId, userType) =>
        api.get(`/notifications/user?user_id=${userId}&user_type=${userType}`),
    getUnreadCount: (userId, userType) =>
        api.get(`/notifications/unread-count?user_id=${userId}&user_type=${userType}`),
    markAsRead: (notificationId, userId, userType) =>
        api.patch(`/notifications/${notificationId}/read`, {
            user_id: userId,
            user_type: userType,
        }),
    markAllAsRead: (userId, userType) =>
        api.patch('/notifications/mark-all-read', {
            user_id: userId,
            user_type: userType,
        }),
    deleteNotification: (notificationId, userId, userType) =>
        api.delete(`/notifications/${notificationId}`, {
            data: { user_id: userId, user_type: userType },
        }),
};

// ─── Applicant Profile API ────────────────────────────────────────────────────
export const applicantAPI = {
    getProfile:    ()     => api.get('/applicant/me'),
    updateProfile: (data) => api.patch('/applicant/me', data),
};

export default api;
