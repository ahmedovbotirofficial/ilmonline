import { required, minLength, helpers } from 'vuelidate/lib/validators';

// const userMessage = helpers.regex(
//   'alpha',
//   /^([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+\s([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+$/
// );

export default {
  validations: {
    userMessage: {
      required,
      // minLength: minLength(2),
    },
  },
  computed: {
    isUserMessageError() {
      return this.$v.userMessage.$dirty && this.$v.userMessage.$invalid;
    },
    userMessageErrorText() {
      if (!this.$v.userMessage.required) {
        return this.$t('form.empty_error');
      }
      // if (!this.$v.userMessage.minLength) {
      //   return this.$t('form.name_two_symbols');
      // }
      // if (!this.$v.userMessage.userMessage) {
      //   return this.$t('form.error_full_name');
      // }
    },
  },
};
