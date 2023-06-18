<template>
  <div class="withdrawal">
    <div class="container">
      <div class="withdrawal__wrapper">
        <Heading level="2">
          {{ $t('titles.form_withdrawal') }}
        </Heading>
        <div class="withdrawal_form">
          <div class="techer_item info">
            <Heading level="4">
              {{ $t('titles.withdrawal_personal_data') }}
            </Heading>
            <div class="withdrawal_form__fields">
              <TextField
                id="fullName"
                v-model.trim="fullName"
                :value="fullName"
                :error="isFullNameError"
                :error-txt="fullNameErrorText"
                :placeholder="$t('form.short_full_name')"
                type="text"
                name="full_name"
              />
              <TextField
                id="login"
                v-model.trim="email"
                :value="email"
                :error="isEmailError"
                :error-txt="emailErrorText"
                :placeholder="'Email'"
                type="text"
                name="email"
                @input="dropError"
              />

              <TextField
                id="user-phone_number"
                v-model.trim="phone_number"
                :value="phone_number"
                :error="isPhoneError"
                :error-txt="phoneErrorText"
                :placeholder="'+988 (___) ___ - __ - __'"
                type="number"
                name="phone_number"
              />
            </div>
          </div>
          <div class="techer_item withdrawal_info">
            <Heading level="4">
              {{ $t('titles.withdrawal_request') }}
            </Heading>

            <div class="withdrawal_form__fields">
              <TextField
                id="bank_details"
                v-model.trim="bank_details"
                :value="bank_details"
                :error="isBankDetailsError"
                :error-txt="bankDetailsErrorText"
                :placeholder="$t('form.bank_details')"
                type="number"
                name="login"
              />
              <TextField
                id="amount"
                v-model.trim="amount"
                :value="amount"
                :error="isAmountError"
                :error-txt="amountErrorText"
                :placeholder="$t('form.amount')"
                type="number"
                name="login"
              />
            </div>
          </div>
        </div>

        <div class="withdrawal_btns">
          <ButtonBase
            color="transparent"
            size="popular"
            @click.native="clearForm"
            >{{ $t('buttons.clear_btn') }}</ButtonBase
          >
          <ButtonBase color="orange" size="popular" @click.native="sentOrder">{{
            $t('buttons.save_btn')
          }}</ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import withdrawal from '@/mixins/validation/forms/withdrawal.js';

export default {
  components: {
    Heading,
    TextField,
    ButtonBase,
  },
  mixins: [withdrawal],

  data() {
    return {
      fullName: '',
      email: '',
      phone_number: '',
      bank_details: '',
      amount: '',
    };
  },

  methods: {
    async sentOrder() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      let data = {};
      data.full_name = this.fullName;
      data.email = this.email;
      data.phone_number = this.phone_number;
      data.bank_details = this.bank_details;
      data.amount = this.amount;

      await this.$store.dispatch('createWithdrawalRequest', data);
      // this.$router.push({ name: 'payment' });
    },

    dropError() {
      this.$store.commit('RESET_ERRORS');
    },

    clearForm() {
      this.fullName = '';
      this.email = '';
      this.phone_number = '';
      this.bank_details = '';
      this.amount = '';

      this.$v.$reset();
    },
  },
};
</script>

<style lang="sass" scoped>
.withdrawal__wrapper
  display: flex
  flex-direction: column
  justify-content: space-between
  align-items: center
  padding: 60px 0 80px

.withdrawal_form
  margin-top: 56px
  gap: 24px
  display: flex
  flex-direction: column
  justify-content: space-between
  align-items: center
  width: 100%
  max-width: 625px
  margin-bottom: 48px

.techer_item
  padding: 32px
  background-color: var(--color-white)
  width: 100%

.withdrawal_form__fields
  display: flex
  flex-direction: column
  justify-content: space-between
  gap: 32px

.withdrawal_btns
  width: 100%
  max-width: 625px
  display: flex
  justify-content: space-between
  @include s
    height: 132px
    flex-wrap: wrap
</style>
