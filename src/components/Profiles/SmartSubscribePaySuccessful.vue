<template>
  <div class="pay_successful__content">
    <div class="pay_successful__wrapper">
      <svg-icon name="successful" />
      <h2 class="pay_successful__title">{{ $t('main.payment_successful') }}</h2>
      <p>{{ $t('main.have_joined_our') }}</p>
    </div>
    <ButtonBase
      color="orange"
      size="popular"
      type="submit"
      class="auth_form__sign_in_btn go_to_lessons_btn"
    >
      {{ $t(`buttons.${getCoursesModeDispatch}`) }}
    </ButtonBase>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
export default {
  components: { ButtonBase },
  computed: {
    ...mapGetters(['getCoursesModeDispatch']),
  },
};
</script>

<style lang="sass" scoped>
.pay_successful__content
  padding: 40px
  height: 580px
  margin: 16px 0 100px 0
  background-color: white
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column

.pay_successful__wrapper
  text-align: center
  max-width: 520px
  width: 825px

.pay_successful__title
  font-size: 32px
  line-height: 32px
  color: var(--color-success)
  padding-top: 35px
  padding-bottom: 24px

.go_to_lessons_btn
  width: 420px
  margin-top: 150px

.icon-successful
  max-width: 56px
  max-height: 56px
</style>
