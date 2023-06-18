<template>
  <div
    v-if="getCurrentCourse"
    class="video_list__overlay"
    :class="{
      opened: isOpenedVideoList,
    }"
  >
    <div
      class="video_list"
      :class="{
        active: isOpenedVideoList,
      }"
    >
      <div class="video_list__top">
        <div class="video_list__title">
          {{ $t('buttons.lesson_content') }}
        </div>
        <div class="video_list__close" @click="toggleVideoList">
          <svg-icon name="filter_cross"></svg-icon>
        </div>
      </div>
      <div
        v-for="(chap, chapterIdx) in getCurrentCourse.chapters"
        :key="chap.id"
        class="video_list_item"
        :class="{ disabled: !idChaptersArray.includes(chap.id) }"
      >
        <div
          class="video_list_item__title"
          :class="{
            active: openedVideoListIds.includes(chap.id),
          }"
          @click="openLessonsVideosList(chap.id)"
        >
          <span>{{ chapterIdx + 1 }}.</span>

          <div style="width: 80%">
            <span>{{ chap.title }}</span>
          </div>
          <div class="video_list_arrow">
            <svg-icon name="video_list_arrow" />
          </div>
        </div>
        <div class="video_list_item__info">
          <div class="info__item">
            <svg-icon name="video_lesson" />
            {{ $t('courses.lessons') }}
          </div>
          <div class="info__item">
            <svg-icon name="video_duration" />
            {{ calculateTimeSeconds(chap.duration_minutes) }}
          </div>
        </div>

        <template v-if="openedVideoListIds.includes(chap.id)">
          <div
            v-for="(item, idx) in chap[lessonsKeyName]"
            :key="idx"
            class="video_list__subitem"
          >
            <div
              class="subitem__lesson"
              :class="{
                selected: startLessonId == item.lesson.id,
              }"
              @click.stop="
                playSelectedLessonVideo(
                  item.lesson.id,
                  chapter.title,
                  item.lesson.title,
                  item.lesson.description,
                  item.lesson.duration_minutes,
                  item.lesson.access
                )
              "
            >
              <div
                class="subitem__title"
                :class="{
                  disabled: !idLessonArray.includes(item.lesson.id),
                }"
                @click="showLessonDetails(item)"
              >
                <svg-icon
                  v-if="getCurrentCourse"
                  :name="watchedVideo(item.lesson.id)"
                />
                {{ item.lesson.title }}
              </div>
              <div class="subitem__duration">
                {{ calculateTimeSeconds(item.lesson.duration_minutes) }}
              </div>
            </div>
            <div
              v-if="!!item.test"
              :class="{
                disabled:
                  !idTestArray.includes(item.test.lesson_id) ||
                  idTestArray.length === 0,
              }"
              class="subitem__test"
              @click.stop="goToCourseTest(item)"
            >
              <div class="subitem__title">
                <svg-icon
                  v-if="getCurrentCourse"
                  :name="successTest(item.lesson.id)"
                />
                <span style="width: 65%">Test</span>
                <div class="bad_test_text">
                  {{ badTestText(item.lesson.id) }}
                </div>
              </div>
              <div class="subitem__duration">
                {{ item.test.questions_count }}
                {{ $t('courses.questions') }}
              </div>
            </div>
            <div
              v-if="!!item.task"
              class="subitem__test"
              :class="stateOfTask(item.lesson.id)[0]"
              @click.stop="goToIndividualTask(item.lesson.id, item.task.id)"
            >
              <div class="subitem__title">
                <svg-icon
                  v-if="getCurrentCourse"
                  :name="stateOfTask(item.lesson.id, item.task.id)[0]"
                />
                <!-- name="video_test"  -->
                <span :class="stateOfTask(item.lesson.id)[0]" style="width: 65%"
                  >{{ item.task.title }}
                  <span
                    v-if="item.task.is_required_individual_task"
                    class="required"
                    >*</span
                  ></span
                >
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { calcTimeHHMMSS } from '@/helpers/time';
import { COURSES_MODES } from '@/types/constants';

