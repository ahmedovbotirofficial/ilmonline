import {
  getThreads,
  getMessages,
  sendUserMessage,
  getMyUnreadMessages,
} from '@/api/services';

export default {
  state: {
    userThreads: null,
    messages: [],
    myUnreadMessCount: null,
    offset: 0,
  },
  getters: {
    getUserThreads: (state) => state.userThreads,
    getMessages: (state) => state.messages,
    getUnreadCounter: (state) => state.myUnreadMessCount,
    getOffset: (state) => state.offset,
  },
  mutations: {
    SET_MESSAGES(state, newMessages) {
      // console.log(!!newMessages.message);
      if (!!newMessages.message) {
        state.messages = [newMessages.message, ...state.messages];
      } else if (state.messages.length > 1 && state.offset === 0) {
        state.messages = [...newMessages];
      } else if (state.messages.length > 1 && state.offset !== 0) {
        state.messages = [...state.messages, ...newMessages];
      } else {
        state.messages = newMessages;
      }
    },
    SET_OFFSET(state, offset) {
      // console.log('changing offset', offset);
      if (offset > 0) {
        state.offset += offset;
      } else {
        state.offset = 0;
      }
    },
    SET_USER_THREADS(state, threads) {
      state.userThreads = threads;
    },

    SET_MY_UNREAD_MESS(state, options) {
      state.myUnreadMessCount = options;
    },
  },
  actions: {
    async getSchoolThreads({ commit, dispatch, getters }, searchQuery) {
      try {
        const res = await getThreads(searchQuery);
        // console.log('threads from server >>.', res.data.data.threads);
        commit('SET_USER_THREADS', res.data.data.threads);
        dispatch('getMySchoolUnreadMessages');
      } catch (error) {
        console.log(error);
        // error.handleGlobally && error.handleGlobally();
      }
    },

    async getMessages({ commit, dispatch }, data) {
      // console.log('send data for user dialogs >>>', data);
      try {
        const res = await getMessages(data);
        if (res.status === 200) {
          commit('SET_MESSAGES', res.data.data.messages);
          // dispatch('getMyUnreadMessages');
          // }
        }
        // return res.data.data.messages;
      } catch (error) {
        console.log(error);
      }
    },

    async sendUserMessage({ commit, dispatch }, message) {
      try {
        let formData = new FormData();
        formData.append('thread_id', message.thread_id);
        if (message.body) {
          formData.append('body', message.body);
        }
        if (message.attachment) {
          formData.append('body', !!message.body === '');
          formData.append('attachment', message.attachment);
        }
        const res = await sendUserMessage(formData);
        if (res.status === 200) {
          // console.log('res.status === 200', res.data.data);
          commit('SET_MESSAGES', res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getMySchoolUnreadMessages({ commit }) {
      try {
        const res = await getMyUnreadMessages();
        // console.log('getMyUnreadMessages from server >>.', res.data.data);
        commit('SET_MY_UNREAD_MESS', res.data.data.my_unread_count);
      } catch (error) {
        console.log(error);
        // error.handleGlobally && error.handleGlobally();
      }
    },
  },
};
