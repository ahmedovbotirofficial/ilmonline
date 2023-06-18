<template>
  <div class="pay_successful__content">
    <div class="pay_successful__wrapper">
      <svg-icon name="failed" />
      <h2 class="pay_successful__title">{{ $t('main.payment_failed') }}</h2>
      <p>{{ $t('main.payment_error') }}</p>
    </div>
    <div class="directions__btns">
      <ButtonBase
        size="popular"
        type="submit"
        class="auth_form__sign_in_btn cansel_btn"
        @click.native="goToSmartSubscribe()"
        >{{ $t('buttons.to_main') }}
      </ButtonBase>
      <ButtonBase
        color="orange"
        size="popular"
        type="submit"
        class="auth_form__sign_in_btn"
        @click.native="openDateModal()"
      >
        {{ $t('buttons.try_again') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
export default {
  components: { ButtonBase },
  data() {
    return;
  },
  methods: {
    goToSmartSubscribe() {
      this.$router.push({ name: 'smart_subscribe' });
    },
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
  justify-content: space-between
  flex-direction: column

.pay_successful__wrapper
  text-align: center
  margin: 90px 60px

.pay_successful__title
  font-size: 32px
  line-height: 32px
  color: var(--color-main)
  padding-top: 35px
  padding-bottom: 24px

.go_to_lessons_btn
  width: 420px
  margin-top: 150px

.directions__btns
  display: flex
  justify-content: space-between
  // margin-bottom: 28px
  // button
  //   margin-bottom: 28px

.cansel_btn
  border: 1px solid var(--color-main)
  margin-bottom: 22px

.icon-failed
  max-width: 56px
  max-height: 56px
</style>