export default {
  props: {
    isOpenedVideoList: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpenVideoList: false,
      openedVideoListIds: [],
      firstIdLesson: null,
      currentCourseData: [],
      currentTitleOfVideo: null,
      currentChapterTitle: null,
      currentLessonDescription: null,
      startLessonId: null,
      lessonDuration: null,
      watchedVideoListIds: [],
      chapter: null,
      idChaptersArray: [],
      idLessonArray: [],
      idTestArray: [],
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesModeDispatch',
      'getCourseProgressData',
      'getCurrentCourse',
      'getCoursesMode',
    ]),
    lessonsKeyName() {
      return this.getCoursesMode === COURSES_MODES.SCHOOL
        ? 'lessons_and_tests'
        : 'lessons_and_tests_and_tasks';
    },
  },

  watch: {
    isOpenVideoList(value) {
      if (value) {
        document.documentElement.classList.add('overflow_hidden');
      } else {
        document.documentElement.classList.remove('overflow_hidden');
      }
    },
  },

  async created() {
    await this.fetchStudentsCourseProgress();
    await this.fetchCurrentCourseData();
    this.startLessonId = this.$route.params.lesson_id;
  },

  methods: {
    async openLessonsVideosList(id) {
      if (this.idChaptersArray.includes(id)) {
        if (this.openedVideoListIds.includes(id)) {
          this.openedVideoListIds = this.openedVideoListIds.filter(
            (el) => el !== id
          );
        } else {
          this.openedVideoListIds.push(id);
        }
      }
    },
    goToIndividualTask(lessonId, taskId) {
      let taskProgressId = this.getCourseProgressData.lessonProgress.find(
        (el) => el.lesson_id === lessonId
      ).taskProgress.id;

      this.isOpenedVideoList = false;
      this.$router.push({
        name: 'teacher-individual-task-by-student',
        params: {
          course_id: this.$route.params.course_id,
          student_id: this.$route.params.student_id,
          lesson_id: lessonId,
          task_progress_id: taskProgressId,
        },
      });
    },

    showLessonDetails(item) {
      this.startLessonId = item.lesson.id;
      this.$emit('update-cart', item.lesson.id);
    },
    goToCourseTest(item) {
      this.isOpenVideoList = false;
      this.$emit('toogle-video-list', this.isOpenVideoList);

      this.$router.push({
        name: 'teacher-test-detail',
        params: {
          student_id: this.$route.params.student_id,
          test_id: item.test.id,
          course_id: this.$route.params.course_id,
          lesson_progress_id: this.$route.params.course_progress_id,
        },
      });
    },

    playSelectedLessonVideo(
      id,
      titleOfChapter,
      titleOfLesson,
      lessonDescription,
      lessonDuration,
      has_lesson_access
    ) {
      // console.log(titleOfLesson);
      this.currentChapterTitle = titleOfChapter;
      this.currentTitleOfVideo = titleOfLesson;
      this.currentLessonDescription = lessonDescription;
      this.lessonDuration = lessonDuration;

      this.startLessonId = id;
      this.isOpenVideoList = false;
      this.$emit('toogle-video-list', this.isOpenVideoList);

      this.$emit('selected-titles', {
        id,
        titleOfChapter,
        titleOfLesson,
        lessonDescription,
        lessonDuration,
      });
    },

    async fetchStudentsCourseProgress() {
      await this.$store.dispatch(
        `getStudents${this.getCoursesModeDispatch}CourseProgress`,
        this.$route.params.course_progress_id
      );
      this.getCourseProgressData.lessonProgress.forEach((el) =>
        this.idChaptersArray.push(el.chapter_id)
      );
      this.getCourseProgressData.lessonProgress.forEach((el) =>
        this.idLessonArray.push(el.lesson_id)
      );

      // this.getCourseProgressData.lessonProgress.forEach((el) =>
      //   this.idTestArray.push(el.lesson_id)
      // );

      this.getCourseProgressData.lessonProgress.forEach(
        (el) =>
          el.testProgress.length !== 0 && this.idTestArray.push(el.lesson_id)
      );
    },

    async fetchCurrentCourseData() {
      if (this.$route.params.course_id) {
        await this.$store.dispatch(
          `getCurrent${this.getCoursesModeDispatch}CourseData`,
          this.$route.params.course_id
        );
      }
    },

    calculateTimeSeconds(time) {
      return calcTimeHHMMSS(time);
    },

    badTestText(lessonId) {
      if (lessonId) {
        let res = this.getCourseProgressData.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (res && res.test_grade < 70 && res.test_grade > 0) {
          return this.$t('tests.uncorrect_test');
        }
      }
    },

    watchedVideo(lessonId) {
      if (lessonId) {
        let res = this.getCourseProgressData.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (res) {
          if (res.ended) {
            return 'video_watched';
          } else {
            return 'video_play';
          }
        }
        return 'video_play';
      }
    },
    successTest(lessonId) {
      if (lessonId) {
        let res = this.getCourseProgressData.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (res && res.test_grade >= 70) {
          return 'video_watched';
        } else if (
          res &&
          res.test_grade < 70 &&
          res.test_grade >= 0 &&
          res.ended
        ) {
          return 'video_test_bad';
        } else {
          return 'video_test';
        }
        return 'video_test';
      }
    },

    stateOfTask(lessonId) {
      if (!!lessonId) {
        let res = this.getCourseProgressData.lessonProgress.find(
          (el) => el.lesson_id === lessonId
        );
        if (!!res && !!res.taskProgress) {
          if (res.taskProgress.is_ready_for_teacher_viewing) {
            return ['pro_task_teacher_viewing'];
          } else if (
            res.taskProgress.is_read_by_teacher &&
            res.taskProgress.grade >= 1 &&
            res.taskProgress.grade < 70
          ) {
            return ['pro_task_failed', res.taskProgress.grade];
          } else if (res.taskProgress.grade >= 70) {
            return ['pro_task_success', res.taskProgress.grade];
          } else {
            return ['pro_task_start'];
          }
        }
        return ['pro_task_start'];
      } else {
        return ['pro_task_start'];
      }
    },
    toggleVideoList() {
      this.isOpenVideoList = !this.isOpenVideoList;
      this.$emit('toogle-video-list', this.isOpenVideoList);
    },
  },
};
</script>
<style lang="sass">
.vjs-big-play-button
  top: 50% !important
  left: 50% !important
  transform: translate(-50%, -50%)

