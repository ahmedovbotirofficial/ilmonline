import { required, minLength, helpers } from 'vuelidate/lib/validators';

const fullName = helpers.regex(
  'alpha',
  /^([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+\s([A-Za-z-]|[аАбБвВгГдДеЕёЁіІїЇєЄжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ-])+$/
);

export default {
  validations: {
    fullName: {
      required,
      minLength: minLength(2),
      fullName,
    },
  },
  computed: {
    isFullNameError() {
      return this.$v.fullName.$dirty && this.$v.fullName.$invalid;
    },
    fullNameErrorText() {
      if (!this.$v.fullName.required) {
        return this.$t('form.empty_error');
      }
      if (!this.$v.fullName.minLength) {
        return this.$t('form.name_two_symbols');
      }
      if (!this.$v.fullName.fullName) {
        return this.$t('form.error_full_name');
      }
    },
  },
};
