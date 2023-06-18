<template>
  <div class="button_wrapper" :class="wrapperClasses">
    <button
      type="button"
      class="primary-btn"
      :class="[cssClasses, statusConfig]"
      :ontouchstart="isCountBtn"
      :disabled="disabled"
      :icon-name="iconName"
    >
      <svg-icon v-if="iconName" :name="`icon_${iconName}`" />
      <slot />
      <svg-icon v-if="rightIcon" :name="`icon_${rightIcon}`" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    statusConfig: {
      type: String,
      default: '',
    },
    authBtn: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
      default: '',
    },
    rightIcon: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    nonBorder: {
      type: Boolean,
      default: false,
    },
    isCountBtn: {
      type: Boolean,
      default: false,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cssClasses() {
      return {
        'primary-btn--white': this.color === 'white',
        'primary-btn--blue': this.color === 'blue',
        'primary-btn--dark-blue': this.color === 'dark-blue',
        'primary-btn--light_blue': this.color === 'light_blue',
        'primary-btn--cyan': this.color === 'cyan',
        'primary-btn--vivid': this.color === 'vivid',
        'primary-btn--violet': this.color === 'violet',
        'primary-btn--orange': this.color === 'orange',
        'primary-btn--transparent': this.color === 'transparent',
        'primary-btn--transparent_blue': this.color === 'transparent_blue',
        'primary-btn--transparent-blue': this.color === 'transparent_blue',
        'blue-tel': this.color === 'telegram',

        'primary-btn--popular': this.size === 'popular',
        'primary-btn--max': this.size === 'max',
        'primary-btn--big': this.size === 'big',
        'primary-btn--low': this.size === 'low',
        'primary-btn--medium': this.size === 'm',
        'primary-btn--small': this.size === 'small',
        'vac-btn--adopt': this.size === 'vacancy',
        'primary-btn--teacher_material_size':
          this.size === 'teacher-materials-size',
        'primary-btn--auth': this.authBtn,
        'primary-btn--border': this.border,
        'primary-btn--non_border': this.nonBorder,

        'primary-btn--arrow_icon': this.rightIcon,
        reverse: this.reverse,
      };
    },

    wrapperClasses() {
      return {
        disabled: this.disabled,
        'primary-btn--transparent': this.color === 'transparent',
        small: this.size === 'small',

        popular: this.size === 'popular',
        max: this.size === 'max',
        big: this.size === 'big',
        low: this.size === 'low',
        medium: this.size === 'm',
        teacher_material_size: this.size === 'teacher-materials-size',
      };
    },
  },
};
</script>

<style lang="sass" scoped>
.pro-courses .first_page__sign_in_btn button
  background-color: #53BD6F

.video_info__top_inner .primary-btn--medium
  @media only screen and (max-width: 768px)
    width: 100%
.blue-tel
  background-color: var(--btn-color-light-blue)
  color: white
.button_wrapper
  background: var(--primary-font-color)
  height: 48px
  border-radius: 0
  @include xxs
    width: 100%
    height: 44px

.button_wrapper:hover .primary-btn
  transform: translate(4px, -4px)

.button_wrapper.disabled:hover .primary-btn
  transform: translate(0px, -0px)

.primary-btn
  cursor: pointer
  height: 48px
  font-weight: 600
  font-size: 16px
  text-align: center
  text-transform: uppercase
  display: flex
  align-items: center
  justify-content: center
  gap: 13px
  transition: var(--transition-speed)
  z-index: 1
  border-radius: 0

  @include xxs
    font-size: 14px
    line-height: 18px
    height: 44px

.primary-btn--arrow_icon
  position: relative

.primary-btn--cyan
  background: var(--btn-color-cyan-blue)
  color: var(--color-white)

.primary-btn--vivid
  background: var(--btn-color-vivid-cerise)
  color: var(--color-white)

.primary-btn--violet
  background: var(--color-violet-btn)
  color: var(--color-white)

.primary-btn--violet[disabled],
.primary-btn--violet[disabled]:hover
  opacity: 0.6
  cursor: default
  transition: none

.primary-btn--arrow_icon svg
  position: absolute
  right: 16px

.primary-btn--auth
  font-size: 18px
  text-transform: none

  @include xs
    font-size: 14px
    gap: 6px

.primary-btn--border
  border: 1px solid var(--primary-font-color)

.primary-btn--blue
  background: var(--btn-color-dark-blue)
  color: var(--color-white)

