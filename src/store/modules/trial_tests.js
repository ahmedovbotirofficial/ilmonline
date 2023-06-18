import {
  getTrialTestCategories,
  getTrialSchoolItem,
  getTrialTestList,
  getTrialTest,
  startTrialTestVariant,
  getMyTrialTests,
  getMyTrialTest,
  sendMyTrialTest,
  passingTrialTestVariant,
  deleteTrialTestVariant,
} from '@/api/services';
import router from '@/router';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';

export default {
  state: {
    trialCategories: [],
    trialSchoolItems: [],
    trialTestList: [],
    currentTrialTest: [],
    myTrialTest: [],
    myTrialTestAnswers: [],

    currentTrialTestTimer: false,
  },
  getters: {
    getTrialCategories: (state) => state.trialCategories,
    getTrialSchoolItems: (state) => state.trialSchoolItems,
    getTrialTestList: (state) => state.trialTestList,
    getCurrentTrialTest: (state) => state.currentTrialTest,
    getMyTrialTest: (state) => state.myTrialTest,
    getMyTrialTestAnswers: (state) => state.myTrialTestAnswers,
    getTrialTestTimerStatus: (state) => state.currentTrialTestTimer,
  },
  mutations: {
    SET_TRIAL_CATEGORIES(state, options) {
      // console.log('SET_TRIAL_CATEGORIES >>>', options);
      state.trialCategories = options;
    },
    SET_SCHOOL_ITEMS(state, options) {
      // console.log('SET_SCHOOL_ITEMS >>>', options);
      state.trialSchoolItems = options;
    },
    SET_TRIAL_TEST_LIST(state, options) {
      // console.log('SET_TRIAL_TEST_LIST >>>', options);
      state.trialTestList = options;
    },
    SET_CURRENT_TRIAL_TEST(state, options) {
      // console.log('currentTrialTestVariant <<<', options);
      state.currentTrialTest = options;
    },
    SET_TRIAL_TIMER_STATUS(state, options) {
      // console.log('SET_TRIAL_TIMER_STATUS >>>', options);
      state.currentTrialTestTimer = options;
    },
    SET_MY_TRIAL_TEST(state, options) {
      // console.log('myTrialTest >>>', options);
      state.myTrialTest = options;
    },
    SET_MY_TRIAL_TEST_ANSWERS(state, options) {
      // console.log('myTrialTestAnswers >>>', options);
      state.myTrialTestAnswers = options;
    },
  },
  actions: {
    async getTrialTestCategories({ commit }) {
      try {
        const res = await getTrialTestCategories();
        if (res.status === 200) {
          commit('SET_TRIAL_CATEGORIES', res.data.data.categories);
        }
      } catch (error) {}
    },

    async getTrialSchoolItem({ commit }, data) {
      try {
        const res = await getTrialSchoolItem(data);
        if (res.status === 200) {
          commit('SET_SCHOOL_ITEMS', res.data.data.school_items);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getTrialTestList({ commit }, data) {
      try {
        const res = await getTrialTestList(data);
        if (res.status === 200) {
          commit('SET_TRIAL_TEST_LIST', res.data.data.tests);
        }
        return res.data.data.tests;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getTrialTest({ commit }, data) {
      try {
        const res = await getTrialTest(data);
        if (res.status === 200) {
          commit('SET_CURRENT_TRIAL_TEST', res.data.data.test);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async startTrialTestVariant({ commit }, data) {
      try {
        const res = await startTrialTestVariant(data);
        if (res.status === 200) {
          // commit(
          //   'SET_MY_TRIAL_TEST_ANSWERS',
          //   res.data.data.test.studentResponses
          // );
          commit('SET_MY_TRIAL_TEST', res.data.data.test);
          commit('SET_TRIAL_TIMER_STATUS', !!res.data.data.test.ended);
        }
        // console.log('response startTrialTestVariant', res.data.data);
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async passingTrialTestVariant({ commit }, data) {
      // console.log(data);
      try {
        const res = await passingTrialTestVariant(data);
        if (res.status === 200) {
          // commit(
          //   'SET_MY_TRIAL_TEST_ANSWERS',
          //   res.data.data.test.studentResponses
          // );
          commit('SET_MY_TRIAL_TEST', res.data.data.test);
          commit('SET_TRIAL_TIMER_STATUS', !!res.data.data.test.ended);
        }
        // console.log('response passingTrialTestVariant', res.data.data);
        // return res.data.data.test;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async deleteTrialTestVariant({ commit }, data) {
      try {
        const res = await deleteTrialTestVariant(data);
        if (res.status === 200) {
          commit('SET_TRIAL_TIMER_STATUS', true);
        }
        // console.log('response passingTrialTestVariant', res.data.data);
        // return res.data.data.test;
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getMyTrialTests({ commit }, data) {
      try {
        const res = await getMyTrialTests(data);
        return res.data.data.tests;
      } catch (error) {
        // console.log(error);
      }
    },

    async getMyTrialTest({ commit }, data) {
      try {
        const res = await getMyTrialTest(data);
        if (res.status === 200) {
          commit('SET_MY_TRIAL_TEST', res.data.data.test);
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async sendMyTrialTest({ commit }, data) {
      try {
        const res = await sendMyTrialTest(data);
        if (res.status === 200) {
        }
      } catch (error) {
        // error.handleGlobally && error.handleGlobally();
      }
    },
  },
};
