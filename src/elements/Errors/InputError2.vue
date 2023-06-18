<template>
  <div class="error-message">
    <!-- <svg-icon v-if="isShowIcon" name="error-icon" class="error-icon"></svg-icon> -->
    <span>{{ errorTxt }}</span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    errorTxt: {
      type: String,
      default: '',
    },
    isShowIcon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="sass" scoped>
.error-message
  display: flex
  justify-content: flex-start
  align-items: center
  position: absolute
  bottom: -20px
  left: 0
  color: var(--color-orange)
  font-size: 12px

.icon-error-icon
  height: 14px
  width: 14px
  margin-right: 4px
</style>
