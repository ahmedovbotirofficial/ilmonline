<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="first_page_wrapper">
    <div class="container">
      <div class="first_page__row">
        <div class="first_page_column">
          <Heading
            level="1"
            v-html="
              $t(`mainPage.head_title.${getCoursesMode}`, {
                spanColor: MAIN_COLORS[getCoursesMode].text,
              })
            "
          />
          <ButtonBase
            :color="isAuthUser ? 'blue' : 'orange'"
            size="popular"
            class="first_page__sign_in_btn"
            @click.native="isAuthUser ? goToAllLessons() : goToAuth()"
          >
            <span>{{
              isAuthUser
                ? $t(`buttons.go_to_lessons.${getCoursesMode}`)
                : $t('buttons.join_btn')
            }}</span>
          </ButtonBase>
        </div>
        <div class="first_page_column">
          <div class="peoples_animated_circle">
            <div class="the_biggest_circle">
              <div class="dot">
                <div class="pulsating"></div>
                <div class="non-pulsating-circle"></div>
              </div>
              <div class="the_biggest_circle_man">
                <img
                  :src="`/images/${getCoursesMode}/the-biggest-circle-man.png`"
                  alt=""
                />
              </div>
              <div class="women">
                <img
                  :src="`/images/${getCoursesMode}/the-biggest-circle-women.png`"
                  alt=""
                />
              </div>
              <div class="big_circle">
                <div class="dot-first">
                  <div class="pulsating"></div>
                  <div class="non-pulsating-circle"></div>
                </div>
                <div class="dot-second">
                  <div class="pulsating"></div>
                  <div class="non-pulsating-circle"></div>
                </div>
                <div class="big_circle_man">
                  <img
                    :src="`/images/${getCoursesMode}/big-circle-man.png`"
                    alt=""
                  />
                </div>
                <div class="big_circle_women">
                  <img
                    :src="`/images/${getCoursesMode}/big-circle-women.png`"
                    alt=""
                  />
                </div>
                <div class="circle">
                  <div class="dot">
                    <div class="pulsating"></div>
                    <div class="non-pulsating-circle"></div>
                  </div>
                  <div class="circle_women">
                    <img
                      :src="`/images/${getCoursesMode}/circle-women.png`"
                      alt=""
                    />
                  </div>
                  <div class="ornament">
                    <img :src="getImgByRegionData" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="scroll_arrow_down first_page"
        @click="scrollTo(scrollTargetElementId)"
      >
        <svg-icon :name="`main_arrows_scroll_down_${getCoursesMode}`" />
      </div>

      <!--      <div-->
      <!--        v-if="getCoursesMode === COURSES_MODES.SCHOOL"-->
      <!--        id="free_test"-->
      <!--        class="first_page__free_test free_test"-->
      <!--      >-->
      <!--        <div class="free_test__icons_left">-->
      <!--          <svg-icon name="group_free_test_left" />-->
      <!--        </div>-->
      <!--        <div class="free_test__icons_right_top">-->
      <!--          <svg-icon name="group_free_test_right_top" />-->
      <!--        </div>-->
      <!--        <div class="free_test__icons_right_bottom">-->
      <!--          <svg-icon name="group_free_test_right_bottom" />-->
      <!--        </div>-->
      <!--        <h2 class="free_test__title">-->
      <!--          {{ $t('mainPage.free_dtm') }}-->
      <!--        </h2>-->
      <!--        <div class="free_test__text">{{ $t('mainPage.get_result_now') }}</div>-->
      <!--        <ButtonBase-->
      <!--          color="orange"-->
      <!--          size="popular"-->
      <!--          @click.native="$router.push({ name: 'tests-main' })"-->
      <!--          >{{ $t('buttons.go_to_trial_tests') }}-->
      <!--        </ButtonBase>-->
      <!--      </div>-->
    </div>

    <PopularLessons />

    <div class="show_all_lessons_wrapper">
      <ButtonBase
        color="orange"
        size="popular"
        class="show_all_lessons_btn"
        @click.native="goToAllLessons"
        >{{ $t('buttons.show_all_btn') }}</ButtonBase
      >
    </div>

    <div id="why_ilm" class="why_ilm_wrapper">
      <img
        :src="`/images/${getCoursesMode}/group_why_ilm_left.svg`"
        class="why_ilm_left"
      />
      <img
        :src="`/images/${getCoursesMode}/group_why_ilm_right.svg`"
        class="why_ilm_right"
      />
      <div class="container">
        <div class="why_ilm">
          <div class="why_ilm__column">
            <Heading
              level="2"
              v-html="
                $t(`mainPage.why_ilm_title.${getCoursesMode}`, {
                  spanColor: MAIN_COLORS[getCoursesMode].text,
                })
              "
            />
            <div class="why_ilm__subtile">
              {{ $t('mainPage.why_ilm_subtitle') }}
            </div>
          </div>

          <div class="why_ilm__item_wrapper">
            <div
              v-for="{ id, title, content, iconName } in whyIlmList"
              :key="id"
              class="why_ilm__item"
            >
              <div class="why_ilm__item_title">
                <svg-icon :name="iconName" alt="" />
                <Heading level="4"
                  >{{ $t(`whyIlmList.${title}.${getCoursesMode}`) }}
                </Heading>
              </div>
              <div class="why_ilm__item_text">
                {{ $t(`whyIlmList.${content}.${getCoursesMode}`) }}
              </div>
            </div>
          </div>

          <ButtonBase
            :style="isAuthUser ? 'display: none' : ''"
            size="popular"
            color="orange"
            @click.native="goToAuth()"
            >{{ $t('buttons.join_btn') }}</ButtonBase
          >
        </div>
      </div>
    </div>

    <PopularNews @choose-filter="selectFilterNews" />

    <div id="feedback" class="questions__wrapper">
      <div class="container">
        <Heading level="2">{{ $t('mainPage.any_question_title') }}</Heading>
        <div class="questions__row">
          <div>
            <form class="questions_column">
              <TextField
                id="fullName"
                v-model.trim="fullName"
                dark-backgrond
                :value="fullName"
                :error="isFullNameError"
                :error-txt="fullNameErrorText"
                :placeholder="$t('form.short_full_name')"
                type="text"
                name="full_name"
              />
              <TextField
                id="email-id"
                v-model.trim="email"
                dark-backgrond
                :value="email"
                :error="isEmailError"
                :error-txt="emailErrorText"
                :placeholder="'Email'"
                type="text"
                name="email"
              />

              <TextField
                id="userName-id"
                v-model.trim="userName"
                dark-backgrond
                :value="userName"
                :placeholder="$t('mainPage.name_in_messanger')"
                type="text"
                name="userName"
                is-optional-label
              />
              <TextField
                id="userMessage-id"
                v-model.trim="userMessage"
                dark-backgrond
                :value="userMessage"
                :placeholder="$t('mainPage.you_message')"
                type="text"
                name="userMessege"
                :error="isUserMessageError"
                :error-txt="userMessageErrorText"
              />
              <ButtonBase
                color="orange"
                size="popular"
                class="question_btn"
                @click.native="sendFeedbackForm"
                >{{ $t('buttons.send_btn') }}</ButtonBase
              >
            </form>
            <div
              class="send_question__message"
              @click="$router.push({ name: 'policy' })"
              v-html="$t('mainPage.agree_condition')"
            ></div>
          </div>
          <div class="questions_column img-box">
            <img
              :src="`/images/${getCoursesMode}/group_right_news.png`"
              alt=""
              width="540"
              height="526"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { COURSES_MODES, MAIN_COLORS } from '@/types/constants';

