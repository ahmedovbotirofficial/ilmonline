import { required, numeric } from 'vuelidate/lib/validators';

export default {
  validations: {
    phone_number: {
      required,
      numeric,
    },
  },
  computed: {
    isPhoneError() {
      return (
        (this.$v.phone_number.$dirty && this.$v.phone_number.$invalid) ||
        !!this.getErrors.phone_number
      );
    },
    phoneErrorText() {
      if (!this.$v.phone_number.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.phone_number.phone_number) {
        return this.$t('form.login_error');
      }
      if (!!this.getErrors.phone_number) {
        return this.getErrors.phone_number[0];
      }
    },
  },
};
