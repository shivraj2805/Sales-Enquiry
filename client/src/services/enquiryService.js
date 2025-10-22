import api from '../utils/axios';

export const enquiryService = {
  // Get all enquiries
  getEnquiries: async (filters = {}) => {
    const response = await api.get('/enquiries', { params: filters });
    return response.data;
  },

  // Get single enquiry
  getEnquiryById: async (id) => {
    const response = await api.get(`/enquiries/${id}`);
    return response.data;
  },

  // Create enquiry
  createEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  },

  // Update enquiry
  updateEnquiry: async (id, enquiryData) => {
    const response = await api.put(`/enquiries/${id}`, enquiryData);
    return response.data;
  },

  // Delete enquiry
  deleteEnquiry: async (id) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (id, formData) => {
    const response = await api.post(`/enquiries/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
