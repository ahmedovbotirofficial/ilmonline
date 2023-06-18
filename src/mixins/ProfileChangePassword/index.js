import {
  required,
  minLength,
  maxLength,
  email,
  between,
  numeric,
  alphaNum,
  helpers,
  sameAs,
} from 'vuelidate/lib/validators';

import VueI18n from '@/i18n';

// const fullName = helpers.regex(
//   'alpha',
//   /^([A-Za-z-]|[а-щА-ЩЬьЮюЯяЇїІіЄєҐґёЁ-])+\s([A-Za-z-]|[а-щА-ЩЬьЮюЯяЇїІіЄєҐґёЁ-])+\s([A-Za-z-]|[а-щА-ЩЬьЮюЯяЇїІіЄєҐґёЁ-])+$/
// );
// const phone = helpers.regex('number', /^(?=.*[0-9])[- +()0-9]+$/);

export default {
  validations: {
    old_password: {
      required,
    },
    password: {
      required,
    },
    password_confirmation: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },
  computed: {
    getEmptyOldPassword() {
      return !!(this.$v.old_password.$dirty && !this.$v.old_password.required);
    },
    getEmptyPassword() {
      return !!(this.$v.password.$dirty && !this.$v.password.required);
    },
    getEmptyConfirmPassword() {
      return !!(
        this.$v.password_confirmation.$dirty &&
        !this.$v.password_confirmation.required
      );
    },
  },
};
