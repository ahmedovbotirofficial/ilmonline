<template>
  <div class="error_wrapper">
    <div class="container">
      <div class="error_page">
        <svg-icon name="error_page" />
        <ButtonBase color="orange" size="popular" @click.native="goToMain">{{
          $t('buttons.to_main')
        }}</ButtonBase>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';

export default {
  components: {
    ButtonBase,
  },

  props: {},

  data() {
    return {};
  },

  computed: {},

  mounted() {},

  destroyed() {},
  async created() {},

  methods: {
    goToMain() {
      this.$router.push({ name: 'first-page' });
    },
  },
};
</script>

<style lang="sass" scoped>
.error_page
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  height: 80vh
  margin-bottom: 100px
  @include xxs
    height: 50vh

.error_page .button_wrapper
  padding-top: 40px

.icon-error_page
  max-width: 560px
  max-height: 440px
  height: 100%
  width: 100%
</style>
