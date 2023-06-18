<template>
  <form
    class="auth_form"
    :class="{ modal: $route.name === 'quiz-results' }"
    @keyup.prevent.enter="singUp"
  >
    <Heading level="3" class="auth_form__title">
      {{ $t('titles.registration') }}
    </Heading>

    <div class="auth_form__handler" :class="isValidRole ? 'invalid' : ''">
      <div
        class="auth_handler"
        :class="{ active: isSelectedRole.value === 'student' }"
        @click="chooseProfile('student')"
      >
        <svg-icon name="icon_student" />
        <span>
          {{ $t('form.student') }}
        </span>
      </div>
      <div
        class="auth_handler"
        :class="{ active: isSelectedRole.value === 'teacher' }"
        @click="chooseProfile('teacher')"
      >
        <svg-icon name="icon_teacher" />
        <span> {{ $t('form.teacher') }}</span>
      </div>
      <div v-if="isValidRole" class="auth_handler__error_message">
        {{ $t('form.choose_role') }}
      </div>
    </div>

    <div class="auth_form__btns btns">
      <ButtonBase
        v-for="{ id, text, color, size, border, iconName } in registerBtns"
        :key="id"
        :color="color"
        :class="{
          facebook_btn: id === 'facebook',
        }"
        :size="size"
        :border="border"
        auth-btn
        :icon-name="iconName"
        @click.native="goToRegisterSocial(id)"
        >{{ text }}</ButtonBase
      >
      <div class="telegram_btn">
        <vue-telegram-login
          mode="redirect"
          :telegram-login="getTelegramBotUsername"
          radius="0"
          :userpic="false"
          :size="getTelegramBtnSize"
          :redirect-url="getTelegramRedirectUrl"
        />
      </div>
    </div>

    <div class="auth_form__else">
      {{ $t('titles.or') }}
    </div>

    <div class="auth_form__inputs">
      <div
        class="registration_password_tooltip"
        @mouseover="isTooltipHover = true"
        @mouseleave="isTooltipHover = false"
      >
        <svg-icon v-if="isTooltipHover" name="tooltip_icon_hover" />
        <svg-icon v-else name="tooltip_icon" />
      </div>

      <RegistrationTooltip v-if="isTooltipHover" />

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
        :error="isConfirmPasswordError"
        :error-txt="confirmPasswordErrorText"
        is-password
        :type="'password'"
        name="confirm_password"
        autocomplete="off"
      />
    </div>

    <ButtonBase
      color="orange"
      size="max"
      type="submit"
      class="auth_form__sign_in_btn"
      @click.native="singUp"
    >
      <span v-if="!isLoader">{{ $t('form.register') }}</span>
      <span v-else> <Loader color="white" size="small" /> </span
    ></ButtonBase>

    <div class="auth__policy">
      {{ $t('form.policy_info') }}
      <span @click="goToPolicy">
        {{ $t('form.policy_info_url') }}
      </span>
    </div>
  </form>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import RegistrationTooltip from '@/components/Auth/RegistrationTooltip.vue';
import Loader from '@/elements/Loader/Loader.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import { vueTelegramLogin } from 'vue-telegram-login';
// import validate from '@/mixins/validationMixin.js';
import { setToLS, getFromLS } from '../../library/helpers';
import signUpValidation from '@/mixins/validation/forms/signup.js';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    Heading,
    ButtonBase,
    TextField,
    RegistrationTooltip,
    Loader,
    vueTelegramLogin,
  },

  mixins: [signUpValidation],
  //
  data() {
    return {
      isSelectedRole: {
        value: 'student',
      },

      fullName: '',

      email: '',
      password: '',
      confirmPassword: '',

      referer: {
        value: '',
      },

      isLoader: false,

      registerBtns: [
        {
          id: 'google',
          color: 'white',
          size: 'max',
          text: 'Google',
          iconName: 'google',
          border: true,
        },
        {
          id: 'facebook',
          color: 'blue',
          size: 'max',
          text: 'Facebook',
          iconName: 'facebook',
        },
        {
          id: 'instagrambasic',
          color: 'vivid',
          size: 'max',
          text: 'Instagram',
          iconName: 'instagram',
        },
      ],
      isTooltipHover: false,
    };
  },
  computed: {
    ...mapGetters(['getErrors', 'getCoursesMode']),
    getTelegramRedirectUrl() {
      return process.env.VUE_APP_TELEGRAM_REDIRECT_URI;
    },
    getTelegramBotUsername() {
      return this.getCoursesMode === COURSES_MODES.PRO
        ? process.env.VUE_APP_TELEGRAM_BOT_USERNAME_PRO
        : process.env.VUE_APP_TELEGRAM_BOT_USERNAME;
    },
    getTelegramBtnSize() {
      return window.innerWidth >= 768 ? 'large' : 'medium';
    },
  },

  watch: {},
  mounted() {
    this.dropError();

    if (this.$route.query.referer) {
      this.referer.value = this.$route.query.referer;
      setToLS('referer', this.referer.value);
    } else {
      let referer = getFromLS('referer');
      if (referer) {
        this.referer.value = referer;
      }
    }
  },

  methods: {
    dropError() {
      this.$store.commit('RESET_ERRORS');
      this.resetServerError('email');
    },
    chooseProfile(who) {
      this.isSelectedRole.value = who;
    },

    goToPolicy() {
      this.$router.push({ name: 'policy' });
    },

    async goToRegisterSocial(id) {
      if (this.$v.isSelectedRole.value.$invalid) {
        this.$v.$touch();
        return;
      }

      const url = process.env.VUE_APP_API_HOST + '/auth/social/sign-in';
      window.open(`${url}/${id}?role=${this.isSelectedRole.value}`, '_self');
    },

    async singUp() {
      // console.log('before invalid', this.$v.$invalid);
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      let data = {
        full_name: this.fullName,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
        role: this.isSelectedRole.value,
      };

      if (this.referer.value.length > 0) {
        data['referer'] = this.referer.value;
      }

      this.isLoader = true;
      let isActiveExistEmail = await this.$store.dispatch('getExistEmail', {
        email: this.email,
      });
      await this.$store.dispatch('registration', data);

      if (
        Object.keys(this.getErrors).length === 0 ||
        (!isActiveExistEmail.is_active && isActiveExistEmail.exists)
      ) {
        this.$store.commit('SET_MODAL', {
          state: true,
          name: `verification`,
          props: {
            email: this.email,
            isResentPassword:
              !isActiveExistEmail.is_active && isActiveExistEmail.exists,
          },
        });
      }
      this.isLoader = false;
    },
  },
};
</script>

