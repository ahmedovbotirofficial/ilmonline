import {
  required,
  minLength,
  maxLength,
  email,
  between,
  numeric,
  alphaNum,
  helpers,
} from 'vuelidate/lib/validators';

import VueI18n from '@/i18n';

const fullName = helpers.regex(
  'alpha',
  /^([A-Za-z-]|[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+\s([A-Za-z-]|[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+$/
);
// const phone = helpers.regex('number', /^(?=.*[0-9])[- +()0-9]+$/);

export default {
  validations: {
    login: {
      value: {
        required,
        email,
      },
    },
    password: {
      value: {
        required,
        valid: function (value) {
          const containsUppercase = /[A-Z]/.test(value);
          const containsLowercase = /[a-z]/.test(value);
          const containsNumber = /[0-9]/.test(value);
          return containsUppercase && containsLowercase && containsNumber;
        },
        minLength: minLength(6),
      },
    },
    confirm_password: {
      value: {
        required,
      },
    },
    isSelectedRole: {
      value: {
        required,
      },
    },
    fullName: {
      value: {
        required,
        fullName,
      },
    },
  },
  computed: {
    getValidRole() {
      return !!(
        this.$v.isSelectedRole.value.$invalid &&
        this.$v.isSelectedRole.value.$dirty
      );
    },
    getEmptyErrorEmail() {
      return !!(this.$v.login.value.$dirty && !this.$v.login.value.required);
    },
    getEmptyFullName() {
      return !!(
        this.$v.fullName.value.$dirty && !this.$v.fullName.value.required
      );
    },

    getInvalidFullName() {
      return !!(
        this.$v.fullName.value.$dirty && !this.$v.fullName.value.fullName
      );
    },
    getInvalidEmail() {
      return !!(
        this.$v.login.value.$dirty &&
        !this.$v.login.value.email &&
        this.login.value
      );
    },
    getExistEmail() {
      return this.serverErrors.emailError;
    },
    getEmptyErrorPassword() {
      return !!(
        this.$v.password.value.$dirty && !this.$v.password.value.required
      );
    },
    getInvalidPassword() {
      return !!(
        this.$v.password.value.$dirty &&
        this.$v.password.value.$invalid &&
        this.password.value
      );
    },
    getPasswordError() {
      return !!(this.$v.password.value.$dirty && !this.$v.password.value.valid);
    },
    getConfrimPasswordError() {
      return !!(
        this.$v.confirm_password.value.$dirty &&
        this.password.value !== this.confirm_password.value
      );
    },
  },
};
