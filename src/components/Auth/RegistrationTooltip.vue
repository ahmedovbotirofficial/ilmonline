<template>
  <div class="registration_password_tooltip__content">
    <div class="triangle">
      <svg-icon name="tooltip_icon_triangle" />
    </div>
    <div class="registration_password_tooltip__description">
      {{ $t('tooltips.description_registration') }}
    </div>
    <div class="registration_password_tooltip__list">
      <span>
        {{ $t('tooltips.password_include') }}
      </span>
      <ul>
        <li>
          {{ $t('tooltips.only_latin') }}
        </li>
        <li>
          {{ $t('tooltips.min_one_num') }}
        </li>
        <li>
          {{ $t('tooltips.different_letters') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
li
  list-style: none
.registration_password_tooltip__content
  position: absolute
  top: 75%
  right: -40px
  background: var(--color-white)
  padding: 20px
  z-index: 2
  border: 1px solid var(--color-font-light-dark)
  font-size: 16px
  line-height: 24px
  max-width: 390px
  @include xs
    right: -15px
    top: 65%

.registration_password_tooltip__content .triangle
  position: absolute
  top: -18px
  right: 10px

.registration_password_tooltip__description
  margin-bottom: 12px

.registration_password_tooltip__content li::after
  background-color: #12323E
</style>