<style lang="sass">
.auth_form
  display: flex
  flex-direction: column
  justify-content: space-between
  align-items: center
  padding: 80px 115px
  max-width: 720px
  background: var(--color-white)
  margin: 0 auto
  z-index: 5
  position: relative

  @include s
    padding: 80px 100px

  @include xs
    padding: 60px 16px
    border-bottom: 1px solid var(--primary-font-color)

.auth_form.modal
  padding: 0 16px
  margin: 0
  box-shadow: none

.auth_form__inputs
  position: relative
  display: flex
  width: 100%
  margin-bottom: 4px
  flex-direction: column
  gap: 30px

.auth_form__forgot_pass
  align-self: flex-end
  cursor: pointer
  position: relative
  font-size: 14px
  margin-bottom: 26px

  @include xxs
    font-size: 12px

.auth_form__forgot_pass:hover
  color: var(--color-main)

.auth_from__join_us_btn:hover::after
  position: absolute
  content: ''
  bottom: 0
  left: 0
  height: 1px
  width: 100%
  background-color: var(--primary-font-color)

.auth_form__join_us
  font-size: 16px
  line-height: 20px
  opacity: 0.72

  @include xxs
    font-size: 14px
    line-height: 18px

.auth_from__join_us_btn
  cursor: pointer
  position: relative
  color: var(--color-main)

.auth_from__join_us_btn:hover::after
  background-color: var(--color-main)

.telegram_btn
  width: 100%
  height: 48px
  display: flex
  align-items: center
  justify-content: center
  background-color: #54a9eb

  @include xxs
    height: 44px
    grid-row: 2/3

.telegram_btn div
  display: flex
  align-items: center

.facebook_btn
  @include xxs
    grid-row: 3/4

.auth_form__title
  margin-bottom: 64px

  @include xs
    margin-bottom: 40px

.auth_form__btns
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 20px
  width: 100%
  margin-bottom: 40px

  @include xs
    margin-bottom: 32px

  @include xxs
    grid-template-columns: 1fr
    gap: 16px

#telegram-login-ilm_education_platform_bot
  width: 100%

.auth_form__else
  position: relative
  font-size: 12px
  margin-bottom: 40px

  @include xs
    margin-bottom: 32px

.auth_form__else::after, .auth_form__else::before
  content: ''
  position: absolute
  top: 60%
  left: 35px
  width: 140px
  height: 1px
  background-color: rgba(18, 50, 62, 0.2)

  @include xxxs
    width: 100px

.auth_form__else::before
  right: 35px
  left: auto

.auth_form__inputs
  width: 100%
  margin-bottom: 48px

.auth_form__sign_in_btn
  margin-bottom: 16px

.auth_form__inputs
  position: relative
  display: flex
  width: 100%
  margin-bottom: 48px
  flex-direction: column
  gap: 30px

  @include xs
    margin-bottom: 40px

.auth_form__handler
  display: grid
  grid-template-columns: 1fr 1fr
  width: 100%
  margin-bottom: 68px
  position: relative

  @include xs
    margin-bottom: 40px

.auth_form__handler.invalid
  outline: 2px solid var(--color-orange)
  color: var(--color-orange)
  font-size: 14px

.telegram_btn
  width: 100%
  height: 48px
  display: flex
  align-items: center
  justify-content: center
  background-color: #54a9eb

  @include xxs
    height: 44px
    grid-row: 2/3

.telegram_btn div
  display: flex
  align-items: center

.facebook_btn
  @include xxs
    grid-row: 3/4

.auth_handler__error_message
  position: absolute
  font-size: 14px
  bottom: -20px
  left: 0
  color: var(--color-orange)

.auth_handler
  display: flex
  align-items: center
  justify-content: center
  font-size: 18px
  font-weight: bold
  cursor: pointer
  height: 48px
  gap: 10px
  border-bottom: 1px solid rgba(18, 50, 62, 0.2)

  @include xs
    font-size: 16px

.auth_handler.active
  height: 48px
  margin-bottom: -2px
  border-bottom: 2px solid var(--color-orange)

.pro-courses .auth_handler.active
  border-bottom: 2px solid #53BD6F

.auth__policy
  opacity: 0.8
  max-width: 340px
  font-size: 14px
  line-height: 20px
  text-align: center

  @include xxs
    font-size: 12px
    line-height: 15px

.auth__policy span
  position: relative
  cursor: pointer

.auth__policy span::after
  position: absolute
  content: ''
  height: 1px
  width: 100%
  left: 0
  bottom: 2px
  background-color: var(--primary-font-color)

.registration_password_tooltip
  cursor: pointer
  position: absolute
  right: -25px
  top: 62%
  height: 15px
  width: 15px
  @include xs
    right: 0px
    top: 48%

.registration_password_tooltip svg
  max-height: 15px
  max-width: 15px
</style>
