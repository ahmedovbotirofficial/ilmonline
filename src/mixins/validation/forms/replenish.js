import amountValidation from '@/mixins/validation/fields/amount_balance';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [amountValidation, validationsMethods],
  validations: {
    ...amountValidation.validations,
  },
};
