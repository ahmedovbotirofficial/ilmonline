<template>
  <!-- eslint-disable vue/no-v-html -->

  <form class="auth_form" @submit.prevent>
    <Heading level="3" class="reset_form__title">{{
      $t('form.reset_title')
    }}</Heading>
    <div
      v-if="!errorReset"
      class="reset_info"
      v-html="$t('form.reset_info')"
    ></div>
    <div v-else class="reset_info" v-html="$t('form.error_reset_info')"></div>

    <div v-if="!errorReset" class="auth_form__inputs">
      <TextField
        id="password"
        v-model.trim="password"
        :value="password"
        :error="isPasswordError"
        :error-txt="passwordErrorText"
        tooltip-pass
        :placeholder="$t('form.password_placeholder')"
        is-password
        :type="'password'"
        name="password"
        autocomplete="off"
      />
      <TextField
        id="confirm_password"
        v-model.trim="confirmPassword"
        :placeholder="$t('form.reapet_password_placeholder')"
        :value="confirmPassword"
        :error="isConfirmPasswordError"
        :error-txt="confirmPasswordErrorText"
        is-password
        :type="'password'"
        name="confirm_password"
        autocomplete="off"
      />
    </div>

    <ButtonBase
      v-if="!errorReset"
      color="orange"
      size="max"
      type="submit"
      class="auth_form__sign_in_btn"
      @click.native="reserPasswrod"
    >
      <span v-if="!isLoader">{{ $t('form.create') }}</span>
      <Loader v-else color="white" size="small"
    /></ButtonBase>
    <ButtonBase
      v-else
      color="orange"
      size="max"
      type="submit"
      class="auth_form__sign_in_btn"
      @click.native="$router.push({ name: 'sign' })"
    >
      {{ $t('form.back_to_main') }}
    </ButtonBase>
  </form>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import resetPassword from '@/mixins/validation/forms/reset_password.js';

export default {
  components: {
    Heading,
    ButtonBase,
    TextField,
    Loader,
  },
  mixins: [resetPassword],

  data() {
    return {
      userToken: null,
      errorReset: false,

      password: '',
      confirmPassword: '',

      serverErrors: {
        token: false,
        password: false,
        password_confirmation: false,
      },

      isLoader: false,
    };
  },

  mounted() {
    // console.log(this.$route);
    if (this.$route.params.token) {
      this.userToken = this.$route.params.token;
      history.replaceState(null, null, 'token');
    }
  },

  methods: {
    async reserPasswrod() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      let formData = new FormData();
      // formData.append('old_password', this.password);
      formData.append('token', this.userToken);
      formData.append('password', this.password);
      formData.append('password_confirmation', this.confirmPassword);

      this.isLoader = true;
      this.serverErrors = await this.$store.dispatch(
        'confirmResetPassword',
        formData
      );
      if (!this.serverErrors.token) {
        this.$router.push({ name: 'sign' });
      } else {
        this.isLoader = false;
        this.errorReset = true;
        return;
      }
      // console.log(this.serverErrors);
    },
  },
};
</script>

<style lang="sass">
.auth_form__sign_in_btn
  background: none

.auth_form
  z-index: 10

.auth_form__inputs
  position: relative
  display: flex
  width: 100%
  margin-bottom: 48px
  flex-direction: column
  gap: 30px

.reset_form__title,
.reset_info
  margin-bottom: 32px
  line-height: 22px
</style>
