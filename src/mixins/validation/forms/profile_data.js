import emailValidation from '@/mixins/validation/fields/email';
import cityValidation from '@/mixins/validation/fields/city';
import phoneValidation from '@/mixins/validation/fields/phone';
import fullNameValidation from '@/mixins/validation/fields/fullName';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [
    fullNameValidation,
    cityValidation,
    phoneValidation,
    emailValidation,
    validationsMethods,
  ],
  validations: {
    ...fullNameValidation.validations,
    ...cityValidation.validations,
    ...phoneValidation.validations,
    ...emailValidation.validations,
  },
};
