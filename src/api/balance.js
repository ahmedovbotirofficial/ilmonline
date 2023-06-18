import { Axios } from '@/api/config';
const api_version = '/api';

export const getBalanceData = () => {
  const url = `${api_version}/profile/payment-data/balance`;
  return Axios.get(url);
};

export const getPaymentHistoryData = (payload) => {
  const url = `${api_version}/profile/payment-data/transactions?page=${
    payload ? payload : 1
  }`;
  return Axios.get(url);
};

export const addPaymentCard = (data) => {
  const url = `${api_version}/profile/payment-data/cards/bind/create`;
  return Axios.post(url, data);
};

export const confirmVerificationNumber = (data) => {
  const url = `${api_version}/profile/payment-data/cards/bind/apply`;
  return Axios.post(url, data);
};

export const getCardsList = () => {
  const url = `${api_version}/profile/payment-data/cards`;
  return Axios.get(url);
};

export const deleteCard = (data) => {
  const url = `${api_version}/profile/payment-data/cards/bind/delete/${data}`;
  return Axios.delete(url);
};

export const replenishBalanceData = (data) => {
  const url = `${api_version}/profile/payment-data/deposit`;
  return Axios.post(url, data);
};
