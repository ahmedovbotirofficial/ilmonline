import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getErrors']),

    isInvalidForm() {
      return this.$v.$invalid;
    },
  },

  methods: {
    showValidationErrors() {
      this.$v.$touch();
    },
    hideValidationErrors() {
      this.$v.$reset();
    },
    resetServerError(fieldName) {
      if (!!this.getErrors[fieldName])
        this.$store.commit('RESET_FIELD_ERROR', fieldName);
    },
  },
};
