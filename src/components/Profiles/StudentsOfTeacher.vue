<template>
  <div class="profile_main">
    <template v-if="!!students">
      <template v-if="students.length">
        <div class="profile_students">
          <div class="students_item_wrapper">
            <div class="students_item__header">
              <div v-for="title in header" :key="title" class="header__title">
                {{ $t(`table.${title}`) }}
              </div>
            </div>
            <StudentRow
              v-for="(student, index) in students"
              :key="index"
              :student="student"
              :is-show-row="isShowRow"
              :course-id="student.course_id"
              :course-progress-id="student.id"
              class="students_item"
              @putData="putData"
            />
          </div>
        </div>
        <div v-if="isShowPagination" class="students_item__paginate">
          <Paginate
            :page-count="pagesCount"
            :force-page="currentPage"
            :value="currentPage"
            :click-handler="pageChangeHandler"
            :prev-text="''"
            :next-text="''"
            :container-class="'pagination'"
            :page-class="'pagination_el'"
            :prev-class="'prev_arrow'"
            :next-class="'next_arrow'"
          />
        </div>
      </template>
      <div v-else class="profile_empty_students">
        <div class="profile_empty_students__title">
          У вас еще нет учеников, которые проходят Ваши уроки
        </div>
      </div>
    </template>
    <Loader v-else color="orange"></Loader>
  </div>
</template>

<script>
import StudentRow from '@/elements/StudentsTable/StudentRow.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: { StudentRow, Loader },
  data() {
    return {
      header: [
        'lessons',
        'dates',
        'student_name',
        'my_test_result',
        'my_progress',
      ],
      students: null,
      studentsPerPage: 1,
      pagesCount: 1,
      currentPage: 1,
      isShowRow: true,
    };
  },
  computed: {
    ...mapGetters(['getCoursesModeDispatch']),
    isShowPagination() {
      return this.pagesCount > 1;
    },
  },
  async created() {
    this.currentPage = this.$route.query.page ? +this.$route.query.page : 1;
    await this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      this.isLoader = true;
      const res = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}StudentsList`,
        {
          page: this.currentPage,
        }
      );
      this.students = [...res.data];
      this.studentsPerPage = res.per_page;
      this.pagesCount = res.last_page;
    },
    putData(value) {
      this.isShowRow = value;
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = +selectedPage;
      this.fetchStudents();
      this.isShowRow = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_main
  overflow: hidden
  @include xs
    margin-left: -16px
    margin-right: -16px

.profile_students
  overflow: auto

.students_item_wrapper
  background-color: var(--color-white)
  @media screen and (max-width: 680px)
    width: 125%
  @media screen and (max-width: 520px)
    width: 185%

.students_item
  position: relative

.students_item__header
  display: grid
  grid-template-columns: 35% 20% 20% 8% 9%
  gap: 2%
  padding: 15px 40px
  border-bottom: 2px solid var(--color-head-line)
  @include m
    grid-template-columns: 30% 21% 21% 10% 10%
  @include xs
    padding: 15px 24px
  @media screen and (max-width: 680px)
    grid-template-columns: 27% 21% 24% 10% 10%
  @include xxs
    grid-template-columns: 25% 30% 21% 10% 10%
    gap: 1%

.students_item__paginate
  display: flex
  justify-content: flex-end
  margin-top: 40px

.profile_empty_students
  display: flex
  align-items: center
  justify-content: center
  text-align: center
  padding: 40px 20px
  border: 1px solid var(--color-main)
  @include xs
    padding: 20px

.profile_empty_students__title
  color: var(--primary-font-color)
  font-weight: 600
  @include adaptive-font-size(24, 20, 16)
  @include adaptive-line-height(32, 26, 20)
</style>
