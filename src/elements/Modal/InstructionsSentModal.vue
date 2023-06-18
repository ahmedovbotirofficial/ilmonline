<template>
  <div class="modal__content">
    <svg-icon name="check_box" />
    <h2 class="modal__content_title">
      {{ $t('titles.instruction_send') }}
    </h2>
    <h4 class="modal__content_text">
      {{ $t('titles.check_email') }}
    </h4>
    <ButtonBase
      class="modal__btn"
      color="orange"
      size="popular"
      @click.native="sentEmailToResetPassword"
      >{{ $t('buttons.send_again_btn') }}
    </ButtonBase>
    <div class="modal__warn">
      <svg-icon name="warn" />
      <p class="modal__warn_title">
        {{ $t('titles.check_spam') }}
      </p>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
  },

  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getModalProps']),
  },

  methods: {
    async sentEmailToResetPassword() {
      this.isLoader = true;
      let data = new FormData();
      data.append('email', this.getModalProps);

      await this.$store.dispatch('resentResetPassword', data);
      this.isLoader = false;
      this.closeAll();
    },

    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>
<style lang="sass" scoped>
.svg-icon.icon-check_box
  max-height: 54px
  max-width: 64px

.svg-icon.icon-warn
  width: 16px
  fill: var(--color-font-light-dark)

.modal__btn
  margin-bottom: 32px

.modal__warn
  display: flex
  @include xs
    margin-top: 16px

.modal__warn_title
  font-size: 14px
  line-height: 24px
  color: var(--color-font-light-dark)
  padding-left: 8px
</style>
