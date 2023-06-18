import {
  getCategories,
  getArticles,
  getSearchResult,
  getSubcategory,
  getArticlesList,
  getArticlesDetails,
  putFavorite,
} from '@/api/education.js';
export default {
  state: {
    categories: [],
    popularArticles: [],
    suggestions: [],
    subcategories: [],
    articlesList: [],
    lastEducationPage: null,
    currentEducationPage: 1,
    detailArticle: null,
    likesCount: null,
  },
  getters: {
    getCategoriesList: (state) => state.categories,
    getArticlesPopular: (state) => state.popularArticles,
    getSuggestionsSearchResults: (state) => state.suggestions,
    getSubcategories: (state) => state.subcategories,
    getArticlesList: (state) => state.articlesList,
    getLastEducationPage: (state) => state.lastEducationPage,
    getCurrentEducationPage: (state) => state.currentEducationPage,
    getDetailArticle: (state) => state.detailArticle,
    getLikesCount: (state) => state.likesCount,
  },
  mutations: {
    SET_CATEGORIES_LIST(state, data) {
      state.categories = [...data];
    },
    SET_POPULAR_ARTICLES_LIST(state, data) {
      state.popularArticles = [...data];
    },
    SET_SUGGESTIONS_RESULT(state, data) {
      state.suggestions = [...data];
    },
    SET_SUBCATEGORIES(state, data) {
      state.subcategories = [...data];
    },
    SET_ARTICLES_LIST(state, data) {
      state.articlesList = [...data];
    },
    SET_LAST_EDUCATION_PAGE(state, data) {
      state.lastEducationPage = data;
    },
    SET_CURRENT_EDUCATION_PAGE(state, data) {
      state.currentEducationPage = data;
    },
    SET_ARTICLE_DETAILS(state, data) {
      state.detailArticle = data;
    },
    PUT_LIKES_COUNT(state, data) {
      state.likesCount = data;
    },
  },
  actions: {
    async getCategoriesData({ commit }) {
      let res;
      try {
        res = await getCategories();
        commit('SET_CATEGORIES_LIST', res.data.data.categories);
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
    changeCurrentEducationPage({ commit }, payload) {
      commit('SET_CURRENT_EDUCATION_PAGE', payload);
    },
    async getPopularArticlesData({ commit }) {
      let res;
      try {
        res = await getArticles();
        commit('SET_POPULAR_ARTICLES_LIST', res.data.data.articles);
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
    async getSearchResultData({ commit, dispatch }, payload) {
      let res;
      try {
        res = await getSearchResult(payload);
        commit('SET_SUGGESTIONS_RESULT', res.data.data.suggestions);
        if (payload.slug) {
          commit('SET_ARTICLES_LIST', res.data.data.suggestions);
        }
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
    async getSubcategoryArticle({ commit }, payload) {
      let res;
      try {
        res = await getSubcategory(payload);
        commit('SET_SUBCATEGORIES', res.data.data.subcategories);
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
    async getFullArticlesList({ commit }, payload) {
      let res;
      try {
        res = await getArticlesList(payload);
        commit('SET_ARTICLES_LIST', res.data.data.articles.data);
        commit(
          'SET_CURRENT_EDUCATION_PAGE',
          res.data.data.articles.current_page
        );
        commit('SET_LAST_EDUCATION_PAGE', res.data.data.articles.last_page);
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
    async getArticleDetailsData({ commit }, payload) {
      let res;
      try {
        res = await getArticlesDetails(payload);
        commit('SET_ARTICLE_DETAILS', res.data.data.article);
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
    async putFavoriteItem({ commit, dispatch }, payload) {
      let res;
      try {
        res = await putFavorite(payload);
        if (res.data.data.likes) {
          dispatch('getArticleDetailsData', payload);
          commit('PUT_LIKES_COUNT', res.data.data.likes.likes_count);
        }
      } catch (e) {
        // console.log('>>> getVacancyDetails error', e);
      }
    },
  },
};
