import {
  getBalanceData,
  getPaymentHistoryData,
  addPaymentCard,
  confirmVerificationNumber,
  getCardsList,
  deleteCard,
  replenishBalanceData,
} from '@/api/balance.js';
import router from '@/router';

export default {
  state: {
    balance: null,
    paymentHistory: [],
    transitionId: null,
    paymentData: null,
    cardsList: [],
    notificationMessage: '',
    balanceData: null,
  },
  getters: {
    getBalance: (state) => state.balance,
    getPaymentHistory: (state) => state.paymentHistory,
    getTransitionId: (state) => state.transitionId,
    getPaymentData: (state) => state.paymentData,
    getCardsList: (state) => state.cardsList,
    getNotificationMessage: (state) => state.notificationMessage,
    getBalanceDataInfo: (state) => state.balanceData,
  },
  mutations: {
    SET_BALANCE(state, data) {
      state.balance = data;
    },
    SET_PAYMENT_HISTORY_DATA(state, data) {
      state.paymentHistory = [...data];
    },
    SET_TRANSITION_ID(state, data) {
      state.transitionId = data;
    },
    SET_PAYMENT_DATA(state, data) {
      state.paymentData = data;
    },
    SET_CARDS_LIST(state, data) {
      state.cardsList = [...data];
    },
    SET_BALANCE_STATUS(state, data) {
      state.notificationMessage = data;
    },
    SET_BALANCE_INFO(state, data) {
      state.balanceData = data;
    },
  },
  actions: {
    async getBalanceData({ commit }) {
      let res;
      try {
        res = await getBalanceData();
        commit('SET_BALANCE', res.data.data.balance);
      } catch (e) {
        console.log('>>> getVacancyDetails error', e);
      }
    },
    async getPaymentHistoryData({ commit }, payload) {
      let res;
      try {
        res = await getPaymentHistoryData(payload);
        commit('SET_CURRENT_PAGE', res.data.data.transactions.current_page);
        commit('SET_LAST_PAGE', res.data.data.transactions.last_page);
        commit('SET_PAYMENT_HISTORY_DATA', res.data.data.transactions.data);
      } catch (e) {
        console.log('>>> getVacancyDetails error', e);
      }
    },
    async addPaymentCard({ commit, dispatch }, payload) {
      let res;
      try {
        res = await addPaymentCard(payload);
        if (res.status === 200) {
          commit('SET_TRANSITION_ID', res.data.data.transaction_id);
          if (res.data.data.is_otp_required) {
            commit('SET_MODAL', {
              state: true,
              name: 'confirm-verification',
            });
            commit('SET_PAYMENT_DATA', payload);
          } else {
            router.push({ name: 'payment' });
            dispatch('getCardsList');
          }
        }
        return res.data.data;
      } catch (e) {
        commit('SET_MODAL', {
          state: true,
          name: 'error-add-card',
        });
        console.log('>>> addPaymentCard error', e);
        return e;
      }
    },
    async confirmVerificationNumber({ commit, dispatch }, payload) {
      let res;
      try {
        res = await confirmVerificationNumber(payload);
        if (res.status === 200) {
          commit('SET_MODAL', {
            state: true,
          });
          router.push({ name: 'payment' });
          dispatch('getCardsList');
        }
      } catch (e) {
        console.log('>>> addPaymentCard error', e);
      }
    },
    async getCardsList({ commit }) {
      let res;
      try {
        res = await getCardsList();
        if (res.status === 200) {
          commit('SET_CARDS_LIST', res.data.data.cards);
        }
      } catch (e) {
        console.log('>>> addPaymentCard error', e);
      }
    },
    async deleteCard({ dispatch }, payload) {
      let res;
      try {
        res = await deleteCard(payload);
        if (res.status === 200) {
          dispatch('getCardsList');
        }
      } catch (e) {
        console.log('>>> addPaymentCard error', e);
      }
    },
    async replenishBalance({ commit, dispatch }, payload) {
      let res;
      try {
        commit('SET_BALANCE_INFO', payload);
        res = await replenishBalanceData(payload);
        if (res.status === 200) {
          commit('SET_BALANCE_STATUS', 'success');
          commit('SET_MODAL', {
            state: false,
          });
          dispatch('getBalanceData');
        }
      } catch (e) {
        commit('SET_BALANCE_STATUS', 'error');
        console.log('>>> addPaymentCard error', e);
      }
    },
  },
};
