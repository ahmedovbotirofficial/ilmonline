import { required, email } from 'vuelidate/lib/validators';

export default {
  validations: {
    email: {
      required,
      email,
    },
  },
  computed: {
    isEmailError() {
      return (
        (this.$v.email.$dirty && this.$v.email.$invalid) ||
        !!this.getErrors.email
      );
    },
    emailErrorText() {
      if (!this.$v.email.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.email.email) {
        return this.$t('form.login_error');
      }
      if (!!this.getErrors.email) {
        return this.getErrors.email[0];
      }
    },
  },
};
