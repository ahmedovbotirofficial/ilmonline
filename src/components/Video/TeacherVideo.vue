<!--<template>-->
<!--  <div class="video_page">-->
<!--    <div v-if="!!getMyProgressOfCourse" class="video_page__container">-->
<!--      <div class="video_page__left">-->
<!--        <div class="video_info__top">-->
<!--          <div class="container">-->
<!--            <div class="video_info__top_inner">-->
<!--              <Heading level="4" class="video_info__title">{{-->
<!--                currentChapterTitle-->
<!--              }}</Heading>-->
<!--              <ButtonBase-->
<!--                icon-name="arrow_back"-->
<!--                color="orange"-->
<!--                size="m"-->
<!--                @click.native.stop="toggleVideoList"-->
<!--              >-->
<!--                {{ $t('buttons.lesson_content') }}-->
<!--              </ButtonBase>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <VideoPlayer-->
<!--          :src="src"-->
<!--          :lesson-id="startLessonId"-->
<!--          :lesson-duration="lessonDuration"-->
<!--          :lesson-current-time-video="lessonCurrentTimeVideo"-->
<!--        />-->

<!--        <div>-->
<!--          <div class="video_info">-->
<!--            <div class="video_info__row">-->
<!--              <Heading level="4" class="video_info__title">{{-->
<!--                currentChapterTitle-->
<!--              }}</Heading>-->
<!--              <div class="video_info__star" @click="openModalRateIt">-->
<!--                <svg-icon name="video_star" />-->
<!--                {{ $t('buttons.rate_it') }}-->
<!--              </div>-->
<!--              <div class="video_info__author">-->
<!--                <div class="author_img">-->
<!--                  <img :src="currentCourseData.author.profile_photo" />-->
<!--                </div>-->
<!--                <div class="author_info">-->
<!--                  <div class="author_info__name">-->
<!--                    {{ currentCourseData.author.full_name }}-->
<!--                  </div>-->
<!--                  <div class="author_info__date">-->
<!--                    Опубликовано-->
<!--                    {{ normalizeStartDate(currentCourseData.created_at) }}-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div v-if="getMyProgressOfCourse" class="video_info__progress">-->
<!--                <vue-ellipse-progress-->
<!--                  :progress="+getMyProgressOfCourse.grade"-->
<!--                  color="#EC5239"-->
<!--                  empty-color="#EC5239"-->
<!--                  line="butt"-->
<!--                  line-mode="in 3"-->
<!--                  :size="20"-->
<!--                  :thickness="6.3"-->
<!--                  :legend="false"-->
<!--                />-->
<!--                {{ $t('courses.progress') }}-->
<!--                {{ getMyProgressOfCourse.grade }}%-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="video_description">-->
<!--              <Heading level="4" class="description__title">-->
<!--                {{ currentTitleOfVideo }}-->
<!--              </Heading>-->

<!--              <div class="video_description__info">-->
<!--                {{ currentLessonDescription }}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      &lt;!&ndash; video_page__right_part START&ndash;&gt;-->
<!--      &lt;!&ndash; video_page__right_part END &ndash;&gt;-->
<!--    </div>-->
<!--    <div v-else class="loader_page">-->
<!--      <Loader color="orange" />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import VideoPlayer from '@/components/Video/VideoPlayer.vue';-->
<!--import Heading from '@/elements/Heading/Heading.vue';-->
<!--import Loader from '@/elements/Loader/Loader.vue';-->
<!--import ButtonBase from '@/elements/Buttons/ButtonBase.vue';-->
<!--import moment from 'moment';-->

<!--import { getFromLS } from '@/library/helpers';-->

<!--import { calcTimeHHMMSS } from '@/helpers/time';-->
<!--import { mapGetters } from 'vuex';-->

