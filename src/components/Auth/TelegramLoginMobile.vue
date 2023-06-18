<template>
  <div class="telegram_mobile_container">
    <div class="telegram_mobile_button_wrapper">
      <h2 class="auth_form__title">{{ $t('titles.auth') }}</h2>

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

      <div class="telegram__else">
        <div class="auth_form__else">
          {{ $t('titles.or') }}
        </div>
      </div>

      <div class="auth_form__join_us">
        {{ $t('form.in_first') }}
        <span class="auth_from__join_us_btn" @click="goToSignUp">
          {{ $t('form.register') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { vueTelegramLogin } from 'vue-telegram-login';
import { COURSES_MODES } from '@/types/constants';
import { mapGetters } from 'vuex';

export default {
  components: {
    vueTelegramLogin,
  },
  computed: {
    ...mapGetters(['getCoursesMode']),
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

  methods: {
    goToSignUp() {
      this.$router.push({ name: 'registration' });
    },
  },
};
</script>

<style lang="sass" scoped>
.telegram_mobile_container
  display: flex
  align-items: center
  justify-content: center
  height: 76vh
  margin: 100px 0
  @include xs
    height: 80vh
    // margin-bottom: 150px

.telegram_mobile_button_wrapper
  background: #fff
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  max-width: 720px
  width: 100%
  padding: 80px 0
  @include xs
    padding: 60px 0

.auth_form__title
  @include adaptive-font-size(44, 44, 24)
  @include adaptive-line-height(56, 56, 30)

.telegram_btn
  max-width: 288px
  @include xs
    max-width: 288px

.telegram__else
  padding-top: 40px
  // padding-bottom: 30px
</style>
