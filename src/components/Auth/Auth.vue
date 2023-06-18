<template>
  <div class="auth_wrapper">
    <template v-if="getCoursesMode === COURSES_MODES.SCHOOL">
      <img
        src="@/assets/images/group_left_auth.svg"
        class="auth_form__left_icons"
      />
      <img
        src="@/assets/images/group_right_auth.svg"
        class="auth_form__right_icons"
      />
    </template>
    <template v-else>
      <img
        src="@/assets/images/auth_figure.svg"
        class="auth_form__figure_large"
      />
      <img
        src="@/assets/images/auth_flowers.svg"
        class="auth_form__flower_icons"
      />
    </template>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {},
  props: {},
  data() {
    return {
      COURSES_MODES,
    };
  },
  computed: {
    ...mapGetters(['getCoursesMode']),
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="sass">
.auth_wrapper
  background-color: var(--color-background)
  padding: 20px 0 150px 0
  position: relative
  z-index: 5
  @include s
    padding: 20px 0 70px 0
  @include xs
    padding: 0
    // margin: 20px 0 150px
  // height: 100vh

.auth_form__left_icons,
.auth_form__right_icons,
.auth_form__figure_large,
.auth_form__flower_icons
  position: absolute
  content: ''
  left: 0
  bottom: 200px
  z-index: unset

  @include s
    display: none

.auth_form__right_icons
  right: 0
  left: auto
  top: 25%

.auth_form__title
  margin-bottom: 64px

  @include xs
    margin-bottom: 40px

.auth_form__figure_large
  left: auto
  right: 0

.pro-courses .auth_form__figure_large
  bottom: 0

.auth_form__flower_icons
  top: 50%
  left: 48%
  transform: translate(-50%, -50%)

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
  font-weight: bold

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
</style>