import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import PopularLessons from '@/components/PopularLessons/PopularLessons.vue';
import PopularNews from '@/components/PopularNews/PopularNews.vue';
import { mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import TextField from '@/elements/Inputs/TextField.vue';
import feedback from '@/mixins/validation/forms/feedback.js';
import { scrollToBeginForm } from '@/helpers/scroll';

export default {
  components: {
    Heading,
    ButtonBase,
    PopularLessons,
    PopularNews,
    TextField,
  },
  mixins: [feedback],
  validations: {
    email: {
      required,
      email,
    },
    fullName: {
      required,
    },
    userMessage: {
      required,
    },
    userName: {
      required,
    },
  },
  data() {
    return {
      COURSES_MODES,
      MAIN_COLORS,
      isAuthorizated: true,
      latitude: null,
      longitude: null,

      whyIlmList: [
        {
          id: 1,
          title: `title_id_1`,
          iconName: 'why_ilm_img_1',
          content: `content_id_1`,
        },
        {
          id: 2,
          title: `title_id_2`,
          iconName: 'why_ilm_img_2',
          content: `content_id_2`,
        },
        {
          id: 3,
          title: `title_id_3`,
          iconName: 'why_ilm_img_3',
          content: `content_id_3`,
        },
      ],

      selectedFilterNews: 'all',

      fullName: '',
      email: '',
      userName: '',
      userMessage: '',
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getTextMessage',
      'isAuthUser',
      'getImgByRegion',
    ]),
    scrollTargetElementId() {
      // return this.getCoursesMode === COURSES_MODES.SCHOOL
      //   ? 'free_test'
      //   : 'main_lessons';
      return 'main_lessons';
    },
    getEmptyErrorFullName() {
      return !!(this.$v.fullName.$dirty && !this.$v.fullName.required);
    },

    getImgByRegionData() {
      return this.getImgByRegion
        ? this.getImgByRegion
        : 'https://api.ilmonline.uz/storage/1111/img.png';
    },
  },
  async mounted() {
    this.getLocation();
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
        this.position = 'Geolocation is not supported by this browser';
      }
    },
    async showPosition(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      if (this.latitude && this.longitude) {
        await this.$store.dispatch('getImgByLocation', {
          lat: this.latitude,
          lng_lat: this.longitude,
        });
      }
    },
    scrollTo(id) {
      scrollToBeginForm(id);
    },
    async sendFeedbackForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      let userData = {};
      userData.full_name = this.fullName;
      userData.email = this.email;
      userData.messenger_username = this.userName;
      userData.message = this.userMessage;
      await this.$store.dispatch('sendFeedbackForm', userData);

      this.fullName = '';
      this.email = '';
      this.userName = '';
      this.userMessage = '';
      this.$v.$reset();
    },

    selectFilterNews(id) {
      this.selectedFilterNews = id;
    },

    goToAllLessons() {
      this.$router.push({ name: 'courses' });
    },

    goToAuth() {
      if (this.isAuthorizated) {
        this.$router.push({ name: 'sign' });
      } else {
        this.$router.push({ name: 'registration' });
      }
    },
  },
};
</script>

