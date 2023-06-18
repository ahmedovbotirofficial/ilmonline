<template>
  <div class="students_row">
    <div
      class="arrow_menu desktop"
      :class="{ active: activeMenu && isShowData }"
      @click.stop="openedMenu(student.id)"
    >
      <svg-icon name="arrow_down" />
    </div>
    <div class="students_row__content" @click="openedMenu(student.id)">
      <span
        v-if="student.not_checked_tasks_counter > 0"
        class="students_tasks_counter"
        >{{ student.not_checked_tasks_counter }}</span
      >
      <div class="content__value">
        <p
          class="content__value_link"
          :style="{ color: student.css_classnames }"
        >
          {{ student.course_title }}
        </p>
      </div>

      <div class="content__value dates">
        <span>
          {{ normalizeDate(student.created_at) }} -
          {{ normalizeDate(student.updated_at) }}
        </span>
        <div
          class="arrow_menu mobile"
          :class="{ active: activeMenu && isShowData }"
          @click.stop="openedMenu(student.id)"
        >
          <svg-icon name="arrow_down" />
        </div>
      </div>
      <div class="content__value student">
        <div>{{ student.student_full_name }}</div>
      </div>
      <div class="content__value big_circle_avg">
        <vue-ellipse-progress
          :progress="student.avg_test_grade"
          :color="getTestGradeColor"
          empty-color="#C4C4C4"
          :size="getWindowWidth <= 1024 ? 40 : 44"
          :thickness="3"
          :legend="true"
          :empty-thickness="1.3"
        />
      </div>
      <div class="content__value circle_avg">
        <vue-ellipse-progress
          :progress="student.grade"
          :color="getStudentGradeColor"
          empty-color="#C4C4C4"
          :size="getWindowWidth <= 1024 ? 40 : 44"
          :thickness="3"
          :legend="true"
          empty-thickness="1"
        />
      </div>
    </div>
    <div v-if="isShowData && isShowRow" class="dropdown">
      <div
        v-for="lesson in studentsProgressList"
        :key="lesson.id"
        class="dropdown_group"
      >
        <ProgressRow
          v-for="(item, idx) in lesson"
          :key="idx"
          class="dropdown_item"
          :class="{
            opened: activeMenu,
            'not-checked':
              item.type === 'task' && item.is_ready_for_teacher_viewing,
          }"
          :item="item"
          :user-id="student.user_id"
          :course-id="courseId"
          :course-progress-id="courseProgressId"
        />
      </div>
      <div v-if="isError">
        <p class="error__mes">
          {{ $t('tests.have_no_lessons') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import ProgressRow from '@/elements/StudentsTable/ProgressRow.vue';
import { mapGetters } from 'vuex';

export default {
  components: { ProgressRow },
  props: {
    student: {
      type: Object,
      default: () => {},
    },
    courseId: {
      type: Number,
      required: true,
    },
    courseProgressId: {
      type: Number,
      required: true,
    },
    isShowRow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      students: null,
      activeMenu: false,
      studentsProgressList: [],
      isError: false,
      isShowData: this.isShowRow,
    };
  },
  computed: {
    ...mapGetters([
      'getCoursesModeDispatch',
      'getSeparateLessonProgress',
      'getWindowWidth',
    ]),
    getTestGradeColor() {
      return this.student.avg_test_grade <= 40
        ? '#EC5239'
        : this.student.avg_test_grade <= 50
        ? '#F7CD46'
        : this.student.avg_test_grade <= 85
        ? '#F2994A'
        : '#59C676';
    },
    getStudentGradeColor() {
      return this.student.grade <= 40
        ? '#EC5239'
        : this.student.grade <= 50
        ? '#F7CD46'
        : this.student.grade <= 85
        ? '#F2994A'
        : '#59C676';
    },
  },
  watch: {
    isShowRow() {
      if (this.isShowData) {
        this.isShowData = this.isShowRow;
      }
    },
    isShowData() {
      if (this.isShowData) {
        this.$emit('putData', this.isShowData);
      }
    },
  },
  methods: {
    normalizeDate(date) {
      return moment(date, 'YYYY-MM-DD').format('DD.MM.YY');
    },

    openedMenu(id) {
      this.activeMenu = !this.activeMenu;
      this.fetchStudentsProgressList(id);
    },
    checkIfEmpty() {
      this.getSeparateLessonProgress.length === 0
        ? (this.isError = true)
        : (this.isError = false);
    },
    async fetchStudentsProgressList(id) {
      this.isShowData = this.activeMenu;
      await this.$store.dispatch(
        `getStudents${this.getCoursesModeDispatch}CourseProgressList`,
        id
      );
      this.studentsProgressList = [...this.getSeparateLessonProgress];
      if (this.getSeparateLessonProgress) {
        this.checkIfEmpty();
      }
      if (!this.activeMenu) {
        this.isError = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.students_row
  position: relative

.dropdown_item
  display: none

.dropdown_item.opened
  background-color: #F9F9F9
  display: grid
  grid-template-columns: 35% 20% 20% 8% 9%
  gap: 2%
  padding: 10px 40px
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)
  @include m
    grid-template-columns: 30% 21% 21% 10% 10%
  @media screen and (max-width: 680px)
    grid-template-columns: 27% 21% 24% 10% 10%
  @include xs
    padding: 6px 24px
  @include xxs
    grid-template-columns: 25% 30% 21% 10% 10%
    gap: 1%

.arrow_menu
  position: absolute
  top: 28px
  fill: none
  stroke: #12323E
  cursor: pointer
  @include xs
    top: 15px

.arrow_menu.desktop
  display: flex
  right: 2%
  @include xxs
    display: none

.arrow_menu.mobile
  display: none
  @include xxs
    display: flex
    right: 50px
  @include xxxs
    right: 30px

.arrow_menu.active svg
  transform: rotate(180deg)

.icon-arrow_down
  max-height: 15px
  max-width: 15px

.dropdown_item.not-checked
  background-color: #EDF3FF

.dropdown_item.opened:last-child
  border-bottom: 1px solid #85969C

.students_row__content
  display: grid
  grid-template-columns: 35% 20% 20% 8% 9%
  gap: 2%
  @include m
    grid-template-columns: 30% 21% 21% 10% 10%
  @media screen and (max-width: 680px)
    grid-template-columns: 27% 21% 24% 10% 10%
  @include xxs
    grid-template-columns: 25% 30% 21% 10% 10%
    gap: 1%

.content__value
  display: flex
  align-items: center

.content__value_link
  text-overflow: ellipsis
  white-space: nowrap
  overflow: hidden
  font-weight: bold
  padding-right: 20px

.content__value.student
  display: flex
  flex-direction: column
  align-items: flex-start
  justify-content: center
  gap: 4px

.content__value.circle_avg
  justify-content: center

.content__value.big_circle_avg
  position: relative
  justify-content: center

.students_row__content
  cursor: pointer
  padding: 12px 40px
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)
  position: relative
  @include xs
    padding: 6px 24px

.students_tasks_counter
  position: absolute
  left: 10px
  top: 50%
  transform: translateY(-50%)
  width: 20px
  height: 20px
  font-size: 12px
  color: var(--color-white)
  background-color: var(--color-orange)
  text-align: center
  display: flex
  justify-content: center
  align-items: center
  @include s
    left: 0

.content__value.title
  font-weight: bold
  font-size: 16px

.content__value.dates
  @include xs
    font-size: 13px
  @include xxs
    position: relative

.error__mes
  padding: 16px 40px
  background-color: #F9F9F9
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)
  @include xs
    padding-left: 24px
</style>
