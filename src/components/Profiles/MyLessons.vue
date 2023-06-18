<template>
  <div class="profile_main">
    <template v-if="!!myLessons">
      <div v-if="myLessons.length" class="lessons_table_wrapper">
        <SortingOrder
          :order-list="orderList"
          :order-by="orderBy"
          @selectOrderBy="selectOrderBy"
        />
        <div class="profile_lessons">
          <LessonCard
            v-for="card in myLessons"
            :key="card.id"
            :cards-data="card"
          />
        </div>
        <div v-if="isShowPagination" class="lesson_pages_wrapper">
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
      </div>

      <div v-else class="profile_no_lessons">
        <div class="profile_no_lessons__title">
          {{ $t('buttons.have_not_courses') }}
        </div>
        <div class="profile_no_lessons__text">
          {{ $t('profilePage.choose_course') }}
        </div>
        <ButtonBase
          color="orange"
          size="popular"
          type="submit"
          class="current_lesson__btn"
          @click.native="goToCourses"
        >
          {{ $t(`buttons.go_to_lessons.${getCoursesMode}`) }}
        </ButtonBase>
      </div>
    </template>
    <Loader v-else color="orange"></Loader>
  </div>
</template>

<script>
import Loader from '@/elements/Loader/Loader.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import LessonCard from '@/components/LessonCard/LessonCard.vue';
import SortingOrder from '@/elements/SortingOrder/SortingOrder.vue';
import { COURSES_MODES } from '@/types/constants';
import { mapGetters } from 'vuex';

export default {
  components: {
    LessonCard,
    ButtonBase,
    SortingOrder,
    Loader,
  },
  data() {
    return {
      myLessons: null,
      lessonsPerPage: 1,
      pagesCount: 1,
      currentPage: 1,

      orderBy: {
        id: 'rating_desc',
        title: 'order_by',
      },
      orderList: [
        {
          id: 'rating_desc',
          title: 'rating_desc',
        },
        {
          id: 'popular_desc',
          title: 'popular_desc',
        },
        {
          id: 'created_asc',
          title: 'created_asc',
        },
        {
          id: 'created_desc',
          title: 'created_desc',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getSelectedLanguage',
      'getCoursesMode',
      'getCoursesModeDispatch',
    ]),
    isShowPagination() {
      return this.pagesCount > 1;
    },
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchMyCoursesList();
    },
  },
  async created() {
    this.$route.query.page
      ? (this.currentPage = +this.$route.query.page)
      : (this.currentPage = 1);
    await this.fetchMyCoursesList();
  },
  methods: {
    pageChangeHandler(selectedPage) {
      this.currentPage = +selectedPage;
      this.fetchMyCoursesList();
    },
    async fetchMyCoursesList() {
      let res = await this.$store.dispatch(
        `getMy${this.getCoursesModeDispatch}CoursesList`,
        {
          page: this.currentPage,
          order_by: this.orderBy.id,
        }
      );
      this.myLessons = [...res.data];
      this.currentPage = res.current_page;
      this.lessonsPerPage = res.per_page;
      this.pagesCount = res.last_page;
      this.$router
        .push({
          name: this.$route.name,
          query: { page: this.currentPage },
        })
        .catch(() => {});
    },
    selectOrderBy(id) {
      this.orderBy = this.orderList.find((el) => el.id === id);
      this.fetchMyCoursesList();
    },
    goToCourses() {
      this.$router.push({ name: 'courses' });
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_lessons
  display: grid
  grid-template-columns: 1fr 1fr
  column-gap: 6%
  row-gap: 60px
  margin-bottom: 40px
  @include s
    row-gap: 20px
    margin-top: 90px
  @include xs
    grid-template-columns: 1fr
    justify-items: center
  @include xxs
    row-gap: 16px

.lessons_table_wrapper
  position: relative

  .sorting_select
    position: absolute
    top: -60px
    right: 0
    z-index: 9
    @include s
      top: -68px
    @include xs
      min-width: 270px
      right: auto
      left: 50%
      transform: translateX(-50%)
    @media screen and (max-width: 450px)
      min-width: 100%

.lesson_pages_wrapper
  display: flex
  justify-content: flex-end

.profile_no_lessons
  display: flex
  align-items: center
  flex-direction: column
  padding: 40px 20px
  border: 1px solid var(--color-main)
  @include xs
    padding: 20px

.profile_no_lessons__title,
.profile_no_tests__text
  color: var(--primary-font-color)

.profile_no_lessons__title
  font-weight: 500
  @include adaptive-font-size(24, 20, 16)
  @include adaptive-line-height(32, 26, 20)
  text-align: center

.profile_no_lessons__text
  @include adaptive-font-size(18, 16, 14)
  @include adaptive-line-height(28, 23, 18)
  text-align: center
  margin: 16px 0 40px 0
  @include xs
    margin: 12px 0 30px 0
</style>
