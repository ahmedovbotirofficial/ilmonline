<template>
  <form
    class="auth_form"
    :class="{ modal: $route.name === 'quiz-results' }"
    @submit.prevent
  >
    <Heading level="3" class="auth_form__title">{{
      $t('titles.auth')
    }}</Heading>

    <div class="auth_form__btns btns">
      <ButtonBase
        v-for="button in authBtns"
        :key="button.text"
        :color="button.color"
        :class="{
          facebook_btn: button.id === 'facebook',
        }"
        :size="button.size"
        :border="button.border"
        :icon-name="button.iconName"
        auth-btn
        @click.native="goToSignInSocial(button.id)"
        >{{ button.text }}</ButtonBase
      >
      <div class="telegram_btn">
        <vue-telegram-login
          mode="redirect"
          :telegram-login="getTelegramBotUsername"
          radius="0"
          maxlength="9"
          :size="getTelegramBtnSize"
          :redirect-url="getTelegramRedirectUrl"
        />
      </div>
    </div>

    <div class="auth_form__else">
      {{ $t('titles.or') }}
    </div>

    <div class="auth_form__inputs">
      <div></div>
      <v-text-field filled prefix="+998"  maxlength="9" v-model.trim="phone"></v-text-field>
      <v-text-field
        filled
        :label="$t('form.password_placeholder')"
        id="password"
        v-model.trim="password"
        :error="isPasswordError"
        :error-txt="passwordErrorText"
        is-password
        :type="'password'"
        name="password"
      ></v-text-field>
    </div>
    <div class="auth_form__forgot_pass" @click="openDateModal()">
      {{ $t('buttons.forgot_password') }}
    </div>

    <ButtonBase
      color="orange"
      size="max"
      class="auth_form__sign_in_btn"
      :disabled="isLoader"
      @click.native="logIn"
      :class="isDisabled"
    >
      <span v-if="!isLoader">
        {{ $t('buttons.login') }}
      </span>
      <span v-else>
        <Loader color="white" size="small" />
      </span>
    </ButtonBase>

    <div class="auth_form__join_us">
      {{ $t('form.in_first') }}
      <span class="auth_from__join_us_btn" @click="goToSignUp">
        {{ $t('form.register') }}
      </span>
    </div>
  </form>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import TextField from '@/elements/Inputs/TextField.vue';
// import ModalAuth from './ModalAuth.vue';
import { vueTelegramLogin } from 'vue-telegram-login';
import authValidation from '@/mixins/validation/forms/auth.js';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    // ModalAuth,
    Heading,
    ButtonBase,
    Loader,
    TextField,
    vueTelegramLogin,
  },

  mixins: [authValidation],

  data() {
    return {
      phone: '',
      password: '',
      confirmation_code: null,

      isLoader: false,

      authBtns: [
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
    };
  },
  computed: {
    ...mapGetters(['getUniqueUserID', 'getCoursesMode']),
    getTelegramRedirectUrl() {
      return process.env.VUE_APP_TELEGRAM_REDIRECT_URI;
    },
    getTelegramBotUsername() {
      console.log(this.getCoursesMode + ' getTelegramBotUsername');
      console.log(
        process.env.VUE_APP_TELEGRAM_BOT_USERNAME_PRO +
          '  ' +
          process.env.VUE_APP_TELEGRAM_BOT_USERNAME
      );
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
    // if (!!this.$route.query.confirmation_code) {
    //   this.confirmation_code = this.$route.query.confirmation_code;
    // }
    // if (!!this.$route.query.email) {
    //   this.email = this.$route.query.email;
    // }
  },
  methods: {
    dropError() {
      this.$store.commit('RESET_ERRORS');
      this.resetServerError('email');
    },
    async goToSignInSocial(id) {
      const url = process.env.VUE_APP_API_HOST + '/auth/social/sign-in';
      window.open(`${url}/${id}`, '_self');
    },
    goToSignUp() {
      if (this.$route.name !== 'quiz-results') {
        this.$router.push({ name: 'registration' });
      } else {
        this.$store.commit('SET_MODAL', {
          state: true,
          name: `registration`,
        });
      }
    },

   async logIn(){
    console.log('sign in')

    // this.isLoader = true;
    const data = new FormData()

    data.append('email', String(this.phone))
    data.append('password', this.password)
      
      
      let res = await this.$store.dispatch('authorization', data);


      if (res.status === 200) {
        console.log('everything ok')
      }
   },
    
    async signIn() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (!!this.confirmation_code) {
        const verifyData = {
          email: this.email,
          confirmation_code: this.confirmation_code,
        };
        await this.$store.dispatch('singUpVerify', verifyData);
        // if (this.serverErrors.confirmation_code) return;
        // this.confirmation_code = null;
      }

      const data = {
        phone: this.phone,
        password: this.password,
      };

      // this.isLoader = true;
      let res = await this.$store.dispatch('authorization', data);
      let isActiveExistEmail = await this.$store.dispatch('getExistEmail', {
        email: this.email,
      });
      if (!isActiveExistEmail.is_active && isActiveExistEmail.exists) {
        this.$store.commit('SET_MODAL', {
          state: true,
          name: `verification`,
          props: { email: this.email, isResentPassword: true },
        });
      }
      if (res.status === 200) {
        if (this.$route.name !== 'quiz-results') {
          this.$router.push({ name: 'first-page' });
        } else {
          await this.fetchCertificate();
        }
        this.$store.commit('SET_MODAL', { state: false });
      }
      // this.isLoader = false;
    },

    async fetchCertificate() {
      this.isLoader = true;
      let result = await this.$store.dispatch('getQuizCertificate', {
        quiz_passing_id: this.$route.params.quiz_passing_id,
        unique_token: this.getUniqueUserID,
      });
      this.isLoader = false;
      const blob = new Blob([result.data], { type: 'application/pdf' });

      let url = URL.createObjectURL(blob);
      window.open(`${url}`, '_blank');
    },
    openDateModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `forgot-password`,
        props: !!this.email && this.email,
      });
    },
  },

  computed: {
    isDisabled() {
      if (
        this.phone.length == 9 && this.password.length > 4
      ) 
        return '';
       else 
      return 'disable';
    },
  },
};
</script>

<style lang="sass" scoped>
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
  color: var(--color-head-title)

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
  color: var(--color-head-title)

.auth_from__join_us_btn:hover::after
  background-color: var(--color-head-title)

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
  margin-bottom: 18px

.auth_form__sign_in_btn
  margin-bottom: 16px
</style>

<style>
.disable {
  opacity: 0.6 !important;
  pointer-events: none;
}
</style>