<style lang="sass">
.first_page_wrapper
  overflow: hidden

.first_page__loader
  display: flex
  align-items: center
  height: 100vh

.first_page__row
  display: flex
  margin-bottom: 70px
  justify-content: space-between
  @media only screen and (max-width: 768px)
    flex-direction: column-reverse
    align-items: center
  @include xxs
    padding-top: 30px
    margin-bottom: 30px

.free_test
  position: relative
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  background-color: var(--color-white)
  margin-bottom: 120px
  // overflow: hidden
  height: 374px
  @include s
    height: 340px

  @include xxs
    justify-content: flex-start
    padding: 52px 16px 0
    margin: 0 -14px 40px
  @media screen and (max-width: 400px)

.free_test__icons_left
  position: absolute
  left: 0
  bottom: -26px
  height: 333px
  @include m
    left: -39px
    height: 210px
    bottom: 0
  @include s
    left: -62px
    height: 166px
  @include xxs
    height: 85px
    left: -107px

.free_test__icons_right_top
  position: absolute
  right: -22px
  top: 0px
  height: 120px
  @include m
    height: 63px
    right: -83px
  @include xxs
    height: 35px
    right: -115px

.free_test__icons_right_bottom
  position: absolute
  right: 130px
  width: 235px
  bottom: 0
  @include m
    width: 200px
    right: 100px
  @include s
    right: 45px
    width: 100px
    bottom: -25px
  @include xxs
    right: 30px

.free_test__icons_left svg,
.free_test__icons_right_top svg,
.free_test__icons_right_bottom svg
  max-height: 100%
  max-width: 100%
  height: 100%
  width: 100%

.free_test__title
  font-size: 52px
  margin-bottom: 16px
  @include s
    font-size: 40px
  @include xs
    font-size: 32px
  @include xxs
    font-size: 24px
    max-width: 225px
    text-align: center

.free_test__text
  font-size: 24px
  margin-bottom: 48px
  @include s
    font-size: 18px
    margin-bottom: 40px
  @include xxs
    font-size: 16px

.first_page_column
  display: flex
  flex-direction: column
  @include s
    width: 60%
    align-items: center
    text-align: center

.first_page_column:first-child
  align-self: center
  width: 50%
  @include s
    width: 100%

