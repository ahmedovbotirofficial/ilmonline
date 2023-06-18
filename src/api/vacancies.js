import { Axios } from '@/api/config';
const api_version = '/api';

export const getVacancyList = (payload) => {
  const url = `${api_version}/vacancies`;
  return Axios.get(url, {
    params: payload,
  });
};
export const getVacancyDetails = (payload) => {
  const url = `${api_version}/vacancies/vacancy/${payload}`;
  return Axios.get(url);
};

export const getVacancyFilters = () => {
  const url = `${api_version}/vacancies/filters`;
  return Axios.get(url);
};
