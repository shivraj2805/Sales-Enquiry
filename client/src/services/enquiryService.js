import api from '../utils/axios';

export const enquiryService = {
  // Get all enquiries
  getEnquiries: async (filters = {}) => {
    const response = await api.get('/enquiries', { params: filters });
    return response.data.data; // Return just the data array
  },

  // Alias for getEnquiries
  getAllEnquiries: async (filters = {}) => {
    const response = await api.get('/enquiries', { params: filters });
    return response.data.data; // Return just the data array
  },

  // Get single enquiry
  getEnquiryById: async (id) => {
    const response = await api.get(`/enquiries/${id}`);
    return response.data.data; // Return just the data object
  },

  // Create enquiry
  createEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiries', enquiryData);
    return response.data.data; // Return just the data object
  },

  // Update enquiry
  updateEnquiry: async (id, enquiryData) => {
    const response = await api.put(`/enquiries/${id}`, enquiryData);
    return response.data.data; // Return just the data object
  },

  // Delete enquiry
  deleteEnquiry: async (id) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data.data; // Return just the data object
  },

  // Delete all enquiries (Admin only)
  deleteAllEnquiries: async () => {
    const response = await api.delete('/enquiries/all');
    return response.data.data; // Return just the data object
  },

  // Upload attachment
  uploadAttachment: async (id, formData) => {
    const response = await api.post(`/enquiries/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data; // Return just the data object
  },
};
