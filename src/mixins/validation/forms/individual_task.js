import studentCommentValidation from '@/mixins/validation/fields/studentComment';
import filesValidation from '@/mixins/validation/fields/files';
import validationsMethods from '@/mixins/validation/common/validationMethods';

export default {
  mixins: [studentCommentValidation, filesValidation, validationsMethods],
  validations: {
    ...studentCommentValidation.validations,
    ...filesValidation.validations,
  },
};
