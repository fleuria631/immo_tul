export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type if sending FormData (browser sets it with boundary automatically)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
  }

  return response.json();
};

export const loginAdmin = async (email, password) => {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getMe = async () => {
  return fetchApi('/auth/me', {
    method: 'GET',
  });
};

export const getProperties = async () => {
  return fetchApi('/properties', {
    method: 'GET',
  });
};

export const createProperty = async (data) => {
  return fetchApi('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateProperty = async (id, data) => {
  return fetchApi(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteProperty = async (id) => {
  return fetchApi(`/properties/${id}`, {
    method: 'DELETE',
  });
};

export const uploadImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });
  
  return fetchApi('/upload', {
    method: 'POST',
    body: formData,
  });
};

export const getAdminStats = async () => {
  return fetchApi('/stats/dashboard', {
    method: 'GET',
  }).catch(() => ({ views: 0, inquiries: 0, properties: 0 }));
};

export const getPublicProperties = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  const query = new URLSearchParams(cleanParams).toString();
  return fetchApi(`/properties?${query}`, { method: 'GET' });
};

export const getPropertyById = async (id) => {
  return fetchApi(`/properties/${id}`, { method: 'GET' });
};

export const submitContact = async (data) => {
  return fetchApi('/contacts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('uploads/')) return `http://localhost:3001/${imagePath}`;
  if (imagePath.startsWith('/')) return imagePath;
  return `/${imagePath}`;
};


