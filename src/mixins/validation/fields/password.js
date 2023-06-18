import { required, minLength, helpers } from 'vuelidate/lib/validators';

const isHasUppercaseLetter = helpers.regex('isHasUppercaseLetter', /[A-Z]+/);
const isLowercaseLetter = helpers.regex('isLowercaseLetter', /[a-z]+/);
const isHasNumber = helpers.regex('isHasNumber', /\d+/);

export default {
  validations: {
    password: {
      required,
      minLength: minLength(6),
      valid: function (value) {
        const containNotLatin = /[А-Яа-яіїєІЇЄ]/.test(value);
        return !containNotLatin;
      },
      isHasUppercaseLetter,
      isLowercaseLetter,
      isHasNumber,
    },
  },

  computed: {
    isPasswordError() {
      return (
        (this.$v.password.$dirty && this.$v.password.$invalid) ||
        !!this.getErrors.password ||
        !!this.getErrors.new_password
      );
    },
    passwordErrorText() {
      if (!this.$v.password.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.password.valid) {
        return this.$t('form.only_latin');
      }
      if (!this.$v.password.minLength) {
        return this.$t('form.min_length');
      }
      if (!this.$v.password.isLowercaseLetter) {
        return this.$t('form.password_lowercase');
      }
      if (!this.$v.password.isHasUppercaseLetter) {
        return this.$t('form.password_uppercase');
      }
      if (!this.$v.password.isHasNumber) {
        return this.$t('form.password_digit');
      }
      if (!!this.getErrors.password) {
        return this.getErrors.password[0];
      }
    },
  },
};
