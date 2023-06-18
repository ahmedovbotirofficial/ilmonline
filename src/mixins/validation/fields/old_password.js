import { required, minLength, helpers } from 'vuelidate/lib/validators';

const isHasUppercaseLetter = helpers.regex('isHasUppercaseLetter', /[A-Z]+/);
const isHasNumber = helpers.regex('isHasNumber', /\d+/);

export default {
  validations: {
    oldPassword: {
      required,
      minLength: minLength(6),
      isHasUppercaseLetter,
      isHasNumber,
    },
  },
  computed: {
    isOldPasswordError() {
      return (
        (this.$v.oldPassword.$dirty && this.$v.oldPassword.$invalid) ||
        !!this.getErrors.old_password
      );
    },
    oldPasswordErrorText() {
      if (!this.$v.oldPassword.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.oldPassword.minLength) {
        return this.$t('form.min_length');
      }
      if (!this.$v.oldPassword.isHasUppercaseLetter) {
        return this.$t('form.password_uppercase');
      }
      if (!this.$v.oldPassword.isHasNumber) {
        return this.$t('form.password_digit');
      }
      if (!!this.getErrors.old_password) {
        return this.getErrors.old_password[0];
      }
    },
  },
};
