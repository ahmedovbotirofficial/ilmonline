<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="profile_main smart_subscribe">
    <div class="to_subscribe_block">
      <Loader v-if="isServerResponse" color="orange" />
      <div
        v-if="!getStudentsSubscribes.length && !isServerResponse"
        class="smart_subscribe__wrapper"
      >
        <div class="profile_main__title">
          <div class="block_valid_untill">
            <h2 class="smart_subscribe__title title_blue">
              {{ $t('profilePage.title_smart_subscribe') }}
              <svg-icon name="stars" />
            </h2>
            <p
              class="block_valid_untill__text"
              v-html="$t('profilePage.valid_until')"
            ></p>
          </div>
          <p class="smart_subscribe__text block-first">
            {{ $t('profilePage.smart_info_1') }}
          </p>
        </div>
        <div class="smart_subscribe__row">
          <ButtonBase
            color="orange"
            :size="getWindowWidth < 540 ? 'max' : 'popular'"
            type="submit"
            class="smart_subscribe__sign_in_btn"
            @click.native="goToСhooseDirections()"
            >{{ $t('buttons.subscribe') }}
          </ButtonBase>
        </div>
        <svg-icon :name="`logo_${getCoursesMode}`" />
      </div>

      <div
        v-if="getStudentsSubscribes.length && !isServerResponse"
        class="smart_subscribe__wrapper"
      >
        <div class="">
          <h2 class="smart_subscribe__title title_blue">
            {{ $t('profilePage.title_smart_subscribe') }}
            <svg-icon name="stars" />
          </h2>
          <p class="smart_subscribe__text expire_text">
            {{ $t('profilePage.smart_expire_text') }}

            {{ transformNewsDate(getStudentsSubscribes[0].valid_until) }}
          </p>
          <div class="destinations__block">
            <div
              v-for="el in categoriesList"
              :key="el.id"
              class="chosen-destinations__block"
            >
              <svg-icon :name="getIConName(el.id)" />
              <p class="chosen-destinations__item">
                {{ $t(`${el.title}`) }}
              </p>
            </div>
            <div class="smart_subscribe__buttons">
              <ButtonBase
                :style="
                  getStudentsSubscribes.length >= 10 ? 'display: none' : ''
                "
                :size="getWindowWidth <= 640 ? 'max' : 'popular'"
                type="submit"
                color="transparent"
                @click.native="goToСhooseDirections()"
                >{{ $t('buttons.refresh') }}
              </ButtonBase>
              <ButtonBase
                :size="getWindowWidth <= 640 ? 'max' : 'popular'"
                type="submit"
                color=""
                @click.native="openUnsubscribeModal()"
                >{{ $t('buttons.unsubscribe') }}
              </ButtonBase>
            </div>
          </div>
        </div>
        <svg-icon :name="`logo_${getCoursesMode}`" />
      </div>

      <div class="profile_inside block_second">
        <h2 class="block_second_title">
          {{ $t('profilePage.title_installments') }}
        </h2>
        <svg-icon name="men_with_pazl" />
      </div>

      <div class="profile_inside">
        <div class="profile__smart_subscribe smart_subscribe">
          <div class="smart_subscribe__row_items">
            <div class="profile_main__title">
              <Heading level="4" class="smart_subscribe__title">
                {{ $t('profilePage.smart_invest') }}
              </Heading>
              <p class="smart_subscribe__text">
                {{ $t('profilePage.smart_together') }}
              </p>
            </div>
            <div class="smart_subscribe__item_block">
              <div
                v-for="{ id, iconName, text } in infoItems"
                :key="id"
                class="smart_subscribe__item"
              >
                <div class="smart_subscribe__item_icon">
                  <svg-icon :name="`${iconName}_${getCoursesMode}`" />
                </div>
                <div class="smart_subscribe__item_text">
                  {{ $t(`profilePage.${text}`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import moment from 'moment';
import Heading from '@/elements/Heading/Heading.vue';

import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    Heading,
    ButtonBase,
    Loader,
  },
  data() {
    return {
      categoriesList: [],
      chooseBlocks: false,

      isServerResponse: false,
    };
  },
  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getStudentsSubscribes',
      'getWindowWidth',
      'getSelectedLanguage',
    ]),
    infoItems() {
      return [
        {
          id: 0,
          iconName: 'open_book',
          text: `study_everything.${this.getCoursesMode}`,
        },
        {
          id: 1,
          iconName: 'money_box',
          text: `save_money.${this.getCoursesMode}`,
        },
        {
          id: 2,
          iconName: 'smart_subscribe',
          text: `your_study_speed.${this.getCoursesMode}`,
        },
      ];
    },
  },

  mounted() {
    this.fetchStudentSubscriptionInformation();
    this.fetchStudentCategory();
  },
  methods: {
    transformNewsDate(date) {
      let lang = this.getSelectedLanguage;
      if (lang === 'uz') {
        lang = 'uz-latn';
      }
      return moment(date, 'YYYY-MM-DD').locale(`${lang}`).format('ll');
    },
    getIConName(id) {
      if (this.getStudentsSubscribes.find((el) => el.category_id === id)) {
        return 'check';
      } else {
        return 'cross';
      }
    },
    goToСhooseDirections() {
      this.$router.push({ name: 'direction' });
    },
    openUnsubscribeModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `unsubscribe`,
      });
    },
    async fetchStudentSubscriptionInformation() {
      this.isServerResponse = true;
      let res = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}StudentSubscriptionInfo`
      );
      this.isServerResponse = res.error;
      // console.log(res);
    },
    async fetchStudentCategory() {
      this.categoriesList = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}CoursesCategories`
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.smart_subscribe__sign_in_btn
  background: none

