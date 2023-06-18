<template>
  <div class="modal__content">
    <svg-icon :name="`trial_modal_icon_${getCoursesMode}`" />
    <Heading level="4" class="modal__content_title">
      {{ getModalProps.title }}
    </Heading>

    <div class="direction_card__test_info">
      <div class="test_info__item">
        <svg-icon name="quiz_questions" />
        {{
          $t('tests.quiz_questions_count', {
            count_questions: getModalProps.count_questions,
          })
        }}
      </div>
      <div class="test_info__item">
        <svg-icon name="quiz_time" />
        {{
          $t('tests.quiz_avg_time', {
            quiz_avg_time: getModalProps.avg_test_time,
          })
        }}
      </div>
      <div class="test_info__item">
        <svg-icon name="quiz_questions" />
        {{
          $t('tests.student_count', {
            student_count: getModalProps.student_test_passed_counter,
          })
        }}
      </div>
    </div>

    <div class="quiz_modal__description">{{ getModalProps.description }}</div>
    <ButtonBase
      class="modal__btn"
      color="orange"
      size="popular"
      right-icon="card_arrow"
      @click.native="startTest"
      >{{ $t('buttons.start_test') }}
    </ButtonBase>
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
    ...mapGetters(['getModalProps', 'getCoursesMode']),
  },
  mounted() {},
  methods: {
    closeModal() {
      this.$store.commit('SET_MODAL', { state: false });
    },

    startTest() {
      if (this.getModalProps.status === 'in_progress') {
        this.openQuizContinueModal();
      } else {
        this.$store.commit('SET_QUIZ_STUDENT_RESPONSES', {
          studentResponses: null,
        });
        this.$router.push({
          name: 'quiz-passing',
          params: {
            direction: this.$route.params.direction,
            category_id: this.$route.params.category_id,
            quiz_id: this.getModalProps.id,
          },
        });
        this.closeModal();
      }
    },

    openQuizContinueModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: 'quiz-continue',
        props: this.getModalProps,
      });
    },
  },
};
</script>

<style lang="sass" scoped>
li
  position: relative
  margin-bottom: 12px
  margin-left: 16px
  line-height: 26px
  list-style: none
  @include xxs
    font-size: 14px

li::after
  position: absolute
  content: ''
  background-color: var(--color-main)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px var(--box-shadow-color)

.modal__content
  padding: 0 90px
  text-align: left
  @include xs
    padding: 0 24px
  @include xxs
    padding: 0 16px

.svg-icon.icon-trial_modal_icon_school,
.svg-icon.icon-trial_modal_icon_pro
  max-height: 54px
  max-width: 40px

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

.direction_card__test_info
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 24px
  max-width: 300px
  width: 100%

.test_info__item
  display: flex
  align-items: center
  gap: 6px
  font-size: 14px
  color: var(--color-font-light-dark)

.test_info__item svg
  max-width: 15px
  max-height: 15px
</style>
