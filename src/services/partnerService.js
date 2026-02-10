import api from '../api';

export const getPartners = async (params) => {
  try {
    const response = await api.get('/our-partners/partners', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const response = await api.get('/our-partners/countries');
    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const getStates = async (country) => {
  try {
    const response = await api.get('/our-partners/states', { params: { country } });
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export const getCities = async (country, state) => {
  try {
    const response = await api.get('/our-partners/cities', { params: { country, state } });
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};
