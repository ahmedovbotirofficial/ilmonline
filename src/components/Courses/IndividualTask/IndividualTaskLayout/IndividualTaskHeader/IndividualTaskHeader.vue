<template>
  <div class="individual_task__header">
    <div class="container">
      <div class="individual_task__header_inner">
        <div class="individual_task__header_text">
          <Heading level="3" class="individual_task__title">{{
            task.title
          }}</Heading>
          <div class="individual_task__subtitle">
            1. {{ $t('individual_task.course_presentation') }}
          </div>
        </div>
        <div
          v-if="
            getUserRole === 'student' &&
            (!task.is_required_individual_task ||
              (task.is_required_individual_task &&
                taskProgress.is_read_by_teacher &&
                taskProgress.grade >= 70))
          "
          class="individual_task__header_btn"
        >
          <ButtonBase
            color="orange"
            :size="getWindowWidth < 640 ? 'max' : 'popular'"
            @click.native="goToNextLesson"
          >
            <span>
              {{ $t('buttons.go_to_next_lesson') }}
            </span>
          </ButtonBase>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    taskProgress: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(['getUserRole', 'getWindowWidth']),
  },
  methods: {
    goToNextLesson() {
      this.$router.push({
        name: `${this.getUserRole}-video`,
        params: {
          course_id: this.$route.params.course_id,
          lesson_id: +this.$route.params.lesson_id + 1,
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__header
  background-color: var(--color-white)
  padding: 26px 0 40px 0
  @include s
    padding: 24px 0 40px 0
  @include xxs
    padding: 16px 0 32px 0

.individual_task__header_inner
  display: flex
  justify-content: space-between
  @media screen and (max-width: 640px)
    flex-direction: column-reverse

.individual_task__title
  @include adaptive-font-size(44, 36, 24)
  @include adaptive-line-height(56, 45, 28)

.individual_task__subtitle
  @include adaptive-font-size(36, 32, 20)
  @include adaptive-line-height(45, 40, 25)
  font-weight: 600
  color: var(--color-success)
  margin-top: 8px

.individual_task__header_btn
  @media screen and (max-width: 640px)
  margin-bottom: 24px

.individual_task__header_btn::v-deep
  .primary-btn
    background-color: var(--btn-color-blue-dark)
</style>
