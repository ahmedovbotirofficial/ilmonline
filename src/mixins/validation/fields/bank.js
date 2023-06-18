import { required, numeric } from 'vuelidate/lib/validators';

export default {
  validations: {
    bank_details: {
      required,
      numeric,
    },
  },
  computed: {
    isBankDetailsError() {
      return (
        (this.$v.bank_details.$dirty && this.$v.bank_details.$invalid) ||
        !!this.getErrors.bank_details
      );
    },
    bankDetailsErrorText() {
      if (!this.$v.bank_details.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.bank_details.numeric) {
        return this.$t('form.bank_detail_error');
      }
      if (!!this.getErrors.bank_details) {
        return this.getErrors.bank_details[0];
      }
    },
  },
};
