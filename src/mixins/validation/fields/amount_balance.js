import { required, numeric, helpers } from 'vuelidate/lib/validators';

export default {
  validations: {
    amount: {
      required,
      numeric,
      mimimalAmount: function (value) {
        return value >= 500 ? true : false;
      },
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
      if (!this.$v.amount.mimimalAmount) {
        return this.$t('form.minimal_amount');
      }
      if (!!this.getErrors.amount) {
        return this.getErrors.amount[0];
      }
    },
  },
};
