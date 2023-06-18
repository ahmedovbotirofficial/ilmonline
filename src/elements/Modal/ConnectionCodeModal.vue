<template>
  <div class="modal__content">
    <div class="modal_parent__title">
      {{ $t('main.copy_telegram_content') }}
    </div>

    <div class="modal_parent__copy_input">
      <CopyLinkInput :link="connetionLink" />
    </div>

    <div class="modal__btns">
      <ButtonBase color="orange" size="popular" @click.native="closeAll">
        {{ $t('buttons.close_btn') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import CopyLinkInput from '@/elements/Inputs/CopyLinkInput.vue';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';

export default {
  components: {
    ButtonBase,
    CopyLinkInput,
  },

  data() {
    return {
      isLoader: false,
    };
  },

  computed: {
    connetionLink() {
      return getFromLS('connection_token');
    },
  },

  methods: {
    async closeAll() {
      await this.$store.dispatch('getParentConnectionStatus');

      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.modal_parent__title
  font-size: 18px
  line-height: 28px
  max-width: 500px
  margin-bottom: 24px
  @include xxs
    font-size: 16px
    line-height: 24px

.modal_parent__copy_input
  display: flex
  justify-content: center
  margin-bottom: 40px
  width: 100%

// .modal_parent__copy_input .copy_block__input

.modal__btns
  display: flex
  gap: 40px
</style>
