<template>
  <div class="modal__content">
    <svg-icon name="leave_page" />

    <Heading level="4" class="modal__content_title">
      {{ $t('tests.leave_test') }}
    </Heading>
    <div class="quiz_modal__description">
      {{ $t('tests.delete_changes') }}
    </div>

    <div class="modal__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent"
        :size="getWindowWidth < 640 ? 'max' : 'popular'"
        @click.native="closeModal"
        >{{ $t('buttons.cancel_btn') }}
      </ButtonBase>

      <ButtonBase
        class="modal__btn"
        color="orange"
        :size="getWindowWidth < 640 ? 'max' : 'popular'"
        @click.native="leavePage"
        >{{ $t('buttons.finish_btn') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    Heading,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'getModalProps',
      'getWindowWidth',
      'isAuthUser',
      'getUniqueUserID',
      'getCoursesModeDispatch',
      'getLessonTest',
    ]),
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit('SET_LEAVE_PAGE_STATUS', false);
  },

  methods: {
    closeModal() {
      this.$store.commit('SET_MODAL', { state: false });
    },
    leavePage() {
      if (this.$route.name === 'trial-test-variant') {
        this.$store.dispatch('deleteTrialTestVariant', {
          try_id: this.$route.params.try_id,
          token: this.isAuthUser ? null : this.getUniqueUserID,
        });
      }
      if (this.$route.name === 'course-test') {
        this.$store.dispatch(`delete${this.getCoursesModeDispatch}LessonTest`, {
          test_id: this.getLessonTest.id,
        });
      }
      this.$store.commit('SET_LEAVE_PAGE_STATUS', true);
      this.$router.push({ name: this.getModalProps.name });

      this.closeModal();
    },
  },
};
</script>

<style lang="sass" scoped>
.modal__content
  padding: 0 90px
  text-align: left
  @include xs
    padding: 0 24px
  @include xxs
    padding: 0 16px

.svg-icon.icon-trial_modal_icon
  max-height: 54px
  max-width: 40px

.modal__content_title
  text-align: center

.quiz_modal__description
  display: flex
  flex-direction: column
  gap: 20px
  font-size: 18px
  line-height: 24px
  margin-bottom: 40px
  @include xxs
    font-size: 14px
    line-height: 20px
    gap: 0px

.tiral_modal__results
  font-size: 18px
  font-weight: bold
  align-self: flex-start
  margin-bottom: 40px
  @include xxs
    font-size: 14px

.modal__btns
  display: flex
  gap: 40px
  width: 100%
  @include xs
    flex-wrap: wrap
    padding: 0 40px
    gap: 16px
  @include xxs
    padding: 0
</style>