.primary-btn--dark-blue
  background: var(--btn-color-blue-dark)
  color: var(--color-white)

.primary-btn--transparent-blue
  background: transparent
  border: 1px solid var(--btn-color-dark-blue)

.primary-btn--light_blue
  background: var(--btn-color-light-blue)
  color: var(--color-white)

.primary-btn--small.primary-btn--cyan
  background: var(--btn-color-cyan-blue)
  color: var(--color-white)

.primary-btn--small.open_lesson
  background: var(--primary-font-color)
.button_wrapper .primary-btn.buy
  background: var(--btn-color-blue-dark)
.primary-btn--small.buy
  background: var(--btn-color-blue-dark)
.vac-btn--adopt
  width: 100%
  max-width: 100%
.primary-btn--orange
  background: var(--color-main)
  color: var(--color-white)
  position: relative

.video_info__top_inner .button_wrapper.medium
  @include xs
    width: 100%
    button
      @include s
      width: 215px
      @include xs
      width: 100%
.head_filtration__left .head_filtration__row:first-child button
  @include s
  height: 44px

.button_wrapper.primary-btn--transparent
  background: var(--color-white)
  color: var(--primary-font-color)
  border: 1px solid var(--color-main)
  @include xxs
    width: 100%

.button_wrapper:hover .primary-btn--transparent
  transform: translate(0, 0)
  background: var(--color-main)
  color: var(--color-white)

  &::v-deep
    .loader svg g rect
      fill: var(--color-white)

.button_wrapper:hover.disabled .primary-btn--transparent,
.button_wrapper.primary-btn--transparent.disabled
  transform: translate(0, 0)
  background: var(--color-white)
  color: var(--primary-font-color)
  border: 1px solid var(--color-main)
  opacity: 0.5

.individual_task__download_btn .primary-btn--transparent
  color: var(--color-main)

.primary-btn--transparent_blue
  background: var(--color-white)
  color: var(--primary-font-color)
  border: 1px solid var(--primary-font-color)

// .primary-btn--orange:hover:before
//   display: block
//   transform: translate(8px, -8px)

.primary-btn--orange[disabled]
  cursor: default
  background: var(--color-main-light)

.button_wrapper.max,
.primary-btn--max
  width: 100%

.button_wrapper.big,
.primary-btn--big
  min-width: 340px
  @include xxs
    width: 100%

.button_wrapper.popular
  width: 100%
  max-width: 230px
  @include xxs
    max-width: 100%
    // max-width: 100%

.vacany__control_btns .button_wrapper.popular
  width: 100%
  max-width: 100%

.primary-btn--popular
  width: 230px
  -webkit-appearance: none
  -moz-appearance: none
  appearance: none
  @include xxs
    width: 100%
    min-width: 100%
    display: flex
    flex-wrap: wrap

.reverse
  display: flex
  flex-direction: row-reverse

.edit_btn
  .primary-btn--popular
    width: 100%

.button_wrapper.medium,
.primary-btn--medium
  width: 180px
  @include xs
    width: 100%

.primary-btn--low
  width: 130px

.button_wrapper.small,
.primary-btn--small
  width: 48px
  @include s
    height: 43px
  @media screen and (max-width: 640px)
    width: 100%
    max-width: 48px

.primary-btn--non_border
  border: none !important
  color: var(--primary-font-color)

.primary-btn--blue:hover
  // background-color: var(--btn-color-blue-hover)

.primary-btn--blue:active
  // background-color: var(--btn-color-blue-dark)

.primary-btn--blue[disabled]
  // background-color: var(--primary-color-dark-grey-1)
  cursor: default

.primary-btn--white
  background: var(--color-white)

.primary-btn--white:hover
  // border: 1px solid var(--btn-color-blue)

.primary-btn--white:active
  border: 1px solid rgba(48, 83, 240, 0.8)

.primary-btn.blue-tel.vac-btn--adopt
  text-transform: inherit
  font-size: 18px
  font-weight: 600
  line-height: 23px

.directions__btns
  @include s
    button
      margin-bottom: 28px
.primary-btn--white[disabled]
  opacity: 0.5
  cursor: default
.button_wrapper.teacher_material_size,
.primary-btn--teacher_material_size
  width: 250px
  // border: 1px solid var(--primary-color-dark-grey-1)
  // color: var(--primary-color-dark-grey-1)
</style>
