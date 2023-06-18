export default {
  state: {
    modalState: false,
    modalName: '',
    props: null,
  },
  getters: {
    getModalState: (state) => state.modalState,
    getModalName: (state) => state.modalName,
    getModalProps: (state) => state.props,
  },
  mutations: {
    SET_MODAL(state, modal) {
      state.modalState = modal.state;
      state.modalName = modal.name ? modal.name : '';
      state.props = modal.props;
    },
  },
  actions: {},
};
