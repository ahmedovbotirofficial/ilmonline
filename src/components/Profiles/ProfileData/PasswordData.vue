<template>
  <div class="profile__fields__wrapper">
    <Heading level="4">{{ $t('titles.change_password') }}</Heading>
    <div class="profile__fields profile__passwords_inputs">
      <TextField
        id="old_password"
        v-model.trim="oldPassword"
        :value="oldPassword"
        :error="isOldPasswordError"
        :error-txt="oldPasswordErrorText"
        :placeholder="$t('form.current_password')"
        type="password"
        name="old_password"
        is-password
        @focus="dropError"
      />
      <TextField
        id="password"
        v-model.trim="password"
        :value="password"
        :error="isPasswordError"
        :error-txt="passwordErrorText"
        :placeholder="$t('form.new_password')"
        type="password"
        name="password"
        is-password
      />
      <TextField
        id="password_confirmation"
        v-model.trim="confirmPassword"
        :value="confirmPassword"
        :error="isConfirmPasswordError"
        :error-txt="confirmPasswordErrorText"
        :placeholder="$t('form.reapet_password')"
        type="password"
        name="password_confirmation"
        is-password
        class="profile__password_confirmation"
      />
    </div>
    <div class="profile__pass_update_btn">
      <ButtonBase
        color="orange"
        :size="getWindowWidth < 450 ? 'max' : 'popular'"
        @click.native="changePasswrod"
        >{{ $t('buttons.change_btn') }}</ButtonBase
      >
    </div>
  </div>
</template>

<script>
import passwordValidation from '@/mixins/validation/forms/profile_password.js';
import { mapGetters } from 'vuex';

export default {
  mixins: [passwordValidation],

  data() {
    return {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    };
  },

  computed: {
    ...mapGetters(['getUserProfileData', 'getWindowWidth']),
  },

  methods: {
    async changePasswrod() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      let formData = new FormData();
      formData.append('old_password', this.oldPassword);
      formData.append('password', this.password);
      formData.append('password_confirmation', this.confirmPassword);

      let res = await this.$store.dispatch('changePasswrod', formData);
      if (res.status === 200) {
        this.oldPassword = '';
        this.password = '';
        this.confirmPassword = '';
      }
    },
    dropError() {
      this.resetServerError('old_password');
    },
  },
};
</script>
<style lang="sass" scoped>
.profile__fields__wrapper
  display: flex
  flex-direction: column

.profile__fields
  display: grid
  grid-template-columns: 1fr 1fr
  row-gap: 30px
  column-gap: 40px
  width: 100%

  @include s
    column-gap: 24px

.profile__passwords_inputs
  margin-bottom: 40px
  grid-auto-flow: column
  @include xxs
    margin-bottom: 24px
    grid-auto-flow: initial

.profile__passwords_inputs
  @include xxs
    grid-template-columns: 1fr

.profile__password_confirmation
  grid-row: 2/3
  @include xxs
    grid-row: 3/4

.profile__pass_update_btn
  display: flex
  justify-content: flex-end
</style>
