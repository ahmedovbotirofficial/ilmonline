import { required, minLength, numeric, not } from 'vuelidate/lib/validators';

export default {
  validations: {
    city: {
      required,
      minLength: minLength(2),
      valid: function (value) {
        const containsNumber = /[0-9]/.test(value);
        return !containsNumber;
      },
    },
  },
  computed: {
    isCityNameError() {
      return (
        this.$v.city.$dirty && this.$v.city.$invalid
        //  ||        !!this.getErrors.full_name
      );
    },
    cityNameErrorText() {
      if (!this.$v.city.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.city.minLength) {
        return this.$t('form.name_two_symbols');
      }
      if (!this.$v.city.valid) {
        return this.$t('form.error_city_name');
      }
    },
  },
};
