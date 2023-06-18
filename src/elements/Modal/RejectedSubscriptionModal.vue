<template>
  <div class="modal__content_rej modal__content">
    <svg-icon name="alert" />
    <Heading level="4" class="purchase_course__title">
      {{ $t('titles.payment_wrong') }}
    </Heading>
    <div class="purchase_course__subtitle">
      {{ getModalProps.serverError }}
    </div>
    <div class="purchase_course__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent"
        size="popular"
        @click.native="close"
      >
        <template v-if="!loadingBtn">
          {{ $t('buttons.cancel_btn') }}
        </template>
        <Loader v-else color="orange" size="small" />
      </ButtonBase>
      <ButtonBase
        class="modal__btn"
        color="orange"
        size="popular"
        @click.native="goToPaymentData"
        >{{ $t('buttons.payment_data') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';

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

  mounted() {},

  methods: {
    goToPaymentData() {
      this.close();
      this.$store.commit('selectProfileLink', 'payment');
      this.$router.push({ name: 'payment' });
    },
    close() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.modal__content_rej
  max-width: 80%

.svg-icon.icon-alert
  max-width: 53px
  max-height: 53px

.purchase_course__title.title
  margin: 26px 0 16px 0

.purchase_course__subtitle
  font-size: 18px
  line-height: 28px
  color: var(--primary-font-color)

.purchase_course__btns
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  gap: 40px
  margin-top: 38px
  @include xs
    max-width: 100%
    flex-wrap: wrap
    justify-content: center
</style>
