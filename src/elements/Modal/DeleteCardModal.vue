<template>
  <div class="modal__content">
    <svg-icon name="card_delete_approve" />
    <Heading level="4" class="card_finish__title">
      {{ $t('buttons.delete_card') }}
    </Heading>
    <div class="delete_card__text">
      {{ $t('buttons.delete_card_warning') }}
    </div>
    <div class="card_finish__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent"
        size="popular"
        @click.native="closeAll"
        >{{ $t('buttons.keep_btn') }}
      </ButtonBase>
      <ButtonBase
        class="modal__btn"
        color="orange"
        size="popular"
        @click.native="deleteCard"
      >
        <template v-if="!loadingBtn">
          {{ $t('buttons.delete_btn') }}
        </template>
        <Loader v-else color="white" size="small" />
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    Heading,
    Loader,
  },

  data() {
    return {
      loadingBtn: false,
    };
  },

  computed: {
    ...mapGetters(['getModalProps']),
  },

  methods: {
    async deleteCard() {
      this.loadingBtn = true;
      await this.$store.dispatch('deleteCard', this.getModalProps.id);
      this.loadingBtn = false;
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
.svg-icon.icon-card_delete_approve
  max-width: 53px
  max-height: 53px
  @include xxs
    max-width: 44px
    max-height: 44px

.card_finish__title
  margin: 32px 0px 16px
  font-size: 24px
  line-height: 28px
  @include xxs
    margin: 32px 0px 12px

.delete_card__text
  margin-bottom: 40px
  @include adaptive-font-size(18, 18, 16)
  @include adaptive-line-height(28, 28, 24)
  @include xxs
    margin-bottom: 32px

.card_finish__btns
  display: flex
  justify-content: space-between
  gap: 40px
  @include xxs
    flex-direction: column
    gap: 16px
    width: 100%
</style>
