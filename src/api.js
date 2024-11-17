import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);
export const getGerbangs = () => axios.get(`${BASE_URL}/gerbangs`);
export const createGerbang = (data) => axios.post(`${BASE_URL}/gerbangs`, data);
export const updateGerbang = (data) => axios.put(`${BASE_URL}/gerbangs`, data);
export const deleteGerbang = (data) => axios.delete(`${BASE_URL}/gerbangs`, { data });
export const getLalin = (tanggal) => axios.get(`${BASE_URL}/lalins`, { params: { tanggal } });
