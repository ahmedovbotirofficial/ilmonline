<template>
  <!-- <div class="icon_container"> -->
  <svg :class="className" xmlns="http://www.w3.org/2000/svg">
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'SvgIcon',

  props: {
    name: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: null,
    },
  },

  computed: {
    iconPath() {
      let icon = require(`@/assets/icons/${this.name}.svg`);

      if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
        icon = icon.default;
      }

      return icon.url;
    },

    className() {
      return 'svg-icon icon-' + this.name;
    },
  },
};
</script>

<style lang="sass">
.icon_container
  display: flex
  gap: 15px
  align-items: center

.svg-icon
  max-height: 24px
  max-width: 24px

.icon-icon_eye,
.icon-icon_eye_closed
  max-width: 18px
  max-height: 18px

.icon-icon_google,
.icon-icon_twitter,
.icon-icon_facebook
  @include xs
    max-width: 16px
    max-height: 16px
</style>
