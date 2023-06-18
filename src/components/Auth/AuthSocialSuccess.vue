<template>
  <div></div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.auth_form__inputs
  position: relative
  display: flex
  width: 100%
  margin-bottom: 48px
  flex-direction: column
  gap: 30px

.auth_form__forgot_pass
  align-self: flex-end
  cursor: pointer
  position: relative
  top: -40px
  font-size: 14px

  @include xxs
    font-size: 12px

.auth_form__forgot_pass:hover::after,
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
</style>