<!--export default {-->
<!--  components: {-->
<!--    VideoPlayer,-->
<!--    Heading,-->
<!--    Loader,-->
<!--    ButtonBase,-->
<!--  },-->

<!--  computed: {-->
<!--    ...mapGetters(['getMyProgressOfCourse', 'getSeledtedLanguage']),-->
<!--  },-->

<!--  data() {-->
<!--    return {-->
<!--      src: process.env.VUE_APP_API_HOST + '/api/profile/courses/lesson/',-->

<!--      userToken: null,-->

<!--      currentCourseData: [],-->

<!--      currentTitleOfVideo: null,-->
<!--      currentChapterTitle: null,-->
<!--      currentLessonDescription: null,-->
<!--      startLessonId: null,-->
<!--      lessonDuration: null,-->
<!--      lessonCurrentTimeVideo: null,-->

<!--      firstIdLesson: null,-->
<!--    };-->
<!--  },-->

<!--  watch: {-->
<!--    getSeledtedLanguage(value) {-->
<!--      value && this.fetchCurrentCourseData();-->
<!--    },-->
<!--  },-->

<!--  async created() {-->
<!--    await this.fetchCurrentCourseData();-->
<!--    // console.log('this.getMyProgressOfCourse', this.getMyProgressOfCourse);-->
<!--  },-->

<!--  mounted() {-->
<!--    this.checkToken();-->
<!--    this.fetchStudentsCourseProgress();-->
<!--    // console.log(this.$route.params);-->
<!--    // console.log(this.$route);-->
<!--  },-->

<!--  methods: {-->
<!--    async startCourse() {-->
<!--      let response = await this.$store.dispatch('startCourse', {-->
<!--        course_id: this.$route.params.course_id,-->
<!--      });-->

<!--      // console.log('response <<< start course', response);-->
<!--    },-->

<!--    watchedVideo(lessonId) {-->
<!--      if (lessonId) {-->
<!--        let res = this.getMyProgressOfCourse.lessonProgress.find(-->
<!--          (el) => el.lesson_id === lessonId-->
<!--        );-->
<!--        if (res && res.viewed_video) {-->
<!--          return 'video_watched';-->
<!--        } else {-->
<!--          return 'video_play';-->
<!--        }-->
<!--      }-->
<!--      return 'video_play';-->
<!--    },-->

<!--    async fetchStudentsCourseProgress(id) {-->
<!--      await this.$store.dispatch('getStudentsCourseProgress', id);-->

<!--      this.lessonCurrentTimeVideo =-->
<!--        this.getMyProgressOfCourse.lessonProgress?.find(-->
<!--          (el) => el.lesson_id === +this.$route.params.lesson_id-->
<!--        );-->
<!--      !!this.lessonCurrentTimeVideo-->
<!--        ? (this.lessonCurrentTimeVideo =-->
<!--            this.lessonCurrentTimeVideo.video_minute_stop)-->
<!--        : (this.lessonCurrentTimeVideo = 0);-->
<!--    },-->

<!--    checkToken() {-->
<!--      this.userToken = getFromLS('token');-->
<!--    },-->

<!--    normalizeStartDate(date) {-->
<!--      return moment(date, 'YYYY-MM-DD').locale('ru').format('ll');-->
<!--    },-->

<!--    async fetchCurrentCourseData() {-->
<!--      this.currentCourseData = await this.$store.dispatch(-->
<!--        'getCurrentCourseData',-->
<!--        this.$route.params.course_id-->
<!--      );-->
<!--    },-->

<!--    fetchVideo(id) {-->
<!--      this.src =-->
<!--        process.env.VUE_APP_API_HOST +-->
<!--        '/api/profile/courses/lesson/' +-->
<!--        `${id}/video?token=${this.userToken}`;-->
<!--    },-->

<!--    playSelectedLessonVideo(-->
<!--      id,-->
<!--      titleOfChapter,-->
<!--      titleOfLesson,-->
<!--      lessonDescription,-->
<!--      lessonDuration,-->
<!--      has_lesson_access-->
<!--    ) {-->
<!--      if (has_lesson_access) {-->
<!--        this.currentChapterTitle = titleOfChapter;-->
<!--        this.currentTitleOfVideo = titleOfLesson;-->
<!--        this.currentLessonDescription = lessonDescription;-->
<!--        this.lessonDuration = lessonDuration;-->

<!--        this.startLessonId = id;-->

<!--        this.startLesson();-->
<!--        // console.log('>>> play video link', id);-->
<!--      } else {-->
<!--        return;-->
<!--      }-->
<!--    },-->

<!--    async startLesson() {-->
<!--      this.$router.push({-->
<!--        name: 'video',-->
<!--        params: { lesson_id: this.startLessonId },-->
<!--      });-->
<!--      let res = await this.$store.dispatch('startLesson', {-->
<!--        course_id: this.$route.params.course_id,-->
<!--        lesson_id: this.startLessonId,-->
<!--      });-->

<!--      if (!!res.coureProgress) {-->
<!--        // console.log('choosen started lesson', res);-->
<!--        this.fetchVideo(this.startLessonId);-->
<!--      } else if (-->
<!--        (!!res.lesson_id &&-->
<!--          res.lesson_id[0] === 'User already beginning lesson') ||-->
<!--        !res.lesson_id[0].includes('Student does not passed previous lesson')-->
<!--      ) {-->
<!--        // console.log('choosen started lesson', res.lesson_id);-->
<!--        this.fetchVideo(this.startLessonId);-->
<!--      } else {-->
<!--        this.fetchVideo(this.startLessonId);-->
<!--        this.$router.push({-->
<!--          name: 'video',-->
<!--          params: {-->
<!--            lesson_id: this.startLessonId,-->
<!--          },-->
<!--        });-->
<!--      }-->
<!--    },-->

<!--    openModalRateIt() {-->
<!--      this.$store.commit('SET_MODAL', {-->
<!--        state: true,-->
<!--        name: `rate`,-->
<!--        props: this.currentCourseData.title,-->
<!--      });-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style lang="sass">-->
<!--.vjs-big-play-button-->
<!--  top: 50% !important-->
<!--  left: 50% !important-->
<!--  transform: translate(-50%, -50%)-->

<!--.video_page-->

<!--.video_page__left-->
<!--  display: flex-->
<!--  flex-direction: column-->
<!--  width: 100%-->

<!--.video_page__container-->
<!--  display: flex-->
<!--  max-width: 1440px-->
<!--  // padding-right: 80px-->
<!--  padding-left: 80px-->
<!--  margin-right: auto-->
<!--  margin-left: auto-->
<!--  @include s-->
<!--    padding-left: 0-->
<!--    flex-wrap: wrap-->
<!--    margin-bottom: 90px-->

<!--.video_info__top-->
<!--  padding: 32px 0-->
<!--  display: none-->
<!--  @include s-->
<!--    display: block-->

<!--  @include xxs-->
<!--    padding: 24px 0-->

<!--.video_info__top_inner-->
<!--  display: flex-->
<!--  justify-content: space-between-->
<!--  align-items: center-->
<!--  gap: 30px-->
<!--  @include xs-->
<!--    flex-direction: column-->
<!--    gap: 24px-->

<!--.video_info__top .title-->
<!--  margin-bottom: 0-->
<!--  text-align: left-->
<!--  @include adaptive-font-size(28, 28, 24)-->
<!--  @include adaptive-line-height(35, 35, 30)-->
<!--  @include xxs-->
<!--    width: 100%-->

<!--.video_info__top .primary-btn-->
<!--  flex: 0 0 215px-->
<!--  @include xxs-->
<!--    flex: 0 0 auto-->

<!--  @include s-->
<!--    position: absolute-->
<!--    top: 0-->
<!--    right: 0-->
<!--    width: 100%-->
<!--    height: max-content-->
<!--    min-height: 100%-->
<!--    max-width: 358px-->
<!--    transform: translateX(100%)-->
<!--    background: var(&#45;&#45;color-white)-->
<!--    transition: transform 1s cubic-bezier(0.86, 0, 0.07, 1)-->

<!--  @include xxs-->
<!--    max-width: 100%-->

<!--  .icon-filter_cross-->
<!--    width: 20px-->
<!--    height: 20px-->

<!--    @include xxs-->
<!--      width: 16px-->
<!--      height: 16px-->

<!--.video_info-->
<!--  display: flex-->
<!--  flex-direction: column-->
<!--  padding-top: 32px-->
<!--  margin-bottom: 100px-->
<!--  @include s-->
<!--    margin-bottom: 20px-->

<!--  @include xxs-->
<!--    padding-top: 26px-->

<!--.video_info__row-->
<!--  display: grid-->
<!--  grid-template-columns: 2fr 1fr-->

<!--  @include xs-->
<!--    grid-template-columns: 1fr 1fr-->

<!--.video_info__row-->
<!--  padding-bottom: 24px-->
<!--  margin-bottom: 24px-->
<!--  border-bottom: 1px solid var(&#45;&#45;border-color)-->
<!--  margin-right: 28px-->

<!--.video_info__row .video_info__title-->
<!--  @include adaptive-font-size(28, 28, 24)-->
<!--  @include adaptive-line-height(35, 35, 30)-->

<!--  @include s-->
<!--    display: none-->

<!--.video_info__star-->
<!--  cursor: pointer-->
<!--  font-weight: bold-->
<!--  margin-bottom: 24px-->

<!--  @include xs-->
<!--    grid-column: 2/3-->
<!--    margin-bottom: 0-->

<!--.video_info__author-->
<!--  display: flex-->
<!--  align-items: center-->
<!--  gap: 16px-->

<!--  @include s-->
<!--    grid-row: 1/-1-->

<!--  @include xs-->
<!--    grid-row: 1/2-->
<!--    grid-column: 1/-1-->
<!--    margin-bottom: 26px-->

<!--.author_info__date-->
<!--  @include adaptive-font-size(16, 16, 14)-->
<!--  @include adaptive-line-height(20, 20, 18)-->

<!--.author_info__name-->
<!--  @include adaptive-font-size(24, 24, 20)-->
<!--  @include adaptive-line-height(30, 25, 25)-->
<!--  font-weight: bold-->
<!--  padding-bottom: 4px-->

<!--.author_img-->
<!--  border-radius: 50%-->
<!--  overflow: hidden-->
<!--  flex: 0 0 54px-->
<!--  height: 54px-->

<!--  @include xxs-->
<!--    flex: 0 0 40px-->
<!--    height: 40px-->

<!--.author_img img-->
<!--  width: 100%-->
<!--  height: 100%-->
<!--  object-fit: cover-->

<!--.video_info__star,-->
<!--.video_info__progress-->
<!--  display: flex-->
<!--  grid-gap: 10px-->
<!--  align-items: center-->
<!--  justify-content: flex-end-->
<!--  font-size: 16px-->
<!--  line-height: 20px-->

<!--.video_info__progress-->
<!--  @include s-->
<!--    grid-column: 2/3-->

<!--  @include xs-->
<!--    grid-column: 1/2-->
<!--    grid-row: 2/3-->
<!--    justify-content: flex-start-->

<!--.video_info__progress svg-->
<!--  max-width: 20px-->

<!--.video_description .title-->
<!--  @include adaptive-font-size(24, 24, 20)-->
<!--  @include adaptive-line-height(32, 32, 24)-->
<!--  margin-bottom: 12px-->

<!--.video_description__info-->
<!--  @include adaptive-font-size(18, 18, 16)-->
<!--  @include adaptive-line-height(26, 26, 23)-->
<!--  width: 68%-->

<!--  @include s-->
<!--    width: 100%-->

<!--.info__item-->
<!--  display: flex-->
<!--  align-items: center-->
<!--  gap: 5px-->
<!--  font-size: 14px-->

<!--.info__item svg-->
<!--  max-width: 16px-->

<!--.subitem__lesson.selected-->
<!--  background-color: #FDF6F4-->

<!--.icon-icon_arrow_back-->
<!--  width: 8px-->
<!--  height: 12px-->
<!--</style>-->
