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

const cityName = helpers.regex(
  'alpha',
  /^([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+\s([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+$/
);
// const phone = helpers.regex('number', /^(?=.*[0-9])[- +()0-9]+$/);

export default {
  validations: {
    city: {
      required,
      cityName,
    },
    userProfileData: {
      full_name: {
        required,
      },
      email: {
        email,
        required,
      },
      phone_number: {
        required,
      },
    },
    passwordData: {
      old_password: {
        required,
      },
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
      password_confirmation: {
        required,
        sameAsPassword: sameAs('password'),
      },
    },
  },
  computed: {
    getEmptyFullName() {
      return !!(
        this.$v.userProfileData.full_name.$dirty &&
        !this.$v.userProfileData.full_name.required
      );
    },
    getEmptyErrorEmail() {
      return !!(
        this.$v.userProfileData.email.$dirty &&
        !this.$v.userProfileData.email.required
      );
    },
    isCityError() {
      return (
        (this.$v.city.$dirty && this.$v.city.$invalid) || !!this.getErrors.city
      );
    },
    getEmptyErrorCity() {
      return !!(this.$v.city.$dirty && !this.$v.city.required);
    },
    getInvalidCityError() {
      return !!(this.$v.city.$dirty && !this.$v.city.cityName);
    },
    getEmptyErrorPhoneNumber() {
      return !!(
        this.$v.userProfileData.phone_number.$dirty &&
        !this.$v.userProfileData.phone_number.required
      );
    },
    getInvalidEmail() {
      return !!(
        this.$v.userProfileData.email.$dirty &&
        !this.$v.userProfileData.email.email &&
        this.userProfileData.email
      );
    },
    notFoundEmail() {
      return this.serverErrors.emailError;
    },
    getInvalidPassword() {
      return !!(
        this.$v.passwordData.password.$dirty &&
        this.$v.passwordData.password.$invalid &&
        this.passwordData.password
      );
    },
    getEmptyOldPassword() {
      return !!(
        this.$v.passwordData.old_password.$dirty &&
        !this.$v.passwordData.old_password.required
      );
    },
    getEmptyPassword() {
      return !!(
        this.$v.passwordData.password.$dirty &&
        !this.$v.passwordData.password.required
      );
    },
    getEmptyConfirmPassword() {
      return !!(
        this.$v.passwordData.password_confirmation.$dirty &&
        !this.$v.passwordData.password_confirmation.required
      );
    },
    getConfrimPassError() {
      return !!(
        !this.$v.passwordData.password_confirmation.sameAsPassword &&
        this.passwordData.password_confirmation
      );
    },
  },
};
