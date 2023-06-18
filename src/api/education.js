import { Axios } from '@/api/config';
const api_version = '/api';
import { getFromLS } from '@/library/helpers';
import { ClientJS } from 'clientjs';

export const getCategories = () => {
  const url = `${api_version}/education/categories`;
  return Axios.get(url);
};

export const getArticles = () => {
  const url = `${api_version}/education/useful-articles`;
  return Axios.get(url);
};

export const getSearchResult = (payload) => {
  let url;
  if (payload.slug) {
    url = `${api_version}/education/search/suggestions?query=${payload.value}&category_slug=${payload.slug}`;
  } else if (!payload.slug) {
    url = `${api_version}/education/search/suggestions?query=${payload.value}`;
  }
  return Axios.get(url);
};

export const getSubcategory = (payload) => {
  const url = `${api_version}/education/categories/${payload}`;
  return Axios.get(url);
};

export const getArticlesList = (payload) => {
  const url = `${api_version}/education/articles?category_slug=${payload.slug}&order_by=${payload.order_by}&page=${payload.page}`;
  return Axios.get(url);
};

export const getArticlesDetails = (payload) => {
  let url;
  if (typeof payload === 'object') {
    url = `${api_version}/education/articles/${payload.slug}?student_unique_token=${payload.token}`;
  } else {
    let token = getFromLS('token');
    let fingerprint = new ClientJS().getFingerprint();
    let userToken = token ? token : fingerprint;
    url = `${api_version}/education/articles/${payload}?student_unique_token=${userToken}`;
  }

  return Axios.get(url);
};

export const putFavorite = ({ slug, token }) => {
  const url = `${api_version}/education/articles/${slug}/mark-as-useful?student_unique_token=${token}`;
  return Axios.post(url);
};
