<template>
  <div v-if="getNotification" :class="cssClasses" class="notification">
    <div class="notification__info">
      <svg-icon
        v-if="getNotification.type !== 'error'"
        :name="getNotification.type"
      ></svg-icon>
      <div class="notification__text">{{ getNotification.text }}</div>
    </div>
    <button class="notification__close" @click="close">
      <svg-icon name="cross"></svg-icon>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getNotification']),
    cssClasses() {
      return {
        'notification--success': this.getNotification.type === 'success',
        'notification--warning': this.getNotification.type === 'warning',
        'notification--error': this.getNotification.type === 'error',
      };
    },
  },
  methods: {
    close() {
      this.$store.commit('CLEAR_NOTIFICATION');
    },
  },
};
</script>

<style lang="sass" scoped>
.notification
  position: fixed
  left: 50%
  transform: translateX(-50%)
  top: 100px
  display: flex
  padding: 20px
  min-width: 440px
  background-color: #F0FFF4
  border: 1px solid var(--color-success)
  z-index: 999
  @include xs
    top: 71px
    padding: 15px
    min-width: 375px
  @include xxs
    min-width: 330px
  @include xxxs
    min-width: 275px
    font-size: 14px
    padding: 10px

.notification.notification--error
  background-color: #FFDFD5
  border-color: var(--color-orange)

.notification__text
  margin-left: 11px
  font-size: 16px
  color: #12323E
  max-width: 85%
  @include xxxs
    min-width: 205px
    font-size: 14px
    margin-left: 4px

.notification__close
  position: absolute
  top: 20px
  right: 18px
  cursor: pointer
  @include xs
    top: 15px
    right: 18px
  @include xxxs
    right: 8px
    top: 10px

.notification__info
  display: flex
  align-items: center
  width: 100%

.icon-success
  fill: var(--color-success)
  max-width: 15px
  max-height: 13px

.icon-warning
  max-width: 15px
  max-height: 16px

.icon-cross
  max-width: 12px
  max-height: 12px
  fill: #12323E
  opacity: 0.5
  @include xxxs
    max-width: 8px
    max-height: 8px
</style>
