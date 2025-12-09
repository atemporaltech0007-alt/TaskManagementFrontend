import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const login = async () => {
  const { data } = await api.post('/token/authentication', {
    user: import.meta.env.VITE_API_USER,
    password: import.meta.env.VITE_API_PASSWORD
  });
  return data.token;
};

export const getTasks = (page = 1, pageSize = 10, filters = {}) => 
  api.get('/tasks', { params: { page, pageSize, ...filters } });

export const getTask = (id: number) => api.get(`/tasks/${id}`);

export const createTask = (task: any) => api.post('/tasks', task);

export const updateTask = (id: number, task: any) => api.put(`/tasks/${id}`, task);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

export const getStates = () => api.get('/states');

export const getState = (id: number) => api.get(`/states/${id}`);

export const createState = (state: any) => api.post('/states', state);

export const updateState = (id: number, state: any) => api.put(`/states/${id}`, state);

export const deleteState = (id: number) => api.delete(`/states/${id}`);

export default api;
