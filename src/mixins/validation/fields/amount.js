import { required, numeric } from 'vuelidate/lib/validators';

export default {
  validations: {
    amount: {
      required,
      numeric,
    },
  },
  computed: {
    isAmountError() {
      return (
        (this.$v.amount.$dirty && this.$v.amount.$invalid) ||
        !!this.getErrors.amount
      );
    },
    amountErrorText() {
      if (!this.$v.amount.required) {
        return this.$t('form.empty_error');
      }
      if (!!this.getErrors.amount) {
        return this.getErrors.amount[0];
      }
    },
  },
};
