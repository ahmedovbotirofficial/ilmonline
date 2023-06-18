<template>
  <div v-if="getModalProps" class="modal__content">
    <svg-icon name="purchase_course_card" />
    <Heading level="4" class="purchase_course__title">
      {{ $t('buttons.buy_course') }}
    </Heading>
    <div
      class="purchase_course__subtitle"
      v-html="
        $t('cards.write_off', {
          price: getModalProps.coursePrice,
        })
      "
    ></div>
    <div class="purchase_course__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent_blue"
        size="popular"
        @click.native="close"
        >{{ $t('buttons.cancel_btn') }}
      </ButtonBase>
      <ButtonBase
        class="modal__btn"
        color="blue"
        size="popular"
        @click.native="purchaseCourse"
      >
        <template v-if="!loadingBtn">
          {{ $t(`buttons.buy`) }}
        </template>
        <Loader v-else color="white" size="small" />
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { COURSES_MODES } from '@/types/constants';

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
    ...mapGetters([
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getModalProps',
    ]),
  },

  mounted() {},

  async created() {},

  methods: {
    async purchaseCourse() {
      this.loadingBtn = true;
      if (this.getModalProps.courseId) {
        await this.$store.dispatch(
          `purchase${this.getCoursesModeDispatch}Course`,
          this.getModalProps.courseId
        );

        if (this.getCoursesMode === COURSES_MODES.SCHOOL) {
          await this.$store.dispatch('getParentConnectionStatus');
        }
      }
      this.loadingBtn = false;
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
.svg-icon.icon-purchase_course_card
  max-width: 53px
  max-height: 27px

.purchase_course__title.title
  margin: 26px 0 16px 0

.purchase_course__subtitle
  font-size: 18px
  line-height: 28px
  color: var(--primary-font-color)
  @include xs
    font-size: 16px
    line-height: 24px

  .course_price
    color: var(--btn-color-blue-dark)
    font-weight: 600

.purchase_course__btns
  display: flex
  justify-content: space-between
  gap: 40px
  margin-top: 38px
  @include xs
    flex-direction: column
    gap: 16px
  @include xxs
    width: 100%
</style>
