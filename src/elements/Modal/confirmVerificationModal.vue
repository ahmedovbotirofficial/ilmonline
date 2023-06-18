<template>
  <div class="modal__content">
    <svg-icon name="mobile_confirm" />
    <Heading level="4" class="test_finish__title">{{
      $t('profilePage.confirm_phone_number')
    }}</Heading>
    <h4 class="confirm_text__mess">
      {{ $t('profilePage.confirm_phone_number__text') }}
    </h4>
    <TextField
      id="confirmation-number"
      v-model="confirmationNumber"
      :value="confirmationNumber"
      placeholder="_ _ _ _ _ _"
      class="confirm__text-field"
      value-mask="numbers"
      :error="isConfirmationNumberError"
      :error-txt="confirmationNumberErrorText"
      max-length="6"
      @focus="resetServerError('otp_number')"
    />
    <ButtonBase
      class="modal__btn"
      color="orange"
      size="popular"
      :disabled="confirmationNumber.length !== 6"
      @click.native="confirmMessage"
      >{{ $t('buttons.confirm') }}
    </ButtonBase>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import { mapGetters } from 'vuex';
import confirmPhoneNumberValidation from '@/mixins/validation/forms/confirmPhoneNumber';

export default {
  components: {
    ButtonBase,
    Heading,
    TextField,
  },

  mixins: [confirmPhoneNumberValidation],

  data() {
    return {
      confirmationNumber: '',
    };
  },

  computed: {
    ...mapGetters(['getPaymentData', 'getTransitionId']),
  },

  methods: {
    async confirmMessage() {
      if (this.isInvalidForm) {
        this.showValidationErrors();
        return;
      }

      let payload = { ...this.getPaymentData };
      payload.transaction_id = this.getTransitionId;
      payload.otp = this.confirmationNumber;
      await this.$store.dispatch('confirmVerificationNumber', payload);
    },

    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.svg-icon.icon-mobile_confirm
  max-width: 53px
  max-height: 53px

.modal__content
  padding: 0 90px
  @include s
    padding: 0 74px
  @include xs
    padding: 0 16px

  &::v-deep
    .text_field__input
      text-align: center

    .text_field__placeholder
      left: 47%

.test_finish__title
  font-size: 26px
  line-height: 32px
  margin-top: 34px
  margin-bottom: 16px
  @include xs
    font-size: 24px
    margin-top: 32px
    margin-bottom: 12px

.confirm_text__mess
  @include adaptive-font-size(20, 20, 16)
  @include adaptive-line-height(28, 28, 24)
  font-weight: 400
  text-align: center
  margin-bottom: 32px
  @include xs
    margin-bottom: 24px

.confirm__text-field
  max-width: 185px
  margin-bottom: 40px
  @include xs
    margin-bottom: 32px
</style>