.video_page__left
  display: flex
  flex-direction: column
  width: 100%

.video_page__container
  display: flex
  max-width: 1440px
  // padding-right: 80px
  padding-left: 80px
  margin-right: auto
  margin-left: auto
  @include s
    padding-left: 0
    flex-wrap: wrap
    margin-bottom: 28px

.disabled
  opacity: 0.5
  pointer-events: none

.video_info__star
  cursor: pointer
  font-weight: bold
  margin-bottom: 24px

  @include xs
    grid-column: 2/3
    margin-bottom: 0

.video_info__author
  display: flex
  align-items: center
  gap: 16px

  @include s
    grid-row: 1/-1

  @include xs
    grid-row: 1/2
    grid-column: 1/-1
    margin-bottom: 26px

.author_info__date
  @include adaptive-font-size(16, 16, 14)
  @include adaptive-line-height(20, 20, 18)

.author_info__name
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(30, 25, 25)
  font-weight: bold
  padding-bottom: 4px

.author_img
  border-radius: 50%
  overflow: hidden
  flex: 0 0 54px
  height: 54px

  @include xxs
    flex: 0 0 40px
    height: 40px

.author_img img
  width: 100%
  height: 100%
  object-fit: cover

.video_info__star,
.video_info__progress
  display: flex
  grid-gap: 10px
  align-items: center
  justify-content: flex-end
  font-size: 16px
  line-height: 20px

.video_info__progress
  @include s
    grid-column: 2/3

  @include xs
    grid-column: 1/2
    grid-row: 2/3
    justify-content: flex-start

.video_info__progress svg
  max-width: 20px

.video_description .title
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(32, 32, 24)
  margin-bottom: 12px

.video_description__info
  @include adaptive-font-size(18, 18, 16)
  @include adaptive-line-height(26, 26, 23)
  width: 68%

  @include s
    width: 100%

.info__item
  display: flex
  align-items: center
  gap: 5px
  font-size: 14px

.info__item svg
  max-width: 16px

.subitem__lesson.selected
  background-color: #FDF6F4

.subitem__title .required
  color: var(--color-orange)

.icon-icon_arrow_back
  width: 8px
  height: 12px

.video_list__overlay
  display: flex
  flex-direction: column
  width: 100%
  max-width: 30%
  background-color: var(--color-white)
  @include s
    display: none
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    max-width: 100%
    overflow-x: hidden
    overflow-y: auto
    background: rgba(5, 12, 15, 0.4)
    z-index: 999

.video_list
  padding: 20px 16px 0 24px

  @include s
    position: absolute
    top: 0
    right: 0
    width: 100%
    height: max-content
    min-height: 100%
    max-width: 358px
    transform: translateX(100%)
    background: var(--color-white)
    transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1)

  @include xxs
    max-width: 100%

.video_list.active
  transform: translateX(0%)

.video_list__overlay.opened
  @include s
    display: block

.video_list__top
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0 0 16px 24px
  border-bottom: 1px solid #ECECEC
  margin: 0 -16px 0 -24px
  @include xxs
    padding: 0 16px 16px 24px

.video_list__title
  font-size: 20px
  font-weight: bold

.video_list_item
  display: flex
  flex-direction: column
  gap: 8px
  padding: 24px 0 0 0
  cursor: pointer

.video_list_item__title
  display: flex
  // justify-content: space-between
  font-size: 18px
  font-weight: bold

.video_list_item__title span
  max-width: 240px

.video_list_item__title svg
  max-width: 15px
  transition: 0.3s

.video_list_item__title.active svg
  transform: rotate(180deg)

.video_list_item__title.finished
  color: #ccc

.video_list_arrow
  display: flex
  justify-content: flex-end
  width: 20%

.video_list_item__info
  display: flex
  gap: 12px
  padding: 0 0 24px 40px
  margin: 0 -16px 0 -24px
  border-bottom: 1px solid #C6CED1

.video_list_item:last-child .video_list_item__info
  @include s
    border: none

.info__item
  display: flex
  align-items: center
  gap: 5px
  font-size: 14px

.info__item svg
  max-width: 16px

.video_list__subitem
  display: flex
  flex-direction: column
  margin: -8px -16px 0 -24px

.video_list__close
  position: absolute
  left: -72px
  top: 24px
  height: 48px
  width: 48px
  background-color: var(--color-white)
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  @include xxs
    position: static
    top: 0
    left: 0
    width: auto
    height: auto

  .icon-filter_cross
    width: 20px
    height: 20px

    @include xxs
      width: 16px
      height: 16px
</style>
