<template>
  <div class="copy_block__input" :class="{ active: copied }">
    <!-- <div class="copy_block__notifiction" :class="{ active: copied }">
      <svg-icon name="icon_copy_arrow" />
      <span>
        {{ $t('titles.copied_link') }}
      </span>
    </div> -->
    <label for="copy_link"
      ><div class="referal__link">
        {{ link }}
      </div></label
    >
    <svg-icon name="icon_copy" @click.native="copyToClipBoard(link)" />
    <input id="copy_link" type="text" :value="link" readonly />
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      copied_link: false,
    };
  },
  computed: {
    copied() {
      return this.copied_link ? 'copied_link' : '';
    },
  },
  methods: {
    copyToClipBoard(link) {
      if (!this.copied_link) {
        navigator.clipboard.writeText(link);
        this.copied_link = true;
        this.$store.dispatch('setNotification', {
          type: 'success',
          text: `${this.$t('titles.copied_link')}`,
        });
        setTimeout(() => {
          this.copied_link = false;
        }, 5000);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.copy_block__input
  position: relative
  // bottom: 15px
  @include xxs
    max-width: 232px

.copy_block__input input
  display: none

.copy_block__input label
  position: relative
  border: 1px solid var(--color-border-bottom-stars)
  padding: 12px 16px
  display: flex
  @include m
    padding: 10px

.referal__link
  max-width: 325px
  width: 85%
  overflow-y: hidden
  white-space: nowrap
  text-overflow: ellipsis
  @include m
    max-width: 290px
    font-size: 14px

.referal__link::-webkit-scrollbar
  display: none

.copy_block__input svg:hover
  fill: var(--color-main)

.copy_block__input svg
  fill: var(--color-font-light-dark)
  cursor: pointer
  position: absolute
  right: 16px
  top: 50%
  transform: translateY(-50%)

.copy_block__input.active svg
  fill: var(--color-success)

.copy_block__text
  opacity: 0.6

.copy_block__notifiction
  position: absolute
  display: none
  align-items: center
  padding: 12px
  color: var(--color-white)
  background-color: var(--color-success)
  gap: 10px
  top: -68px
  right: -73px

.copy_block__notifiction.active
  display: flex

.copy_block__notifiction::after
  content: ''
  position: absolute
  top: 46px
  transform: translateX(-50%)
  left: 50%
  height: 20px
  width: 20px
  background-image: url(/images/arrow_link_copy_after.svg)

.copy_block__notifiction svg
  position: relative
  top: 12px
  left: 0
</style>
