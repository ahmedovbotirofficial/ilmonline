import emailValidation from '@/mixins/validation/fields/email';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [emailValidation, validationsMethods],
  validations: {
    ...emailValidation.validations,
  },
};