.pro-courses .first_page_column .title--1
  text-align: left
  @include s
    margin-bottom: 24px !important
  @media screen and (max-width: 768px)
    text-align: center
  @include xs
    align-items: center

.first_page_column .title--1
  margin-bottom: 40px !important
  @include s
    max-width: 500px
  @include xs
    max-width: 575px
  @include xxs
    max-width: 290px

.head_title--orange
  color: var(--color-main)

.first_page_column img
  align-self: center
  max-width: 500px
  @include s
    max-width: 450px
  @include xs
    max-width: 350px
  @include xxs
    max-width: 290px

.first_page__sign_in_btn
  width: max-content
  @include xxs
    width: 100% !important

.show_all_lessons_wrapper
  background-color: var(--color-white)
  padding-bottom: 110px
  display: flex
  @include xxs
    padding: 0 16px
    padding-bottom: 50px

.show_all_lessons_btn
  margin: 0 auto

.scroll_arrow_down.first_page
  @include s
    margin-bottom: 72px

.scroll_arrow_down.first_page svg
  @include s
    max-width: 40px
  @include xs
    max-width: 30px
.pro-courses .v-window__prev button, .pro-courses .v-window__next button
  background-color: var(--color-main)!important
.why_ilm_wrapper
  position: relative

.why_ilm_wrapper .button_wrapper
  margin: 0 auto

.why_ilm
  padding-bottom: 120px
  @include m
    padding-bottom: 85px
  @media screen and (max-width: 1023px)
    padding-bottom: 112px
  @include xxs
    padding-bottom: 52px

.why_ilm .primary-btn
  margin-top: 60px
  @include m
    margin-top: 48px
  @include xxs
    margin-top: 40px

.why_ilm__column
  padding: 120px 0 72px
  @media screen and (max-width: 1045px)
    padding: 80px 0 32px
  @include xxs
    padding: 40px 0

.why_ilm_left
  position: absolute
  left: 67px
  bottom: 50px

.why_ilm_right
  position: absolute
  right: 0
  top: 0

.why_ilm_right,
.why_ilm_left
  @media screen and (max-width: 1023px)
    display: none

.why_ilm__subtile
  max-width: 430px
  margin-top: 16px
  font-size: 18px
  line-height: 26px
  opacity: 0.8

.why_ilm__item_wrapper
  display: flex
  justify-content: space-between
  column-gap: 2%
  @media screen and (max-width: 1023px)
    display: grid
    column-gap: 6%
    grid-template-columns: 1fr 1fr
    grid-template-rows: 1fr 1fr
    row-gap: 60px
  @include s
    column-gap: 20px
    row-gap: 20px
  @media screen and (max-width: 710px)
    grid-template-columns: 1fr
    grid-template-rows: 1fr

.why_ilm__item
  width: 32%
  min-height: 277px
  @include l
    width: auto

.why_ilm__item
  display: flex
  flex-direction: column
  // align-items: center
  background-color: var(--color-white)
  width: 100%
  min-height: 300px
  padding: 32px 26px
  max-width: 375px
  border: 2px solid #EBFBEC
  box-shadow: 0px 4px 32px rgba(231, 231, 231, 0.64)
  z-index: 2
  @include s
    padding: 25px 24px
  @media screen and (max-width: 710px)
    max-width: 100%
    align-items: flex-start

.why_ilm__item:first-child
  @include l
    justify-self: end

.why_ilm__item:last-child
  @include l
    grid-column: 1/-1
    justify-self: center
    max-width: 375px
  @media screen and (max-width: 710px)
    max-width: 100%

.why_ilm__item_title .title
  @media screen and (max-width: 1300px)
    font-size: 15px
    line-height: 24px

.why_ilm__item_title svg
  max-width: 80px
  max-height: 80px
  @media screen and (max-width: 1300px)
    max-width: 60px
    max-height: 60px

.why_ilm__item_title
  display: flex
  // flex-wrap: wrap
  gap: 12px
  align-items: center
  margin-bottom: 24px

.why_ilm__item_title .title--4
  font-size: 22px
  margin-bottom: 0
  @media screen and (max-width: 1045px)
    font-size: 16px
    line-height: 20px
  @include ll
    font-size: 20px
  @include xs
    font-size: 18px

.why_ilm__item img
  width: 80px
  height: 80px
  @media screen and (max-width: 1045px)
    width: 52px
    height: 52px

