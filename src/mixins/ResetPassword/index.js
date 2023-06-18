import { required, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  validations: {
    password: {
      required,
      valid: function (value) {
        const containsUppercase = /[A-Z]/.test(value);
        const containsLowercase = /[a-z]/.test(value);
        const containsNumber = /[0-9]/.test(value);
        return containsUppercase && containsLowercase && containsNumber;
      },
      minLength: minLength(6),
    },

    confirm_password: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },
  computed: {
    getEmptyErrorPassword() {
      return !!(this.$v.password.$dirty && !this.$v.password.required);
    },
    getInvalidPassword() {
      return !!(
        this.$v.password.$dirty &&
        this.$v.password.$invalid &&
        this.password
      );
    },
    getPasswordError() {
      return !!(this.$v.password.$dirty && !this.$v.password.valid);
    },
    getInvalidToken() {
      return this.serverErrors.token;
    },
    getConfrimPasswordError() {
      return !!(
        !this.$v.confirm_password.sameAsPassword && this.confirm_password
      );
    },
  },
};
