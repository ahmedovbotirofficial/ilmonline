import { required, minLength, helpers } from 'vuelidate/lib/validators';

// const userName = helpers.regex(
//   'alpha',
//   /^([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+\s([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+$/
// );

export default {
  validations: {
    userName: {
      required,
      // minLength: minLength(2),
    },
  },
  computed: {
    isUserNameError() {
      return this.$v.userName.$dirty && this.$v.userName.$invalid;
    },
    userNameErrorText() {
      if (!this.$v.userName.required) {
        return this.$t('form.empty_error');
      }
      // if (!this.$v.userName.minLength) {
      //   return this.$t('form.name_two_symbols');
      // }
      // if (!this.$v.userName.userName) {
      //   return this.$t('form.error_full_name');
      // }
    },
  },
};