.why_ilm__item_text
  font-size: 18px
  line-height: 24px
  font-weight: 300
  @include s
    font-size: 16px

.questions__wrapper
  position: relative
  padding-top: 84px
  margin-bottom: 150px
  @include s
    padding-top: 100px
  @include xs
    margin-bottom: 45px
  @include xxs
    padding-top: 70px

.questions__wrapper .title--2
  @include l
    margin-bottom: 50px

.questions__row
  display: flex
  justify-content: space-between
  align-items: center
  @include l
    gap: 50px

  @include s
    flex-direction: column-reverse
    align-items: normal

.pro-courses .questions__row
  @media only screen and (max-width: 768px)
    flex-direction: column-reverse

.pro-courses .container .title--1
  @include xs
  padding-top: 0

.container .title--1
  margin-bottom: 15px
  padding-top: 73px
  @include xxs
    padding-top: 0

.questions_column
  @include s
    width: 90%
  @include xs
    width: 100%

.pro-courses .questions_column
  @include s
    width: auto
  @include xs
  max-width: 594px

.questions_column.img-box
  @include xxs
    text-align: center

.questions_column img
  max-width: 540px
  @include m
    max-width: 400px
  @include xxs
    max-width: 290px
    margin: 0 auto
    display: block

.questions_column:last-child
  @include l

.questions_column:first-child
  display: flex
  flex-direction: column
  gap: 30px

.question_btn
  margin-bottom: 20px
  @include xxs
    width: 100% !important
.send_question__message
  @include s
    margin-top: 24px
  @include xxs
    font-size: 14px

.send_question__message--active
  text-decoration: underline
  cursor: pointer
  position: relative
.send_question__message--active:hover
  color: var(--color-main)

.fill-height
  margin: 0 !important

.peoples_animated_circle
  @include xxs
    height: 325px
    display: flex
    align-items: center
.pro-courses .peoples_animated_circle
  @include xs
    transform: scale(0.95)
.the_biggest_circle
  margin-top: 25px
  width: 496px
  height: 496px
  border-radius: 496px
  border: 1px solid var(--color-circle-lines)
  position: relative
  @media screen and (max-width: 1045px)
    transform: scale(0.8)
  @include xxs
    margin-top: 0
    transform: scale(0.65)
  @media screen and (max-width: 350px)
    transform: scale(0.5)
  .dot
    width: 18px
    height: 18px
    position: absolute
    top: 239px
    left: 239px
    transform: rotate(0deg)
    animation: the-biggest-orbit 120s linear infinite
    .non-pulsating-circle
      width: 18px
      height: 18px
      background-color: var(--color-circle-dots)
      border-radius: 50%
      position: absolute
    .pulsating
      border: 3px solid var(--box-shadow-color)
      -webkit-border-radius: 30px
      height: 22px
      width: 22px
      position: absolute
      -webkit-animation: pulsate 1s ease-out
      -webkit-animation-iteration-count: infinite
      opacity: 0.0
      top: -2px
      left: -2px
  &_man
    width: 64px
    height: 64px
    position: absolute
    top: 216px
    left: 216px
    transform: rotate(0deg)
    animation: the-biggest-orbit-man 260s linear infinite
    img
      width: 64px
      height: 64px

  .women
    width: 64px
    height: 64px
    position: absolute
    top: 216px
    left: 216px
    transform: rotate(0deg)
    animation: the-biggest-orbit-women 200s linear infinite
    img
      width: 64px
      height: 64px

