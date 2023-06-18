<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="modal__content">
    <svg-icon name="send_letter" />
    <h2 class="modal__content_title">
      {{ $t('titles.verification') }}
    </h2>
    <div
      v-if="getModalProps.isResentPassword"
      class="modal__content_text"
      v-html="$t('titles.send_email_again')"
    ></div>
    <div
      v-else
      class="modal__content_text"
      v-html="$t('titles.send_email')"
    ></div>
    <ButtonBase
      class="modal__btn"
      color="orange"
      size="popular"
      @click.native="sendVerificationLetterAgain"
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
import { mapGetters } from 'vuex';
import ButtonBase from '../Buttons/ButtonBase.vue';

export default {
  components: {
    ButtonBase,
  },

  data() {
    return {
      registerBtns: [
        {
          id: 'google',
          color: 'white',
          size: 'max',
          text: 'Google',
          iconName: 'google',
          border: true,
        },
      ],
    };
  },

  computed: {
    ...mapGetters(['getModalProps']),
  },
  async created() {
    if (this.getModalProps.isResentPassword) {
      let data = new FormData();
      data.append('email', this.getModalProps.email);

      await this.$store.dispatch('resentResetPassword', data);
    }
  },

  methods: {
    async sendVerificationLetterAgain() {
      let data = new FormData();
      data.append('email', this.getModalProps.email);

      await this.$store.dispatch('resentResetPassword', data);

      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.svg-icon.icon-send_letter
  max-width: 74px
  max-height: 53px

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
