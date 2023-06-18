<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="about_us_page_wrapper">
    <div class="container">
      <div class="about_us__row">
        <div class="about_us__column">
          <Heading
            level="3"
            v-html="
              $t(`aboutUs.head_title.${getCoursesMode}`, {
                spanColor: MAIN_COLORS[getCoursesMode].text,
              })
            "
          />
          <ButtonBase
            color="orange"
            size="popular"
            class="auth_form__sign_in_btn"
            @click.native="goToAuth()"
            >{{ $t('buttons.join_btn') }}
          </ButtonBase>
        </div>
        <div class="about_us__column">
          <div class="gradient">
            <img
              :src="`/images/${getCoursesMode}/about_us_head.png`"
              width="433"
              height="433"
              alt=""
            />
            <img
              class="gradient__circles"
              src="@/assets/images/about_us_head_circles.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <div class="course_wrapper">
      <div class="container">
        <div class="course top_block">
          <div class="course__column course__left">
            <img
              :src="`/images/${getCoursesMode}/about_us_course.png`"
              alt=""
            />
          </div>

          <Heading level="3">{{ $t('aboutUs.course_title') }}</Heading>
          <div
            class="course__text"
            v-html="$t(`aboutUs.course_describe.${getCoursesMode}`)"
          ></div>
          <div
            class="course__text second_part"
            v-html="
              $t(`aboutUs.course_describe_part_second.${getCoursesMode}`, {
                spanColor: MAIN_COLORS[getCoursesMode].button,
              })
            "
          ></div>
        </div>
      </div>
    </div>

    <div class="instruments_wrapper">
      <div class="container">
        <div class="instruments">
          <div class="instruments__row">
            <div class="instruments__column block_info">
              <Heading
                level="3"
                v-html="
                  $t(`aboutUs.instruments_title.${getCoursesMode}`, {
                    spanColor: MAIN_COLORS[getCoursesMode].text,
                  })
                "
              />
              <div
                class="instruments__text"
                v-html="$t(`aboutUs.instruments_describe.${getCoursesMode}`)"
              ></div>
            </div>
            <div class="instruments__column">
              <img
                class="instruements__img"
                :src="`/images/${getCoursesMode}/about_us_instruments.png`"
                alt=""
              />
            </div>
          </div>
          <div class="instruments__column joining">
            <div class="instruments__joining_wrapper">
              <div class="instruments__joining">
                <Heading level="3">{{
                  $t('aboutUs.join_to_glabal_class')
                }}</Heading>
                <div class="instruments_joining__text">
                  <p
                    v-html="
                      $t(`aboutUs.instruments_joining_text.${getCoursesMode}`, {
                        spanColor: MAIN_COLORS[getCoursesMode].button,
                      })
                    "
                  ></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="businnes_wrapper">
      <div class="container">
        <div class="course businnes">
          <div class="businnes__img course__column">
            <img
              :src="`/images/${getCoursesMode}/about_us_command.png`"
              alt=""
            />
          </div>
          <Heading level="3" class="businnes__title">
            {{ $t('aboutUs.from_modest_to_cool_command') }}</Heading
          >
          <div
            class="businnes__text"
            v-html="
              $t(`aboutUs.we_are_progressive_command.${getCoursesMode}`, {
                spanColor: MAIN_COLORS[getCoursesMode].button,
              })
            "
          ></div>
          <div class="businnes__text_second">
            {{ $t('aboutUs.we_are_progrmmists') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { MAIN_COLORS } from '@/types/constants';

import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import PopularLessons from '@/components/PopularLessons/PopularLessons.vue';
import PopularNews from '@/components/PopularNews/PopularNews.vue';
// import LessonCard from '@/components/LessonCard/LessonCard.vue';
import TextField from '@/elements/Inputs/TextField.vue';

// import VueI18n from '../../i18n';

export default {
  components: {
    Heading,
    ButtonBase,
  },
  data() {
    return {
      MAIN_COLORS,
      isAuthorizated: true,
    };
  },
  computed: {
    ...mapGetters(['getCoursesMode']),
  },
  mounted() {},
  methods: {
    goToAuth() {
      this.$router.push({ name: 'sign' });
    },
  },
};
</script>

<style lang="sass" scoped>
.about_us__row
  display: flex
  margin-bottom: 195px
  margin-top: 50px
  @include s
    margin-bottom: 105px
    flex-direction: column-reverse
    align-items: center
    gap: 150px
  @include xxs
    gap: 0
    margin-bottom: 70px

.about_us__column
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  width: 50%
  position: relative
  @include s
    width: 100%

.head_title--orange
  color: var(--color-main)

.about_us__column img
  align-self: center
  max-width: 433px
  z-index: 1
  @include s
    max-width: 360px
  @include xxs
    max-width: 190px

.about_us__column .title--3
  margin-bottom: 46px
  @include s
    text-align: center
  @include xxs
    font-size: 24px
    line-height: 32px
    margin-bottom: 24px

.gradient
  position: relative
  display: flex
  align-items: center
  justify-content: center
  width: 433px
  @include s
    max-width: 100%
  @include xxs
    margin-bottom: 80px

.gradient__circles
  position: absolute
  top: -98px
  max-width: 272px !important
  @include xxs
    max-width: 125px !important
    top: -45px
    right: 48%
    transform: translateX(50%)

.about_us_page_wrapper
  max-width: 100%
.gradient::after
  content: ''
  position: absolute
  right: 0px
  bottom: -105px
  height: 433px
  width: 433px
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 23%, var(--color-white) 100%)
  border-radius: 0% 0% 50% 50%
  @include s
    right: 30px
    bottom: -80px
    height: 400px
    width: 368px
  @include xxs
    right: 50%
    bottom: -40px
    height: 200px
    width: 190px
    transform: translateX(50%)

.auth_form__sign_in_btn
  align-self: flex-start
  @include s
    align-self: center
  @include xxs
    width: 100%

.course_wrapper
  background-color: var(--color-white)
  padding: 100px 0
  @include xs
    padding: 70px 0
  @include xxs
    padding: 50px 0

.course__left img
  @include s
    max-height: 305px
  @include xs
    max-width: 300px
    max-height: 336px
  @include xxs
    margin-bottom: 10px

.course
  display: grid
  grid-template-columns: 1fr 1fr
  grid-template-rows: 200px 0.5fr 1fr
  column-gap: 50px
  @include s
    grid-template-rows: 160px 1fr 0.5fr
  @include xs
    grid-template-rows: 100px 1fr 1fr

.top_block
  @include xs
    display: contents

.businnes
  grid-template-columns: 1fr 1fr
  column-gap: 30px
  grid-template-rows: 190px 1fr 1.5fr
  @include m
    grid-template-rows: 195px 1fr 1fr
  @include s
    grid-template-columns: .5fr 1fr
    grid-template-rows: 125px 1fr
    row-gap: 0
  @include xs
    grid-template-columns: .5fr 1fr
    grid-template-rows: 80px .5fr .5fr
    row-gap: 10px
    column-gap: 20px
  @include xxs
    grid-template-columns: 1fr
    grid-template-rows: auto auto 1fr 1fr
  //@include xxxs
  //  grid-template-rows: 2fr 65px .5fr 1fr

.course__text,
.instruments__text,
.instruments__text p,
.instruments_joining__text p
  font-size: 18px
  line-height: 26px
  @include s
    align-self: center
    font-size: 16px
    line-height: 24px
    grid-column: 2/3
  @include xs
    margin: 15px 0
  @include xxs
    padding-top: 10px
    font-size: 15px
    line-height: 18px

.second_part
  padding-top: 20px
  @include s
    font-size: 16px
    line-height: 24px
    padding-top: 0px
  @include xxs
    font-size: 15px
    line-height: 18px
    width: 95%

.businnes__text_second
  font-size: 18px
  line-height: 26px
  grid-row: 3/4
  grid-column: 2/3
  @include s
    font-size: 16px
    line-height: 24px
  @include xxs
    grid-column: 1/-1
    grid-row: 4/5
    font-size: 15px
    line-height: 18px

.businnes__img
  margin-left: -80px
  @include xxs
    margin-left: -20px

.course__column
  grid-row: 1/-1
  z-index: 3
  @include s
    grid-row: 1/2
    margin-bottom: 20px
  @include xs
    margin-bottom: 40px

.course__column .title.title--3
  padding-top: 0
  margin-bottom: 40px

.title--3
  @include s
    font-size: 40px
  @include xs
    font-size: 26px
    line-height: 30px
    margin-bottom: 30px
  @include xxs
    font-size: 24px

.instruments
  display: flex
  flex-direction: column

.instruments__row
  display: flex
  gap: 100px
  margin: 100px 0
  @include s
    gap: 50px
    margin: 60px 0
  @include xs
    gap: 0
  @include xxs
    flex-direction: column-reverse
    margin-top: 20px

.instruments__column
  // width: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  @include s
    display: inline
    align-self: center

.joining
  margin: 100px 0
  width: 100%
  @include xs
    margin: 0

.block_info
  @include s
    width: 65%
  @include xxs
    width: 100%

.instruments__column .title--3
  margin-bottom: 40px
  @include s
    font-size: 26px
    min-width: 515px
  @include xs
    min-width: 0px
  @include xxs
    min-width: 200px
    margin: 10px 0

.block_info .title--3
  @include s
    font-size: 40px
    min-width: 690px
  @include xs
    min-width: 500px
    font-size: 26px
    line-height: 30px
    max-width: 645px
  @include xxs
    font-size: 24px
    min-width: 275px

.instruements__img
  max-width: 547px
  @include m
    max-width: 450px
  @include s
    max-width: 230px
  @include xs
    max-width: 180px
    margin-top: 88px
  @include xxs
    margin-top: 0

.instruments__joining_wrapper
  max-width: 1140px
  padding: 39px 34px 45px
  z-index: 10
  @include s
    padding: 25px 25px 25px
  @include xxs
    padding: 16px 16px 16px
    margin: 20px 0

.school-courses
  .instruments__joining_wrapper
    background-color: rgba(234, 219, 214, 0.5)

.pro-courses
  .instruments__joining_wrapper
    background-color: #DBECFF

.instruments__joining
  position: relative
  padding: 40px 100px
  width: 100%
  height: 100%
  background-color: var(--color-white)
  z-index: 10
  @include s
    padding: 40px 45px
  @include xxs
    padding: 24px 15px

.instruments__joining::after,
.instruments__joining::before
  position: absolute
  content: ''
  background: transparent
  border-style: solid
  border-radius: 50%
  z-index: -1

.instruments__joining::after
  bottom: -75px
  right: -75px
  border-color: #FA743A
  border-width: 75px
  border-left-color: transparent
  transform: rotate(45deg)
  @include s
    border-width: 40px
    bottom: -40px
    right: -40px
  @include xxs
    border-width: 20px
    bottom: -20px
    right: -20px

.instruments__joining::before
  top: -23px
  left: -23px
  border-color: var(--btn-color-blue-dark)
  border-width: 23px
  border-left-color: transparent
  transform: rotate(-135deg)
  @include s
    border-width: 18px
    top: -18px
    left: -18px
  @include xxs
    border-width: 5px
    top: -4px
    left: -5px

.instruments__joining .title--3
  text-align: center
  margin-top: 0
  margin-bottom: 24px
  @include s
    font-size: 26px
    line-height: 32px
    margin-bottom: 8px
  @include xs
    font-size: 24px
    line-height: 25px
  @include xxs
    text-align: start

.instruments_joining__text p
  max-width: 730px
  text-align: center
  margin: 0 auto
  @include s
    max-width: 450px
    font-size: 16px
    line-height: 24px
  @include xxs
    text-align: start
    font-size: 15px
    line-height: 18px

.businnes_wrapper
  margin-top: 100px
  margin-bottom: 270px
  position: relative
  @include s
    margin-top: 70px
    margin-bottom: 63px

.businnes_wrapper img
  max-height: 510px
  max-width: none
  @include m
    max-height: 433px
  @include s
    max-height: 300px
    max-width: 345px
  @include xs
    max-height: 230px
    max-width: 270px
  @include xxs
    max-height: 280px
    max-width: 100%

.businnes__right
  display: grid
  flex-direction: column
  height: 100%
  gap: 15px
  justify-content: space-between
  width: 100%

.businnes__title
  grid-column: 2/3
  min-width: 500px
  @include m
    font-size: 40px
    line-height: 50px
    min-width: 370px
    grid-row: 1/-1
  @include s
    font-size: 35px
    line-height: 40px
  @include xs
    line-height: 30px
    min-width: 270px
    font-size: 26px
  @include xxs
    line-height: 26px
    font-size: 22px
    grid-column: 1/-1
    grid-row: 2/3

.businnes__text
  font-size: 18px
  line-height: 26px
  grid-column: 2/3
  padding-bottom: 20px
  @include m
    padding-bottom: 10px
    grid-row: 2/3
  @include s
    padding-bottom: 0px
    font-size: 16px
    line-height: 24px
  @include xxs
    grid-column: 1/-1
    grid-row: 3/4
    font-size: 15px
    line-height: 18px

.businnes__text span
  color: var(--color-main)
</style>