.big_circle
  width: 380px
  height: 380px
  border-radius: 380px
  border: 1px solid var(--color-circle-lines)
  position: absolute
  top: 58px
  left: 58px
  .dot-first
    width: 11px
    height: 11px
    position: absolute
    top: 184px
    left: 184px
    animation: big-circle-orbit 120s linear infinite
    .non-pulsating-circle
      width: 11px
      height: 11px
      background-color: var(--color-circle-dots)
      border-radius: 50%
      position: absolute
    .pulsating
      border: 3px solid var(--box-shadow-color)
      -webkit-border-radius: 30px
      height: 15px
      width: 15px
      position: absolute
      -webkit-animation: pulsate 1s ease-out
      -webkit-animation-iteration-count: infinite
      opacity: 0.0
      top: -2px
      left: -2px
  .dot-second
    width: 11px
    height: 11px
    position: absolute
    top: 184px
    left: 184px
    transform: rotate(0deg)
    animation: big-circle-orbit-second 120s linear infinite
    .non-pulsating-circle
      width: 11px
      height: 11px
      background-color: var(--color-circle-dots)
      border-radius: 50%
      position: absolute
    .pulsating
      border: 3px solid var(--box-shadow-color)
      -webkit-border-radius: 30px
      height: 15px
      width: 15px
      position: absolute
      -webkit-animation: pulsate 1s ease-out
      -webkit-animation-iteration-count: infinite
      opacity: 0.0
      top: -2px
      left: -2px
  &_man
    width: 64px
    height: 64px
    position: absolute
    top: 158px
    left: 158px
    transform: rotate(0deg)
    animation: big-circle-orbit-man 150s linear infinite
    img
      width: 64px
      height: 64px
  &_women
    width: 64px
    height: 64px
    position: absolute
    top: 158px
    left: 158px
    transform: rotate(0deg)
    animation: big-circle-orbit-women 200s linear infinite
    img
      width: 64px
      height: 64px

.circle
  width: 244px
  height: 244px
  border-radius: 50%
  border: 1px solid var(--color-circle-lines)
  position: absolute
  top: 68px
  left: 68px
  .dot
    width: 6px
    height: 6px
    position: absolute
    top: 118px
    left: 118px
    transform: rotate(0deg)
    animation: circle-orbit 60s linear infinite
    .non-pulsating-circle
      width: 6px
      height: 6px
      background-color: var(--color-circle-dots)
      border-radius: 50%
      position: absolute
    .pulsating
      border: 3px solid var(--box-shadow-color)
      -webkit-border-radius: 30px
      height: 10px
      width: 10px
      position: absolute
      -webkit-animation: pulsate 1s ease-out
      -webkit-animation-iteration-count: infinite
      opacity: 0.0
      top: -2px
      left: -2px
  &_women
    width: 64px
    height: 64px
    position: absolute
    top: 90px
    left: 90px
    transform: rotate(0deg)
    animation: circle-orbit-women 200s linear infinite
    img
      width: 64px
      height: 64px
  .ornament
    width: 164px
    height: 164px
    top: 41px
    left: 41px
    position: absolute
    img
      width: 100%
      height: 100%

@keyframes the-biggest-orbit
  from
    transform: rotate(120deg) translateX(247px) rotate(-120deg)
  to
    transform: rotate(-120deg) translateX(247px) rotate(120deg)

@keyframes the-biggest-orbit-man
  from
    transform: rotate(360deg) translateX(248px) rotate(-360deg)
  to
    transform: rotate(-360deg) translateX(248px) rotate(360deg)

@keyframes the-biggest-orbit-women
  from
    transform: rotate(240deg) translateX(248px) rotate(-240deg)
  to
    transform: rotate(-240deg) translateX(248px) rotate(240deg)

@keyframes big-circle-orbit
  from
    transform: rotate(-80deg) translateX(190px) rotate(80deg)
  to
    transform: rotate(80deg) translateX(190px) rotate(-80deg)

@keyframes big-circle-orbit-second
  from
    transform: rotate(-260deg) translateX(190px) rotate(260deg)
  to
    transform: rotate(260deg) translateX(190px) rotate(-260deg)

@keyframes big-circle-orbit-man
  from
    transform: rotate(0deg) translateX(190px) rotate(0deg)
  to
    transform: rotate(360deg) translateX(190px) rotate(-360deg)

@keyframes big-circle-orbit-women
  from
    transform: rotate(-160deg) translateX(190px) rotate(160deg)
  to
    transform: rotate(160deg) translateX(190px) rotate(-160deg)

@keyframes circle-orbit
  from
    transform: rotate(-80deg) translateX(122px) rotate(80deg)
  to
    transform: rotate(80deg) translateX(122px) rotate(-80deg)

@keyframes circle-orbit-women
  from
    transform: rotate(-260deg) translateX(122px) rotate(260deg)
  to
    transform: rotate(260deg) translateX(122px) rotate(-260deg)

@keyframes pulsate
  0%
    webkit-transform: scale(0.1, 0.1)
    opacity: 0.0
  50%
    opacity: 1.0
  100%
    -webkit-transform: scale(1.2, 1.2)
    opacity: 0.0
</style>
