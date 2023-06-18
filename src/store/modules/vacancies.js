import {
  getVacancyList,
  getVacancyDetails,
  getVacancyFilters,
} from '@/api/vacancies';
export default {
  state: {
    vacancyList: null,
    vacancyDetails: null,
    lastPage: null,
    currentPage: 1,
    filtersList: null,
  },
  getters: {
    getVacancyList: (state) => state.vacancyList,
    getVacancyDetails: (state) => state.vacancyDetails,
    getLastPage: (state) => state.lastPage,
    getCurrentPage: (state) => state.currentPage,
    getFiltersList: (state) => state.filtersList,
  },
  mutations: {
    SET_VACANCY_LIST(state, data) {
      state.vacancyList = data;
    },
    SET_VACANCY_DETAILS(state, data) {
      state.vacancyDetails = data;
    },
    SET_LAST_PAGE(state, data) {
      state.lastPage = data;
    },
    SET_CURRENT_PAGE(state, data) {
      state.currentPage = data;
    },
    SET_FILTERS_LIST(state, payload) {
      state.filtersList = payload;
    },
  },
  actions: {
    async getVacancyListData({ commit }, data) {
      let res;
      try {
        res = await getVacancyList(data);
        commit('SET_VACANCY_LIST', res.data.data.vacancies);
        commit('SET_LAST_PAGE', res.data.data.vacancies.last_page);
        commit('SET_CURRENT_PAGE', res.data.data.vacancies.current_page);
      } catch (e) {
        console.log('>>> getVacancyList error', e);
      }
    },
    async getVacancyFilters() {
      try {
        const res = await getVacancyFilters();
        return res.data.data.filters;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },
    changeCurrentPage({ commit }, payload) {
      commit('SET_CURRENT_PAGE', payload);
    },
    async getVacancyDetailsData({ commit }, data) {
      let res;
      try {
        res = await getVacancyDetails(data);
        commit('SET_VACANCY_DETAILS', res.data.data.vacancy);
      } catch (e) {
        console.log('>>> getVacancyDetails error', e);
      }
    },
    async getVacancyFiltersData({ commit }) {
      let res;
      try {
        res = await getVacancyFilters();
        commit('SET_FILTERS_LIST', res.data.data.filters);
      } catch (e) {
        console.log('>>> getVacancyDetails error', e);
      }
    },
  },
};
