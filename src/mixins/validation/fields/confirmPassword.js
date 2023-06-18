import {
  required,
  minLength,
  sameAs,
  alphaNum,
  helpers,
} from 'vuelidate/lib/validators';

const isHasUppercaseLetter = helpers.regex('isHasUppercaseLetter', /[A-Z]+/);
const isHasNumber = helpers.regex('isHasNumber', /\d+/);

export default {
  validations: {
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password'),
      // minLength: minLength(6),
      // alphaNum,
    },
  },
  computed: {
    isConfirmPasswordError() {
      return (
        (this.$v.confirmPassword.$dirty && this.$v.confirmPassword.$invalid) ||
        !!this.getErrors.password_confirmation
        // ||        !!this.getErrors.new_password_confirmation
      );
    },

    confirmPasswordErrorText() {
      if (!this.$v.confirmPassword.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.confirmPassword.sameAsPassword) {
        return this.$t('form.confrim_password_error');
      }
      // if (!this.$v.confirmPassword.isHasUppercaseLetter) {
      //   return this.$t('form.password_uppercase');
      // }
      // if (!this.$v.confirmPassword.isHasNumber) {
      //   return this.$t('form.password_digit');
      // }
      if (!!this.getErrors.password_confirmation) {
        return this.getErrors.password_confirmation[0];
      }
      // if (!!this.getErrors.new_password_confirmation) {
      //   return this.getErrors.new_password_confirmation[0];
      // }
    },
  },
};