.smart_subscribe
  padding-top: 0
// .smart_subscribe.profile_main
//   padding-top: 16px

.profile_wrapper
  margin-bottom: 0

.smart_subscribe__wrapper
  padding: 40px
  // margin: 16px
  background-color: white
  border-radius: 12px
  position: relative
  overflow: hidden
  // min-height: 424px
  @include xs
    padding: 24px 16px

.smart_subscribe__title
  font-size: 28px
  line-height: 35px
  @include xxs
    margin-bottom: 8px
  @include xxxs
    font-size: 20px
    line-height: 26px

.block_second
  margin-top: 40px
  position: relative
  border-radius: 12px
  align-items: center
  @include s
    padding: 35px
  @include xs
    padding: 20px

.icon-men_with_pazl
  max-width: 77px
  max-height: 85px
  position: absolute
  bottom: 0
  left: 40px

  @include xs
    max-width: 50px
    max-height: 60px
    left: 10px

.block_second_title
  font-size: 24px
  line-height: 30px
  @include xxs
    font-size: 16px
    line-height: 20px
  @include xxxs
    position: relative
    right: -25px
    max-width: 155px

.title_blue
  color: var(--btn-color-blue-dark)
  @include xs
    font-size: 24px

.smart_subscribe__text
  font-size: 16px
  line-height: 22px
  margin-top: 10px
  padding-bottom: 5px
  @include m
    max-width: 340px
  @include xs
    margin-top: 6px
    font-size: 14px

.smart_subscribe__text.expire_text
  @include m
    max-width: 230px
  @include s
    max-width: 330px

.block_valid_untill__text
  font-size: 16px
  line-height: 20px
  color: #677C83
  @include xxs
    margin: 10px 0

.smart_subscribe__buttons
  position: absolute
  display: flex
  flex-direction: column
  gap: 16px
  top: 45px
  right: 50px
  @include m
    right: 20px
    gap: 12px
  @include s
    bottom: -20px
  @include xs
    gap: 5px
    top: 30px
  @media screen and (max-width: 640px)
    position: relative
    bottom: -20px
    top: auto
    left: 0%
    width: 100%

.block_valid_untill
  display: flex
  justify-content: space-between
  align-items: baseline
  @include xxs
    flex-direction: column

.block-first
  max-width: 340px

.profile_main__title
  margin-bottom: 24px
  line-height: 28px

.refresh-subscribe
  display: flex
  justify-content: space-between

.smart_subscribe__row
  display: flex
  gap: 24px

.smart_subscribe__link
  white-space: nowrap
  max-width: 320px
  overflow-y: hidden
.smart_subscribe__link::-webkit-scrollbar
  display: none

.smart_subscribe__item_block
  display: flex
  gap: 33px
  @include xs
    flex-wrap: wrap

.smart_subscribe__item
  display: flex
  flex-direction: column
  justify-content: flex-start
  gap: 13px
  flex: 1 1 33.333%
  padding: 22px
  border: 1px solid rgba(150, 150, 150, 0.16)
  @include xs
    flex: 100%
  &_text
    font-size: 14px
    line-height: 22px

.destinations__block
  display: flex
  flex-direction: column

.chosen-destinations__item
  font-size: 15px
  line-height: 24px
  padding-left: 10px

.chosen-destinations__block
  display: flex
  align-items: center
  margin-top: 10px
  cursor: pointer
  @include xs
    margin-top: 8px

.icon-logo_school,
.icon-logo_pro
  max-width: 175px
  max-height: 165px
  position: absolute
  right: -8px
  bottom: 0
  @include xs
    max-width: 139px
    max-height: 115px
  @media screen and (max-width: 640px)
    display: none

.icon-stars
  max-width: 12px
  max-height: 16px

.icon-check
  max-width: 14px
  max-height: 14px
  fill: var(--color-success)

.icon-cross
  max-width: 12px
  max-height: 12px
  fill: var(--color-orange)

// .flex_animate
//   display: flex
//   // perspective: 300px
// .flex_animate svg
//   fill: var(--btn-color-blue-dark)
//   max-height: 100px

// @keyframes rotateLeftRight
//   0%
//     // opacity: 0.5
//   50%
//     transform: translate(0px, -10px) rotateY(-90deg)
//   100%
//     // opacity: 1
//     transform: rotateY(-90deg)

//     // transfrom: translate(25px, 25px, -250px)

// @keyframes rotateRightLeft
//   0%
//     // opacity: 0.5
//   50%
//     transform: translate(0px, -10px) rotateY(-90deg)
//   100%
//     // opacity: 1
//     transform: rotateY(-90deg)

// .animate__rotateLeftRight
//   max-height: 100px
//   position: relative
//   animation-duration: 0.5s
//   animation-delay: 0.5s
//   animation-name: rotateLeftRight
//   animation-timing-function: linear
//   animation-iteration-count: infinite
//   animation-direction: alternate
//   transform-origin: left bottom

// .animate__rotateRightLeft
//   max-height: 100px
//   position: relative
//   animation-duration: 0.5s
//   animation-name: rotateRightLeft
//   animation-timing-function: linear
//   animation-iteration-count: infinite
//   animation-direction: alternate
//   transform-origin: right

// .left_animate_icons,
// .right_animate_icons
//   position: relative

// .animate_wrapper__left,
// .animate_wrapper__right
//   position: absolute
</style>
