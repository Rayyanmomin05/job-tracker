import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const getApplications = (params) => API.get('/applications', { params });
export const getApplicationById = (id) => API.get(`/applications/${id}`);
export const createApplication = (data) => API.post('/applications', data);
export const updateApplication = (id, data) => API.put(`/applications/${id}`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);
export const addNote = (id, content) => API.post(`/applications/${id}/notes`, { content });
export const deleteNote = (id, noteId) => API.delete(`/applications/${id}/notes/${noteId}`);
export const getStats = () => API.get('/applications/stats');
export const getAISuggestions = (description) => API.post('/ai/suggest', { description });