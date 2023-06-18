<template>
  <div
    :class="{
      'has-task-status':
        item.type === 'task' &&
        (item.is_ready_for_teacher_viewing || item.is_read_by_teacher),
    }"
  >
    <div class="content__value">
      <!-- :style="{ color: item.css_classnames }" -->
      <router-link
        v-if="item.type === 'video'"
        class="content__value_link"
        :to="{
          name: 'teacher-lesson-detail',
          params: {
            course_id: courseId,
            lesson_id: item.lesson_id,
            student_id: userId,
            course_progress_id: courseProgressId,
          },
        }"
        >{{ item.title }}
      </router-link>
      <!-- :style="{ color: item.css_classnames }" -->
      <router-link
        v-if="item.type === 'test'"
        class="content__value_link"
        :to="{
          name: 'teacher-test-detail',
          params: {
            student_id: userId,
            test_id: item.test_id,
            course_id: courseId,
            lesson_progress_id: item.id,
          },
        }"
        >{{ item.title }}
      </router-link>
      <router-link
        v-if="item.type === 'task'"
        class="content__value_link"
        :to="{
          name: 'teacher-individual-task-by-student',
          params: {
            course_id: courseId,
            student_id: userId,
            lesson_id: item.lesson_id,
            task_progress_id: item.id,
          },
        }"
      >
        {{ item.title }}
      </router-link>
    </div>
    <div class="content__value">
      {{ normalizeDate(item.created_at) }} -
      {{ normalizeDate(item.updated_at) }}
    </div>
    <div
      class="content__value student"
      :title="$t(`table.material_type.${item.type}`)"
    >
      {{ $t(`table.material_type.${item.type}`) }}
    </div>
    <div v-if="item.type === 'test'" class="content__value circle_avg">
      <vue-ellipse-progress
        :progress="item.test_grade"
        :color="getTestGradeColor"
        empty-color="#C4C4C4"
        :size="32"
        :thickness="2"
        :legend="true"
        empty-thickness="1"
      />
    </div>
    <div v-if="item.type === 'video'" class="circle_avg video_progress">
      <vue-ellipse-progress
        :progress="percentageValue"
        :color="getVideoGradeColor"
        empty-color="#C4C4C4"
        :size="32"
        :thickness="2"
        :legend="true"
        empty-thickness="1"
      />
    </div>
    <div
      v-if="
        item.type === 'task' &&
        (item.is_ready_for_teacher_viewing || item.is_read_by_teacher)
      "
      class="content__value task_status"
    >
      <div v-if="item.is_read_by_teacher" class="task_check done">
        <svg-icon name="icon_checked" />
        <span>{{ $t('individual_task.checked') }}</span>
      </div>
      <button
        v-else-if="item.is_ready_for_teacher_viewing"
        class="task_check btn"
        @click="goToCheckTask(item)"
      >
        {{ $t('buttons.check_task') }}
      </button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    courseId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    courseProgressId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['getUserRole']),

    getTestGradeColor() {
      return this.item.test_grade <= 40
        ? '#EC5239'
        : this.item.test_grade <= 50
        ? '#F7CD46'
        : this.item.test_grade <= 85
        ? '#F2994A'
        : '#59C676';
    },
    percentageValue() {
      return this.item.percent_viewed_video > 100
        ? 100
        : this.item.percent_viewed_video;
    },
    getVideoGradeColor() {
      return this.item.percent_viewed_video <= 40
        ? '#EC5239'
        : this.item.percent_viewed_video <= 50
        ? '#F7CD46'
        : this.item.percent_viewed_video <= 85
        ? '#F2994A'
        : '#59C676';
    },
  },
  methods: {
    normalizeDate(date) {
      return moment(date, 'YYYY-MM-DD').format('DD.MM.YY');
    },
    goToCheckTask(item) {
      this.$router.push({
        name: 'teacher-individual-task-by-student',
        params: {
          course_id: this.courseId,
          student_id: this.userId,
          lesson_id: item.lesson_id,
          task_progress_id: item.id,
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.content__value
  display: flex
  align-items: center

.video_progress
  display: grid
  justify-content: center

.video_progress.circle_avg
  grid-column: 5/6
  font-size: 10px

.content__value_link
  text-overflow: ellipsis
  white-space: nowrap
  overflow: hidden
  font-weight: bold
  color: #000
  padding-right: 20px

.content__value.student
  display: flex
  flex-direction: column
  align-items: flex-start
  justify-content: center
  gap: 4px

.has-task-status
  .content__value.student
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
    width: 100px
    display: inline-block
    line-height: 38px
    @include m
      width: 90px

.content__value.student .student_pricing
  font-size: 12px
  color: var(--color-font-light-dark)
  font-weight: normal

.content__value.circle_avg
  justify-content: center
  font-size: 10px

.task_status
  grid-column: 4/6
  justify-content: flex-end

.task_check
  font-weight: 600
  font-size: 13px
  line-height: 16px
  text-align: center
  text-transform: uppercase

.task_check.btn
  padding: 8px 30px
  border: 1px solid var(--btn-color-blue-dark)
  transition: var(--transition-speed)
  &:hover
    background-color: var(--btn-color-blue-dark)
    color: var(--color-white)

.task_check.done
  display: flex
  align-items: center
  gap: 4px
  padding: 5px 22px
  border: 1px solid var(--color-success)
</style>
