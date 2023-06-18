import emailValidation from '@/mixins/validation/fields/email';
import phoneValidation from '@/mixins/validation/fields/phone';
import bankValidation from '@/mixins/validation/fields/bank';
import amountValidation from '@/mixins/validation/fields/amount';
import fullNameValidation from '@/mixins/validation/fields/fullName';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [
    fullNameValidation,
    phoneValidation,
    emailValidation,
    bankValidation,
    amountValidation,
    validationsMethods,
  ],
  validations: {
    ...fullNameValidation.validations,
    ...phoneValidation.validations,
    ...bankValidation.validations,
    ...amountValidation.validations,
    ...emailValidation.validations,
  },
};
