<template>
  <div class="modal__content">
    <svg-icon name="test_modal_finish" />
    <Heading level="4" class="test_finish__title">
      {{ $t('tests.are_you_sure') }}
    </Heading>
    <div class="test_finish__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent"
        size="popular"
        @click.native="closeAll"
        >{{ $t('buttons.cancel_btn') }}
      </ButtonBase>
      <ButtonBase
        class="modal__btn"
        color="orange"
        :disabled="isLoader"
        size="popular"
        @click.native="finishTest"
      >
        <template v-if="!isLoader">
          {{ $t('buttons.finish_btn') }}
        </template>
        <template v-else>
          <Loader color="white" size="small" />
        </template>
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';
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
      COURSES_MODES,
      isLoader: false,
    };
  },

  computed: {
    ...mapGetters([
      'getMyProgressOfCourse',
      'getLessonTest',
      'getCoursesMode',
      'getUserRole',
      'getCoursesModeDispatch',
      'getModalProps',
    ]),
  },

  methods: {
    async finishTest() {
      this.isLoader = true;
      await this.$store.dispatch(
        `getMy${this.getCoursesModeDispatch}CourseProgress`,
        this.$route.params.course_id
      );

      this.$store.commit(
        'SET_LESSON_TEST_PROGRESS',
        this.getMyProgressOfCourse.lessonProgress.find(
          (el) => el.lesson_id === this.getLessonTest.lesson_id
        ).testProgress
      );

      await this.getLessonTestRightResponses();
      if (this.getCoursesMode !== COURSES_MODES.PRO) {
        await this.endCouseTest();
      }
      this.$store.commit('SET_ENDED_LESSON_TEST', true);

      this.closeAll();
    },

    async endCouseTest() {
      await this.$store.dispatch('endCourseTest', this.getModalProps);
    },

    async getLessonTestRightResponses() {
      await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}LessonTestRightResponses`,
        {
          lesson_id: this.$route.params.lesson_id,
        }
      );
    },
    closeAll() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
      this.isLoader = false;
    },
  },
};
</script>

<style lang="sass">
.svg-icon.icon-test_modal_finish
  max-width: 56px
  max-height: 53px

.test_finish__title
  margin: 40px 0

.test_finish__btns
  display: flex
  justify-content: space-between
  align-items: center
  gap: 40px
  @include xs
    padding: 0 16px
    width: 100%
    flex-direction: column
    gap: 16px

  .button_wrapper.primary-btn--transparent
    border: 1px solid var(--color-head-title)

  .button_wrapper .primary-btn--popular:not(.primary-btn--transparent),
  .button_wrapper .primary-btn--transparent:hover
    background: var(--color-head-title)
</style>
