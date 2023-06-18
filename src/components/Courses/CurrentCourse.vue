<template>
  <div>
    <div v-if="!!getCurrentCourseData && !isMissingData" class="current_lesson">
      <div
        v-if="
          !getCurrentCourseData.user_data.has_subscription_for_this_course &&
          isShowSubscriptionNote &&
          getUserRole !== 'teacher'
        "
        class="current_lesson__note"
      >
        <div class="container">
          <div class="current_lesson__note_inner">
            <div class="current_lesson__note_text">
              {{ $t(`courses.course_get_infinite_success.${getCoursesMode}`) }}
              <router-link
                class="current_lesson__note_link"
                :to="{ name: 'smart_subscribe' }"
              >
                {{ $t('buttons.smart_subscribe') }}
              </router-link>
            </div>
            <div
              class="current_lesson__note_close"
              @click="closeSubscriptionNote"
            >
              <svg-icon name="cross_grey" />
            </div>
          </div>
        </div>
      </div>
      <div class="current_lesson__header">
        <svg-icon name="arrow_for_courses" />
        <div class="container">
          <div class="current_lesson__content">
            <div class="current_lesson__content_img">
              <div
                v-if="
                  isAuthUser &&
                  getCurrentCourseData.user_data.current_progress_percent > 0
                "
                class="current_lesson__content_progress"
              >
                <vue-ellipse-progress
                  :progress="
                    getCurrentCourseData.user_data.current_progress_percent
                  "
                  color="#FFFFFF"
                  empty-color="#FFFFFF"
                  line="butt"
                  line-mode="in 2"
                  :size="15"
                  :thickness="4.5"
                  :legend="false"
                />
                {{ $t('courses.progress') }}
                {{ getCurrentCourseData.user_data.current_progress_percent }} %
              </div>
              <template v-if="!!getCurrentCourseData.poster">
                <img :src="getCurrentCourseData.poster" alt="courses" />
              </template>
              <template v-else>
                <img src="/images/default_course.svg" alt="courses" />
              </template>
            </div>
            <div class="current_lesson__starting">
              <h2 class="current_lesson__title">
                {{ getCurrentCourseData.title }}
              </h2>
              <div
                v-if="getCurrentCourseData.user_data.is_course_started"
                class="current_lesson__start_date"
              >
                {{ $t('courses.started_at') }}
                <div
                  v-if="getWindowWidth <= 1130 && getWindowWidth > 1024"
                ></div>
                {{
                  transformNewsDate(getCurrentCourseData.user_data.started_at)
                }}
              </div>
              <ButtonBase
                v-if="getUserRole === 'teacher' && isTeacherAuthor"
                class="desktop"
                color="blue"
                size="teacher-materials-size"
                @click.native.stop="goToDetailCourse"
              >
                {{ $t('buttons.lesson_content') }}
              </ButtonBase>

              <!-- :start-lesson-id="startLessonId" -->
              <CourseButton
                v-else-if="
                  !isTeacherAuthor &&
                  getUserRole !== 'teacher' &&
                  !!getCurrentCourseData
                "
                class="desktop"
                :course-id="getCurrentCourseData.id"
                :course-btn="getCurrentCourseData.course_button"
                :course-price="getCurrentCourseData.price"
                :can-be-purchased="getCurrentCourseData.can_be_purchased"
                :has-subscription-for-course="
                  getCurrentCourseData.user_data
                    .has_subscription_for_this_course
                "
                :is-course-started="
                  getCurrentCourseData.user_data.is_course_started
                "
                :is-purchased="getCurrentCourseData.user_data.is_purchased"
              ></CourseButton>
            </div>
            <div class="current_lesson__rating_card">
              <div
                v-for="item in dataRatingCard"
                :key="item.id"
                class="current_lesson__item"
              >
                <svg-icon :name="item.img" />
                <span class="current_lesson__item_title">
                  {{ item.title }}
                </span>
              </div>

              <div class="current_lesson__teacher">
                <div class="current_lesson__teacher_photo">
                  <img
                    :src="
                      !!getCurrentCourseData.author.profile_photo
                        ? getCurrentCourseData.author.profile_photo
                        : getCurrentCourseData.author.non_avatars[
                            getCoursesMode
                          ]
                    "
                  />
                </div>
                <div class="current_lesson__teacher_block">
                  <h4 class="current_lesson__teacher_caption">
                    {{ $t('courses.teacher') }}:
                  </h4>
                  <h3 class="current_lesson__teacher_name">
                    {{ getCurrentCourseData.author.full_name }}
                  </h3>
                </div>
              </div>
            </div>
            <ButtonBase
              v-if="
                !!getCurrentCourseData &&
                getUserRole === 'teacher' &&
                isTeacherAuthor &&
                !getCurrentCourseData.can_be_purchased
              "
              class="mobile"
              color="blue"
              size="teacher-materials-size"
              @click.native.stop="goToDetailCourse"
            >
              {{ $t('buttons.lesson_content') }}
            </ButtonBase>
            <!-- :start-lesson-id="startLessonId" -->
            <CourseButton
              v-else-if="
                !isTeacherAuthor &&
                getUserRole !== 'teacher' &&
                !!getCurrentCourseData
              "
              class="mobile"
              :course-id="getCurrentCourseData.id"
              :course-btn="getCurrentCourseData.course_button"
              :course-price="getCurrentCourseData.price"
              :can-be-purchased="getCurrentCourseData.can_be_purchased"
              :has-subscription-for-course="
                getCurrentCourseData.user_data.has_subscription_for_this_course
              "
              :is-course-started="
                getCurrentCourseData.user_data.is_course_started
              "
              :is-purchased="getCurrentCourseData.user_data.is_purchased"
            ></CourseButton>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="about-lesson">
          <div class="about-lesson__left">
            <h2 class="about-lesson__title">
              {{ $t(`courses.about_lesson.${getCoursesMode}`) }}
            </h2>
            <p class="about-lesson__text">
              {{ getCurrentCourseData.description }}
            </p>
            <div class="study_objectives__wrapper">
              <h2 class="study_objectives_title">
                {{ $t(`courses.study_objectives.${getCoursesMode}`) }}:
              </h2>
              <div
                v-for="el in getCurrentCourseData.goals"
                :key="el.id"
                class="study_objectives__item"
              >
                <svg-icon name="check" />
                <p class="study_objectives__item_text">
                  {{ el.title }}
                </p>
              </div>
            </div>
          </div>

          <div class="about-lesson__card">
            <div class="about-lesson__card_item">
              <h4 class="about-lesson__card_title">
                {{ $t('courses.direction') }}
              </h4>
              <h5 class="about-lesson__card_text">
                {{ getCurrentCourseData.category.title }}
              </h5>
            </div>
            <div class="about-lesson__card_item">
              <h4 class="about-lesson__card_title">
                {{ $t('courses.online') }}
              </h4>
              <h5 class="about-lesson__card_text">
                {{ $t('courses.start_now') }}
              </h5>
            </div>
            <div class="about-lesson__card_item">
              <h4 class="about-lesson__card_title">
                {{ $t('courses.time') }}
              </h4>
              <h5 class="about-lesson__card_text">
                {{ calculateTime(getCurrentCourseData.duration_minutes) }}
              </h5>
            </div>
            <div class="about-lesson__card_item">
              <h4 class="about-lesson__card_title">
                {{ $t('courses.language') }}
              </h4>
              <h5 class="about-lesson__card_text">
                {{ getCurrentCourseData.language.title }}
              </h5>
            </div>
            <div class="about-lesson__card_item">
              <h4 class="about-lesson__card_title">
                {{ $t('courses.price') }}
              </h4>
              <CoursePricingStatus
                :course-btn="getCurrentCourseData.course_button"
                :cur-course="getCurrentCourseData"
                :course-price="getCurrentCourseData.price"
                :can-be-purchased="getCurrentCourseData.can_be_purchased"
                :has-subscription-for-course="
                  getCurrentCourseData.user_data
                    .has_subscription_for_this_course
                "
                :is-purchased="getCurrentCourseData.user_data.is_purchased"
              />
            </div>
          </div>
        </div>
        <div class="program_lesson">
          <div class="program_lesson__block_left">
            <h2 class="program_lesson__title">
              {{ $t(`courses.program_lesson.${getCoursesMode}`) }}
            </h2>
            <div class="program_lesson__card">
              <div
                v-for="item in programLesson"
                :key="item.id"
                class="current_lesson__card"
              >
                <div class="program_lesson__item">
                  <svg-icon :name="item.img" class="program_lesson__icons" />
                  <span class="current_lesson__item_title">{{
                    item.title
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- <CurrentCourseProgramm /> -->
          <div
            v-if="!!getCurrentCourseData.chapters.length"
            class="program_lesson__block_right"
          >
            <div
              v-for="item in getCurrentCourseData.chapters"
              :key="item.id"
              class="program_lesson__wrapper"
            >
              <div
                class="program_lesson__info-block"
                :class="{ opened: openItem.includes(item.id) }"
                @click="toggleItem(item.id)"
              >
                <h2 class="program_lesson__subtitle">{{ item.title }}</h2>
                <div class="nav_cross__wrapper">
                  <div
                    class="nav_cross"
                    :class="{ opened: openItem.includes(item.id) }"
                  ></div>
                </div>
              </div>
              <p class="program_lesson__text">{{ item.description }}</p>
              <div class="program_lesson__block">
                <svg-icon name="book" class="program_lesson__icons" />
                <span>{{ item.lessons_count }}</span>
                <svg-icon name="clock" class="program_lesson__icons" />
                <span>{{ calculateTime(item.duration_minutes) }}</span>
              </div>
              <div
                v-if="openItem.includes(item.id)"
                class="program_lesson__info-box"
              >
                <div
                  v-for="info in item[lessonsKeyName]"
                  :key="info.lesson.id"
                  class="program_lesson__info"
                >
                  <div v-if="!!info.lesson" class="info_bock__item">
                    <svg-icon name="player" />
                    <div class="program_lesson__info-block">
                      <h3 class="program_lesson__text info_title">
                        <!-- :style="{ 'max-width': lessonTitleWidth }" -->
                        {{ info.lesson.title }}
                      </h3>
                      <div class="program_lesson__info-block_time">
                        {{ calculateTime(info.lesson.duration_minutes) }}
                      </div>
                    </div>
                  </div>

                  <div v-if="!!info.test" class="info_bock__item">
                    <svg-icon name="video_test" />
                    <div class="program_lesson__info-block">
                      <h3 class="program_lesson__text info_title">
                        {{ $t('courses.test') }}
                      </h3>
                      <div class="program_lesson__info-block_time">
                        {{ info.test.questions_count }}
                        {{ $t('courses.questions') }}
                      </div>
                    </div>
                  </div>
                  <div v-if="!!info.task" class="info_bock__item">
                    <svg-icon name="pro_task_start" />
                    <div class="program_lesson__info-block">
                      <h3 class="program_lesson__text info_title">
                        {{ info.task.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!!courseReviews && courseReviews.length" class="container">
        <div class="feedback">
          <Heading class="feedback__title" level="2">{{
            $t('courses.feedback_students')
          }}</Heading>

          <div class="feedback__rating_first-block">
            <h2 class="feedback__rating_grade">
              {{ getCurrentCourseData.avg_rating }}
            </h2>
            <div class="card_lesson__star">
              <star-rating
                :rating="+getCurrentCourseData.avg_rating"
                :read-only="true"
                :star-size="getWindowWidth <= 540 ? 8 : 16"
                text-class="card_custom_star_text"
                :fixed-points="1"
                :show-rating="false"
                inactive-color="#FFEBD4"
                active-color="#FF9B26"
                :increment="0.1"
              />
            </div>
            <p class="feedback__rating_title">
              {{ $t('courses.course_rate') }}
            </p>
          </div>

          <div class="feedback__rating_wrapper">
            <!-- <template v-if="!!item.author"> -->
            <div
              v-for="(item, idx) in courseReviews"
              :key="item.created_at"
              class="feedback__rating_second-block"
            >
              <div
                v-if="!!item.author"
                class="feedback__rating_info-wrapper"
                :class="{
                  isLast: idx === courseReviews.length - 1,
                  isLongCourseReviewsList: !isLongCourseReviewsList,
                }"
              >
                <div class="feedback__rating_info-block">
                  <div class="feedback__rating-photo-box">
                    <img
                      :src="
                        !!item.author.profile_photo
                          ? item.author.profile_photo
                          : item.author.non_avatars[getCoursesMode]
                      "
                      alt="Photo"
                    />
                  </div>
                  <div class="feedback__rating_text-box">
                    <h3 class="feedback__rating_name">
                      {{ item.author.full_name }}
                    </h3>
                    <div class="feedback__rating_inner-box">
                      <div class="card_lesson__star">
                        <star-rating
                          :rating="item.rating"
                          :read-only="true"
                          :star-size="16"
                          text-class="card_custom_star_text"
                          :fixed-points="1"
                          :show-rating="false"
                          inactive-color="#FFEBD4"
                          active-color="#FF9B26"
                        />
                      </div>
                      <p class="feedback__rating_time">
                        <!-- {{ item.created_at }} -->
                        {{ transformReviewsDate(item.created_at) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card_lesson__star">
                  <star-rating
                    :rating="item.rating"
                    :read-only="true"
                    :star-size="16"
                    text-class="card_custom_star_text"
                    :fixed-points="1"
                    :show-rating="false"
                    inactive-color="#FFEBD4"
                    active-color="#FF9B26"
                  />
                </div>
                <p class="feedback__rating_text">{{ item.text }}</p>
              </div>
            </div>
            <template v-if="isLongCourseReviewsList">
              <Loader v-if="isReviewsLoader" color="orange" />
              <ButtonBase
                v-else
                color="orange"
                size="popular"
                type="submit"
                icon-name="arrow_white_down"
                reverse
                class="current_lesson__btn"
                @click.native="fetchCourseReviews"
                >{{ $t('buttons.show_else') }}
              </ButtonBase>
            </template>
          </div>
        </div>
      </div>
      <div class="container" style="overflow-x: hidden">
        <div class="similar_news">
          <div class="similar_news__head">
            <Heading level="2">
              {{ $t('courses.similar_lessons') }}
            </Heading>
          </div>

          <div class="similar_news__slider">
            <div slot="button-prev" class="swiper__arrow_prev">
              <svg-icon name="arrow_swipe_left" />
            </div>
            <swiper ref="swiper" class="swiper" :options="swiperOptions">
              <swiper-slide
                v-for="card in popularCourses"
                :key="card.id"
                class="swiper_slide"
              >
                <LessonCard
                  :cards-data="card"
                  class="course_card_lesson_wrapper"
                  @fetchOnAllCoursePage="fetchCurrentCourseData"
                />
              </swiper-slide>
            </swiper>
            <div slot="button-next" class="swiper__arrow_next">
              <svg-icon name="arrow_swipe_right" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isMissingData" class="current_course__missing container">
      <Heading level="4">{{ $t('courses.missing_data') }}</Heading>
      <ButtonBase
        color="orange"
        size="popular"
        @click.native.stop="goToCoursePage"
      >
        {{ $t(`buttons.go_to_lessons.${getCoursesMode}`) }}
      </ButtonBase>
    </div>
    <div v-else class="loader_page">
      <Loader color="orange" />
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import StarRating from 'vue-star-rating';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';
import LessonCard from '@/components/LessonCard/LessonCard.vue';
import CourseButton from '@/components/Courses/CourseButton.vue';
import CoursePricingStatus from '@/components/Courses/CoursePricingStatus.vue';
import { calcTimeHHMMSS, onlyHoursAndMinutes } from '@/helpers/time';
import { COURSES_MODES } from '@/types/constants';
import { convertUTCDateToLocalDate } from '@/library/utcFormat';

export default {
  title: 'Change direction',
  components: {
    ButtonBase,
    StarRating,
    CourseButton,
    CoursePricingStatus,
    Loader,
    LessonCard,
    Heading,
  },
  data() {
    return {
      COURSES_MODES,
      convertUTCDateToLocalDate,

      swiperOptions: {
        slidesPerView: 3,
        spaceBetween: 80,
        navigation: {
          prevEl: '.swiper__arrow_prev',
          nextEl: '.swiper__arrow_next',
        },
        breakpoints: {
          1199: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          600: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 1,
          },
        },
      },

      popularCourses: [],
      courseReviews: [],
      offsetAmount: 3,
      currentReviewsOffset: 0,
      isLongCourseReviewsList: true,
      isShowSubscriptionNote: true,
      isReviewsLoader: false,
      openItem: [],
      isMissingData: false,
      isLoader: false,
      isNotExist: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getSelectedLanguage',
      'getCurrentCourseData',
      'getCurrentCoursePreview',
      'getWindowWidth',
      'getUserRole',
      'getLastWatchedLessonId',
      'isAuthUser',
    ]),

    isTeacherAuthor() {
      return getFromLS('user_id') === this.getCurrentCourseData.author.id
        ? true
        : false;
    },
    programLesson() {
      return this.dataRatingCard.filter((el) => el.id !== 2);
    },

    dataRatingCard() {
      let card = [];
      card.push({
        id: 1,
        img: 'sections',
        title: `${this.getCurrentCourseData.chapters_count} ${this.$t(
          'rate_card.chapters'
        )}`,
      });
      let textStars = this.$t('rate_card.star');
      this.getCurrentCourseData.avg_rating <= 1
        ? (textStars = this.$t('rate_card.star'))
        : this.getCurrentCourseData.avg_rating <= 4
        ? (textStars = this.$t('rate_card.stars'))
        : (textStars = this.$t('rate_card.stars_b'));

      card.push({
        id: 2,
        img: 'star',
        title: `${this.getCurrentCourseData.avg_rating} ${textStars}`,
      });
      card.push({
        id: 3,
        img: 'book',
        title: `${this.getCurrentCourseData.lessons_count} ${this.$t(
          'rate_card.lessons'
        )}`,
      });
      card.push({
        id: 4,
        img: 'clock',
        title: `${onlyHoursAndMinutes(
          this.getCurrentCourseData.duration_minutes
        )}`,
      });

      return card;
    },

    lessonsKeyName() {
      return this.getCoursesMode === COURSES_MODES.SCHOOL
        ? 'lessons_and_tests'
        : 'lessons_and_tests_and_tasks';
    },
  },

  watch: {
    getSelectedLanguage(value) {
      if (value) {
        // this.currentReviewsOffset = 0;
        this.fetchCoursesList();
        this.fetchCurrentCourseData();
      }
    },
  },

  async created() {
    await this.fetchCoursesList();
    await this.fetchCurrentCourseData();
    if (!!this.getCurrentCourseData.chapters.length) {
      await this.fetchCourseReviews();
    }
  },

  beforeDestroy() {
    this.$store.commit('SET_CURR_COURSE_DATA', null);
  },

  methods: {
    async fetchCoursesList() {
      let res = await this.$store.dispatch(
        `getPopular${this.getCoursesModeDispatch}CoursesList`
      );
      this.popularCourses = [...res];
    },
    async goToDetailCourse() {
      await this.$router.push({
        name: 'lesson-detail',
        params: {
          course_id: this.$route.params.course_id,
        },
      });
    },
    async fetchCurrentCourseData() {
      this.isLoader = true;

      let error = await this.$store.dispatch(
        // `getCurrent${this.getCoursesModeDispatch}CourseData`,
        `getCurrent${this.getCoursesModeDispatch}CoursePreview`,
        this.$route.params.course_id
      );
      if (!!error) {
        this.$router.push({ name: 'error' });
        return;
      }

      if (!!this.getCurrentCourseData.chapters.length) {
        if (this.getCurrentCourseData) {
          this.$store.commit('SET_CURR_BREAD_LABEL', {
            current_course_name: this.getCurrentCourseData.title,
          });
        }

        let isChoosenCurrentCourse = [];
        if (!!this.getLastWatchedLessonId) {
          isChoosenCurrentCourse = this.getCurrentCourseData.chapters.filter(
            (chapter) =>
              chapter[this.lessonsKeyName].find(
                (el) => el.lesson.id === this.getLastWatchedLessonId
              )
          );
        }

        if (!isChoosenCurrentCourse.length) {
          this.$store.commit(
            'SET_LAST_WATCHED_LESSON',
            this.getCurrentCourseData.chapters[0][this.lessonsKeyName][0].lesson
              .id
          );
        }

        this.isMissingData = false;
        this.isLoader = false;
      } else {
        this.isMissingData = true;
      }
    },

    async fetchCourseReviews() {
      this.isReviewsLoader = true;

      const res = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}CourseReviews`,
        {
          id: this.$route.params.course_id,
          offset: this.currentReviewsOffset,
        }
      );
      if (res.length >= this.offsetAmount) {
        this.isLongCourseReviewsList = true;
      } else {
        this.isLongCourseReviewsList = false;
      }
      this.courseReviews = [...this.courseReviews, ...res];

      if (this.isLongCourseReviewsList) {
        this.currentReviewsOffset += this.offsetAmount;
      }
      this.isReviewsLoader = false;
    },

    goToCoursePage() {
      this.$router.push({ name: 'courses' });
    },

    toggleItem(id) {
      if (this.openItem.includes(id)) {
        this.openItem = this.openItem.filter((item) => item !== id);
      } else {
        this.openItem.push(id);
      }
    },

    calculateTime(time) {
      return calcTimeHHMMSS(time);
    },

    transformNewsDate(date) {
      let lang = this.getSelectedLanguage;
      if (lang === 'uz') {
        lang = 'uz-latn';
      }
      return moment(date, 'YYYY-MM-DD').locale(`${lang}`).format('ll');
    },

    transformReviewsDate(date) {
      let lang = this.getSelectedLanguage;
      if (lang === 'uz') {
        lang = 'uz-latn';
      }
      return moment(date).utc().locale(`${lang}`).fromNow();
    },

    closeSubscriptionNote() {
      this.isShowSubscriptionNote = false;
    },
  },
};
</script>

<style lang="sass">
.loader_page
  display: flex
  align-items: center
  justify-content: center
  min-height: 80vh

.current_lesson__note
  background-color: #EBF2FF
  padding: 16px 0

.current_lesson__note_inner
  display: flex
  align-items: center

.current_lesson__note_text
  flex: 0 1 100%
  text-align: center
  font-size: 16px
  line-height: 20px
  color: var(--btn-color-blue-dark)
  padding-right: 15px

.current_lesson__note_text,
.current_lesson__note_link
  color: var(--btn-color-blue-dark)

.current_lesson__note_link
  font-weight: 600
  text-decoration: underline

.current_lesson__note_close
  display: flex
  cursor: pointer

.icon-cross_grey
  max-width: 15px
  max-height: 15px

.similar_news
  padding-bottom: 108px
  @include s
    padding-bottom: 60px

.similar_news__head
  padding-bottom: 40px
  @include s
    padding-bottom: 32px

.similar_news__slider
  position: relative

.swiper-container
  padding-top: 10px

.swiper-slide
  .course_card_lesson_wrapper
    margin: 0 auto

.swiper-container
  padding-top: 10px

.similar_news__slider
  .swiper__arrow_prev,
  .swiper__arrow_next
    display: flex
    align-items: center
    position: absolute
    top: -78px
    z-index: 9

    @include s
      top: -68px

    @media screen and (max-width: 600px)
      top: 50%
      transform: translateY(-50%)
      width: 124px
      height: 98px
      background-color: var(--color-main)
      border-radius: 50%

      .svg-icon
        fill: var(--color-white)

  .swiper__arrow_prev
    right: 48px

    @media screen and (max-width: 600px)
      right: auto
      left: -100px
      padding-right: 8px
      justify-content: flex-end

    @media screen and (max-width: 350px)
      left: -110px
      padding-right: 4px

  .swiper__arrow_next
    right: 0

    @media screen and (max-width: 600px)
      right: -100px
      padding-left: 8px

    @media screen and (max-width: 350px)
      right: -110px
      padding-left: 4px
      padding-left: 4px

  .swiper__arrow_prev.swiper-button-disabled,
  .swiper__arrow_next.swiper-button-disabled
    @media screen and (max-width: 600px)
      background-color: var(--color-main-light)

.similar_news__head .title
  @include adaptive-font-size(48, 40, 24)
  @include adaptive-line-height(60, 50, 30)
  max-width: 85%

.current_lesson__header
  position: relative
  background-color: var(--color-white)

.icon-arrow_for_courses
  position: absolute
  right: 0
  top: -12px
  max-height: 74px
  max-width: 70px

  @include xs
    display: none

.current_lesson__content
  overflow-x: hidden !important
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  justify-content: space-between
  align-items: center
  gap: 40px
  @include s
    grid-template-columns: 1fr 1fr
    grid-template-rows: 1fr auto
    padding: 48px 0

  @include xs
    grid-template-columns: 1fr 2fr
    padding: 32px 0

  @include xs
    grid-template-columns: 1fr
    grid-template-rows: auto
    gap: 0

.current_lesson__content_img
  display: flex
  justify-content: center
  padding: 52px 0
  height: 100%
  position: relative
  @include s
    padding: 0

  @include xs
    height: auto

  @include xs
    margin: 16px 0 24px 0

.current_lesson__content_progress
  position: absolute
  top: 68px
  right: 30px
  background-color: var(--primary-font-color)
  color: var(--color-white)
  padding: 8px 10px
  display: flex
  align-items: center
  gap: 9px
  font-size: 14px

  @include s
    top: 16px

.current_lesson__content_img img
  object-fit: cover
  height: 100%

.current_lesson__btn.desktop
  display: block
  @include xs
    display: none

.desktop
  display: block
  @include xs
    display: none !important

.mobile
  display: none
  @include xs
    display: flex
    margin: 40px auto 0
    background: none

.current_lesson__btn.mobile
  display: none
  @include xs
    display: flex
    margin: 40px auto 0
    background: none

  @media only screen and (max-width: 450px)
    width: 100%

.study_objectives__wrapper
  display: flex
  flex-direction: column
  border: 2px solid var(--color-white)
  padding: 24px 40px
  margin-top: 40px

  @include s
    border: none
    padding: 0
    margin-top: 32px

  @include xxs
    margin-top: 20px

.study_objectives__item
  display: flex
  align-items: baseline
  padding-bottom: 8px

.study_objectives__item_text
  padding-left: 10px
  max-width: 595px
  font-size: 18px
  line-height: 24px

  @include xxs
    font-size: 16px
    line-height: 22px

.study_objectives_title
  font-size: 24px
  line-height: 32px
  padding-bottom: 18px

  @include xxs
    font-size: 20px
    line-height: 25px

.current_lesson__starting
  display: flex
  flex-direction: column
  justify-content: space-between
  height: 330px
  padding: 52px 0
  @include s
    height: 100%
    padding: 0
  @include xs
    grid-row: 1/2
    height: auto

.current_lesson__title
  @include adaptive-font-size(42, 32, 24)
  @include adaptive-line-height(48, 38, 30)
  @include s
    // padding-bottom: 16px
  @include xs
    // text-align: center
  @include xxs
    text-align: left

.current_lesson__start_date
  color: var(--color-font-light-dark)
  @include m
    // display: none

.current_lesson__rating_card
  display: grid
  grid-template-columns: 1fr 1fr
  row-gap: 20px
  column-gap: 12%
  padding: 32px
  border: 1px solid rgba(18, 50, 62, 0.08)

  @media only screen and (min-width: 768px) and (max-width: 1024px)
    grid-column: 1/-1
    grid-template-columns: 1fr 1fr 1fr 1fr
    column-gap: 0

  @include xs
    grid-column: 1/-1

  @include xxs
    padding: 16px

.current_lesson__teacher
  grid-column: 1/-1
  display: flex
  align-items: center
  padding-top: 20px
  gap: 12px
  border-top: 1px solid rgba(18, 50, 62, 0.08)

  @media only screen and (min-width: 768px) and (max-width: 1024px)
    grid-column: 3/5
    grid-row: 1/3
    gap: 12px
    align-items: center
    padding-left: 50px
    padding-top: 0
    border-top: none
    border-left: 1px solid rgba(18, 50, 62, 0.08)

.current_lesson__teacher_caption
  font-weight: normal

.current_lesson__teacher_photo
  border-radius: 50%
  overflow: hidden
  flex: 0 0 48px
  height: 48px

.current_lesson__teacher_photo img
  width: 100%
  height: 100%
  object-fit: cover

.current_lesson__teacher_name
  font-size: 18px
  line-height: 23px
  font-weight: 600

.current_lesson__item
  display: flex
  align-items: center

.program_lesson__wrapper > .program_lesson__info-block
  padding-bottom: 8px

.program_lesson__info-block
  display: flex
  align-items: center
  justify-content: space-between
  width: 100%
  gap: 35px
  cursor: pointer

.feedback
  display: grid
  grid-template-columns: 1fr 2fr
  grid-template-rows: 100px 1fr
  column-gap: 85px
  padding: 0 0 148px 0

  @include s
    grid-template-columns: 1fr 1fr
    grid-template-rows: auto 1fr
    grid-gap: 40px 0
    padding: 0 0 110px 0

  @include xxs
    grid-gap: 20px 0
    padding: 0 0 50px 0

.feedback .feedback__title
  grid-column: 1/-1

  @include s
    grid-column: auto
    max-width: 250px

  @include xxs
    max-width: 150px

.feedback__rating_info-wrapper
  margin-bottom: 24px
  padding-bottom: 24px
  border-bottom: 1px solid rgba(18, 50, 62, 0.16)
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  width: 100%

.feedback__rating_info-block
  display: flex
  gap: 15px
  flex: 1 0 20%

.feedback__rating-photo-box
  border-radius: 50%
  overflow: hidden
  flex: 0 0 48px
  height: 48px

  @include xxs
    flex: 0 0 32px
    height: 32px

.feedback__rating-photo-box img
  width: 100%
  height: 100%
  -o-object-fit: cover
  object-fit: cover

.feedback__rating-photo-box svg
  max-width: 48px
  max-height: 48px
  @include xxs
    max-width: 32px
    max-height: 32px

.feedback__rating_info-wrapper.isLast
  border: none !important
  margin-bottom: 36px

.feedback__rating_info-wrapper.isLast.isLongCourseReviewsList
  margin-bottom: 0
  padding-bottom: 0

.feedback__rating_info-wrapper .card_lesson__star
  @include xxs
    display: none

.program_lesson__info-block_time
  font-size: 12px
  line-height: 15px
  min-width: 100px
  text-align: right
  opacity: 0.8

  @include xxs
    display: none

.program_lesson
  display: grid
  column-gap: 85px
  grid-template-columns: 1fr 2fr
  padding-bottom: 148px

  @include s
    grid-gap: 40px 0
    grid-template-columns: 1fr
    grid-template-rows: auto 1fr
    padding-bottom: 110px

  @include xxs
    grid-gap: 24px 0
    padding-bottom: 40px

.about-lesson__title,
.program_lesson__title,
.feedback .feedback__title
  @include adaptive-font-size(48, 40, 24)
  @include adaptive-line-height(60, 50, 30)

.program_lesson__title
  max-width: 250px

.program_lesson__item
  display: flex
  align-items: center

.current_lesson__card:last-child
  @media only screen and (max-width: 450px)
    width: 100%
  .program_lesson__item
    @media only screen and (max-width: 450px)
      padding-top: 10px
      padding-left: 0!important

.current_lesson__card + .current_lesson__card
  .program_lesson__item
    padding-left: 25px

.program_lesson__icons
  width: 16px
  height: 16px

.program_lesson__wrapper
  background-color: var(--color-white)
  padding: 24px

  @include xxs
    padding: 16px

.program_lesson__wrapper + .program_lesson__wrapper
  margin-top: 24px

  @include xxs
    margin-top: 12px

.program_lesson__subtitle
  font-size: 24px
  line-height: 32px
  color: var(--color-main)

  @include xxs
    font-size: 18px
    line-height: 23px

.program_lesson__block
  display: flex
  align-items: center
  margin-top: 16px
  background: var(--color-text-bg)
  max-width: 220px
  padding: 10px
  span
    padding-left: 5px
    padding-right: 10px
    font-weight: 600
    font-size: 14px

    @include xxs
      font-weight: normal

.program_lesson__text
  font-size: 16px
  line-height: 20px

  @include xxs
    font-size: 14px
    line-height: 18px

.info_title
  padding-left: 10px
  font-weight: normal

.program_lesson__info
  display: flex
  flex-direction: column
  padding: 0

.current_lesson__item_title
  font-size: 16px
  font-weight: normal
  line-height: 20px
  padding-left: 6px
  white-space: nowrap

  @include xxs
    font-size: 14px
    line-height: 18px

.about-lesson
  padding-top: 80px
  padding-bottom: 155px
  display: grid
  grid-template-columns: 2fr 1fr
  gap: 140px

  @include s
    padding-top: 60px
    padding-bottom: 110px
    gap: 90px

  @include xs
    grid-template-columns: 1fr
    gap: 50px

  @include xxs
    padding: 50px 0

.about-lesson__card
  background-color: var(--color-white)
  padding: 32px
  max-width: 312px
  height: max-content
  justify-self: end

  @include s
    padding: 32px 28px
    max-width: 100%
    justify-self: initial
    min-width: 242px

  @include xxs
    padding: 24px 16px

.about-lesson__card_title
  font-size: 24px
  line-height: 24px
  padding-bottom: 8px

  @include xxs
    font-size: 20px
    line-height: 24px
    padding-bottom: 4px

.icon-check
  fill: var(--color-main)
  width: 14px
  height: 12px

.about-lesson__card_item:not(:first-child)
  padding-top: 24px
  @include xxs
    padding-top: 20px

.about-lesson__card_item:not(:last-child)
  padding-bottom: 24px
  @include xxs
    padding-bottom: 20px

.about-lesson__card_item + .about-lesson__card_item
  border-top: 1px solid rgba(18, 50, 62, 0.16)

.about-lesson__card_text
  font-size: 16px
  line-height: 24px
  font-weight: 400
  opacity: 0.8

.about-lesson__text
  font-size: 18px
  line-height: 26px
  opacity: 0.8
  margin-top: 28px

  @include s
    margin-top: 20px

  @include xxs
    font-size: 16px
    line-height: 23px

.program_lesson__card
  background-color: var(--color-white)
  display: flex
  padding: 18px
  margin-top: 16px

  @include s
    display: inline-flex
    flex-wrap: wrap
    width: 100%

  @include xxs
    padding: 16px

.feedback__rating_wrapper
  background-color: var(--color-white)
  padding: 40px
  display: flex
  flex-direction: column

  @include s
    grid-column: 1/-1

  @include xs
    padding: 32px 24px

  @include xxs
    padding: 24px 16px

.feedback__rating_wrapper .button_wrapper
  margin: 0 auto

.icon-icon_arrow_white_down
  max-width: 10px
  right: 20% !important
  transform: translateX(20%) !important
  @include xs

.feedback__rating
  display: flex
  justify-content: space-between
  margin-top: 40px
  margin-bottom: 150px

.feedback__rating_first-block
  display: flex
  justify-items: center
  flex-direction: column
  align-items: center
  padding: 24px 40px
  background-color: var(--color-white)
  max-width: 200px
  max-height: 200px

  @include s
    max-width: 270px
    display: grid
    justify-self: end
    grid-template-columns: 1fr auto
    column-gap: 16px
    padding: 5px 16px 10px 16px
  @include xxs
    max-width: 88px
    display: flex
    padding: 10px 6px

  .card_lesson__star
    margin: 0
    padding: 0
    @include s
      align-self: end
    @include xxs
      align-self: center

.feedback__rating_second-block
  display: flex

.feedback__rating_inner-box
  display: flex
  align-items: center
  gap: 8px
  padding-bottom: 12px

.feedback__rating_time
  font-size: 14px
  color: var(--color-font-light-dark)

.feedback__rating_text
  font-size: 16px
  line-height: 20px
  flex: 0 0 100%
  padding-left: 63px
  @include xxs
    padding-left: 47px

.feedback__rating_grade
  color: var(--color-head-title)
  font-size: 72px
  line-height: 90px

  @include s
    grid-row: 1/3

  @include xs
    font-size: 64px
    line-height: 70px

  @include xxs
    font-size: 36px
    line-height: 45px

.feedback__rating_title
  font-size: 18px
  opacity: 0.8

  @include xxs
    font-size: 12px
    line-height: 12px

.feedback__rating_name
  font-size: 20px
  line-height: 25px
  @include xxs
    font-size: 18px
    line-height: 23px

.card_lesson__star
  padding-bottom: 8px
  @include xxs
    padding-bottom: 4px

.card_lesson__star.mobile
  display: none
  @include xxs
    display: block

.feedback__rating_inner-box .card_lesson__star
  display: none
  @include xxs
    display: block
    margin: 2px 8px 0 auto
    padding-bottom: 0

.feedback__rating_inner-box .card_lesson__star svg.vue-star-rating-star
  @include xxs
    width: 16px
    height: 16px

.vue-star-rating
  gap: 5px
  @include xxs
    gap: 3px

.news_swipe__title
  padding: 24px 0 28px

.news_swipe__img
  height: 180px
  width: 100%

.news_swipe__img img
  height: 180px
  width: 100%
  object-fit: cover

.similar_lessons__nav
  display: flex
  align-items: flex-end
  justify-content: space-between

.swiper__arrow
  display: flex
  gap: 32px
  cursor: pointer

.course_card_lesson_wrapper
  margin: 0 80px 100px 0px
// min-width: 375px

.nav_cross__wrapper
  display: flex
  align-items: center
  width: 22px

  @include xxs
    width: 15px

.nav_cross
  position: relative
  width: 100%
  height: 2px
  background-color: var(--primary-font-color)

.nav_cross::after
  position: absolute
  content: ''
  width: 100%
  top: 0
  height: 2px
  background-color: var(--primary-font-color)
  transform: rotate(90deg)
  display: block

.nav_cross.opened::after
  display: none

.icon-book
  fill: var(--color-orange)

.icon-clock
  fill: var(--btn-color-blue-dark)

.program_lesson__info-block.opened + .program_lesson__text + .program_lesson__block
  margin-bottom: 16px

.icon-player
  fill: var(--color-main)
  width: 14px
  height: 14px

.swiper_slide
  display: flex

.info_bock__item
  display: flex
  align-items: center
  margin-bottom: 8px

.info_bock__item svg
  max-width: 15px
  max-height: 15px
  position: relative
  align-self: flex-start
  top: 4px

.current_course__missing
  display: flex
  flex-direction: column
  align-items: center
  text-align: center
  margin: 100px 0 200px
</style>
