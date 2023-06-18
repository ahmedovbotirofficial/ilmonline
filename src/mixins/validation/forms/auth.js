import emailValidation from '@/mixins/validation/fields/email';
import passwordValidation from '@/mixins/validation/fields/password';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [emailValidation, passwordValidation, validationsMethods],
  validations: {
    ...emailValidation.validations,
    ...passwordValidation.validations,
  },
};
