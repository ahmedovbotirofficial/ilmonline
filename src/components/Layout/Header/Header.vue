<template>
  <header
    id="header"
    v-click-outside.stop="closeAll"
    class="header"
    :class="[headerBgColor, { shadow: headerShadow > 0 || openedHeader }]"
  >
    <div class="header__wrapper" :class="{ active: openedHeader }">
      <div class="container">
        <nav
          class="header__inner"
          :class="{
            burger_categories: openedBurgerListHeader && openedHeader,
            'burger_categories--user_list':
              openedBurgerListHeader && openedHeader && openedUserList,
          }"
        >
          <div class="header__nav">
            <a href="#" @click.prevent="goMain">
              <svg-icon
                :name="`icon_logo_${getCoursesMode}`"
                class="header__logo"
              />
            </a>
          </div>

          <div
            class="lessons_btn"
            :class="{ active: openedCoursesListHeader && openedHeader }"
            @click.stop="openHeader('lessons')"
          >
            <span class="lessons_btn__text">{{
              $t(`header.lessons.${getCoursesMode}`)
            }}</span>
            <svg-icon
              :name="
                openedCoursesListHeader && openedHeader
                  ? `icon_filter_arrow_active_${getCoursesMode}`
                  : 'icon_filter_arrow'
              "
            />
          </div>

          <div
            class="tests_btn"
            :style="openedUserList ? 'display: none' : ''"
            @click="goToTests"
          >
            {{ $t('titles.tests') }}
          </div>

          <div
            class="header__center_input"
            :style="openedUserList ? 'display: none' : ''"
          ></div>

          <!-- :class="getWindowWidth >= 768 ? 'not_touch_device' : ''" -->
          <div
            class="user_cabinet"
            :class="{
              hover: userCabinetHover,
              not_touch_device: getWindowWidth >= 767,
            }"
            @click="openCabinetMenu"
            @click.prevent.stop="isSignInHandler"
          >
            <span class="user_cabinet__text" style="font-weight: bold">
              {{ $t('header.private_cabinet') }}</span
            >
            <div
              class="nav_right__link user_profile"
              :class="{ active: isAuthUser }"
            >
              <svg-icon name="icon_profile" class="nav_right__profile" />
              <div class="user_profile__list_wrapper">
                <div class="user_profile__list">
                  <span
                    v-for="{ id, link, iconName } in userProfileList"
                    :key="id"
                    class="user_profile__link"
                    @click.stop="goTo(id)"
                  >
                    <svg-icon :name="iconName" />
                    <span>{{ $t(`header.${link}`) }}</span></span
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="getWindowWidth >= 768"
            class="nav_right__link language"
            :class="{ active: openedLanguageList }"
            @click="openLanguageList"
          >
            <span>{{ selectedLangTitle }}</span>
            <div class="language__list_wrapper">
              <div class="language__list">
                <span
                  v-for="item in languageList"
                  :key="item.id"
                  class="language__link"
                  :class="{ selected: item.id === getSelectedLanguage }"
                  @click="selectLang(item.id)"
                >
                  {{ item.title }}</span
                >
              </div>
            </div>
            <svg-icon name="icon_filter_arrow" class="language__arrow" />
          </div>

          <div
            v-else
            class="nav_right__link language_small"
            :style="openedUserList ? 'display: none' : ''"
          >
            <div class="language_small__list">
              <span
                v-for="item in languageList"
                :key="item.id"
                class="language__link"
                :class="{ selected: item.id === getSelectedLanguage }"
                @click="selectLang(item.id)"
              >
                {{ item.title }}</span
              >
            </div>
          </div>

          <div class="nav_burger__wrapper" @click.stop="openHeader('burger')">
            <div
              class="nav_burger"
              :class="{ active: openedBurgerListHeader && openedHeader }"
            ></div>
          </div>
        </nav>
      </div>

      <div class="drop_header">
        <div v-if="openedHeader" class="container">
          <div
            class="drop_header_main"
            :class="{ small_screen: getWindowHeight < 930 && isTouchDevice }"
          >
            <div
              class="drop_header__wrapper"
              :class="{
                active: openedHeader,
                opened_сourses: openedCoursesListHeader,
              }"
            >
              <div
                v-for="{
                  id,
                  headId,
                  title,
                  child,
                  link,
                  iconName,
                } in headerList"
                :key="headId"
                class="drop__item"
                :class="[
                  headId,
                  {
                    courses_categories:
                      openedCoursesListHeader && headId === 'categories',
                    burger_categories:
                      openedBurgerListHeader && headId === 'categories',
                    opened_user_list: openedUserList,
                    last_drop_item: link === 'logout',
                  },
                ]"
              >
                <div class="drop__content">
                  <div
                    class="drop__title"
                    :class="{
                      level: headId === 'levels',
                      categories:
                        headId === 'categories' && !openedBurgerListHeader,
                      price: headId === 'prices',
                      lang: headId === 'languages',
                      burger_title: openedBurgerListHeader,
                    }"
                    :style="openedUserList ? 'display: none' : 'display: block'"
                  >
                    <span>{{ $t(`header.${title}.${getCoursesMode}`) }}</span>
                  </div>
                  <div
                    v-if="openedUserList"
                    :key="id"
                    class="drop__link"
                    @click.stop="goTo(id, headId)"
                  >
                    <svg-icon :name="iconName" />
                    <span>{{ $t(`header.${link}`) }}</span>
                  </div>
                  <div
                    v-for="subChild in child"
                    v-else
                    :key="subChild.id"
                    class="drop__link"
                    @click.stop="goTo(subChild.id, headId)"
                  >
                    <span v-if="headId === 'categories'">
                      {{ subChild.title }}
                    </span>
                    <span v-else>{{
                      $t(`header.${subChild.title}.${getCoursesMode}`)
                    }}</span>
                  </div>
                  <ModeSwitcher v-if="headId === 'navigation'" />
                </div>
              </div>

              <div
                v-if="openedBurgerListHeader"
                class="drop__item cabinet_login"
              >
                <div class="drop__content">
                  <div
                    class="drop__title"
                    :class="{
                      burger_title: openedBurgerListHeader,
                    }"
                  >
                    <span>{{ $t('header.private_cabinet') }}</span>
                  </div>
                  <div
                    v-for="{ id, link, iconName } in userProfileList"
                    :key="id"
                    class="drop__link"
                    :class="{ log_line: id === 'logout' }"
                    @click.stop="goTo(id)"
                  >
                    <svg-icon
                      v-if="id === 'logout' || id === 'login'"
                      class="log_icon"
                      :class="{ login: id === 'login' }"
                      :name="iconName"
                    />
                    {{ $t(`header.${link}`) }}
                  </div>
                </div>
              </div>
              <div v-if="openedCoursesListHeader" class="drop_btn__wrapper">
                <ButtonBase
                  :size="getWindowWidth > 540 ? 'popular' : 'max'"
                  color="orange"
                  @click.native="openCourses"
                >
                  {{ $t('header.all_lessons') }}</ButtonBase
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import ModeSwitcher from '@/elements/Switchers/ModeSwitcher.vue';
import TextField from '@/elements/Inputs/TextField.vue';
import InputSearch from '@/elements/Inputs/InputSearchResults.vue';
import { scrollToBeginForm } from '@/helpers/scroll';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';
import BreadCrumbs from '@/elements/BreadCrumbs.vue';

import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    ButtonBase,
    ModeSwitcher,
    // BreadCrumbs,
  },
  data() {
    return {
      searchInputValue: '',
      selectedLangTitle: '',
      languageList: {
        ru: {
          id: 'ru',
          title: 'РУС',
        },
        'uz-latn': {
          id: 'uz-latn',
          title: 'UZB',
        },
        uz: {
          id: 'uz',
          title: 'УЗБ',
        },
      },

      userCabinetHover: false,
      openedLanguageList: false,

      openedCoursesListHeader: false,
      openedBurgerListHeader: false,
      openedHeader: false,
      openedIdHeader: '',
      seledtedLang: '',
      isUser: false,

      isTouchDevice: false,

      headerId: 0,
      headerShadow: 0,
      lessonsId: 0,
      why_ilm: 0,
      main_newsId: 0,
      feedbackId: null,

      vacancyId: 0,
      openedUserList: false,
      categoriesList: [],
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getSelectedLanguage',
      'isAuthUser',
      'getUserRole',
      'getWindowWidth',
      'getWindowHeight',
    ]),
    // isShowBreadCrumbs() {
    //   return !!this.$route.meta.breadcrumbs;
    // },
    loginList() {
      return [
        {
          id: 'login',
          link: 'login',
          headId: 'cabinet_login',
          iconName: `icon_logout_${this.getCoursesMode}`,
        },
      ];
    },
    profileListStudent() {
      const list = [
        {
          id: 'profile',
          link: `profile`,
          iconName: `icon_link_profile_${this.getCoursesMode}`,
        },
        {
          id: 'lessons',
          link: `my_lessons.${this.getCoursesMode}`,
          iconName: `icon_my_lessons_${this.getCoursesMode}`,
        },

        {
          id: 'chat',
          link: `chat_with_teacher.${this.getCoursesMode}`,
          iconName: `icon_chat_with_mentor_${this.getCoursesMode}`,
        },
        {
          id: 'payment',
          link: 'payments',
          iconName: `icon_payment_${this.getCoursesMode}`,
        },
        {
          id: 'smart_subscribe',
          link: 'smart_subscribe',
          iconName: `smart_subscribe_${this.getCoursesMode}`,
        },
        {
          id: 'referal',
          link: 'referal',
          iconName: `icon_referal_${this.getCoursesMode}`,
        },
        {
          id: 'logout',
          link: 'logout',
          iconName: `icon_logout_${this.getCoursesMode}`,
        },
      ];

      if (this.getCoursesMode === COURSES_MODES.SCHOOL) {
        list.splice(-1, 0, {
          id: 'parent_control',
          link: 'parent_control',
          iconName: 'icon_parent_control',
        });
        list.splice(2, 0, {
          id: 'profile-tests',
          link: 'my_tests',
          iconName: `icon_tests_${this.getCoursesMode}`,
        });
      }
      return list;
    },
    profileListTeacher() {
      return [
        {
          id: 'profile',
          link: 'profile',
          iconName: `icon_link_profile_${this.getCoursesMode}`,
        },
        {
          id: 'students',
          link: 'students',
          iconName: `icon_students_${this.getCoursesMode}`,
        },
        {
          id: 'chat',
          link: 'chat_with_students',
          iconName: `icon_chat_with_mentor_${this.getCoursesMode}`,
        },
        {
          id: 'payment',
          link: 'payments',
          iconName: `icon_payment_${this.getCoursesMode}`,
        },
        {
          id: 'logout',
          link: 'logout',
          iconName: `icon_logout_${this.getCoursesMode}`,
        },
      ];
    },

    userProfileList() {
      return !this.isAuthUser
        ? this.loginList
        : this.getUserRole === 'student'
        ? this.profileListStudent
        : this.profileListTeacher;
    },

    burgerList() {
      let burgerHeaderList = [
        {
          id: 1,
          title: 'navigation',
          headId: 'navigation',
          child: [
            {
              id: 'first-page',
              title: 'first_page',
            },
            {
              id: 'about',
              title: 'about',
            },
            {
              id: 'vacancy',
              title: 'vacancy',
            },
            {
              id: 'news',
              title: 'news',
            },
            {
              id: 'courses',
              title: `courses.${this.getCoursesMode}`,
            },
            {
              id: 'tests-main',
              title: 'trial_tests',
            },
            {
              id: 'education',
              title: 'education',
            },
          ],
        },
      ];
      let categories = {
        id: 2,
        title: 'categories',
        headId: 'categories',
        child: [...this.categoriesList],
      };
      burgerHeaderList[1] = categories;
      burgerHeaderList[2] = {
        id: 3,
        title: 'ilm',
        headId: 'ilm',
        child: [
          {
            id: 'policy',
            title: 'policy',
          },
          {
            id: 'agreement',
            title: 'condition',
          },
          {
            id: 'feedback',
            title: 'callback',
          },
        ],
      };
      return burgerHeaderList;
    },

    coursesHeaderList() {
      let coursesList = [
        {
          headId: 'levels',
          title: 'level',
          child: [
            {
              id: 1,
              title: 'start_classes',
            },
            {
              id: 6,
              title: 'middle_classes',
            },
            {
              id: 12,
              title: 'old_classes',
            },
          ],
        },
      ];
      let categories = {
        id: 2,
        title: 'categories',
        headId: 'categories',
        child: [...this.categoriesList],
      };
      coursesList[1] = categories;
      coursesList[2] = {
        headId: 'prices',
        title: 'price',
        child: [
          {
            id: 'free',
            title: 'price_free',
          },
          {
            id: 'premium',
            title: 'price_premium',
          },
        ],
      };
      coursesList[3] = {
        headId: 'languages',
        title: 'language',
        child: [
          {
            id: 1,
            title: 'russian',
          },
          {
            id: 2,
            title: 'uzbekistanian',
          },
        ],
      };
      return coursesList;
    },

    headerBgColor() {
      // console.log(this.$route.name);
      if (this.$route.name === 'first-page') {
        if (this.headerId > this.feedbackId) {
          return ['', true];
        } else if (this.headerId > this.main_newsId) {
          return ['white_bg', false];
        } else if (this.headerId > this.why_ilm) {
          return ['', true];
        } else if (this.headerId > this.lessonsId) {
          return ['white_bg', false];
        } else {
          return ['', true];
        }
      } else if (
        this.$route.name === 'vacancy' ||
        this.$route.name === 'tests-main' ||
        this.$route.name === 'course-test' ||
        this.$route.name.includes('quiz') ||
        this.$route.name.includes('education') ||
        this.$route.name.includes('trial')
      ) {
        return ['white_bg', false];
      } else if (
        this.$route.name === 'education' ||
        this.$route.name.includes('individual-task')
      ) {
        return ['white_bg', true];
      } else {
        return ['', true];
      }
    },

    headerList() {
      if (this.openedCoursesListHeader) {
        return this.coursesHeaderList;
      }
      if (this.openedBurgerListHeader) {
        if (this.openedUserList) {
          return this.userProfileList;
        } else {
          return this.burgerList;
        }
      } else {
        return '';
      }
    },
  },

  watch: {
    getWindowWidth(value) {
      if (value < 768) {
        this.openedUserList = true;
      } else {
        this.openedUserList = false;
      }
    },
    async getSelectedLanguage(value) {
      value && (await this.fetchCoursesCategories());
    },
  },

  async created() {
    await this.fetchCoursesCategories();
  },
  mounted() {
    this.selectLang(getFromLS('multi_lang') || 'uz-latn');
    window.addEventListener('scroll', this.scrollWatcher);
    this.isTouchDeviceFunc();
  },

  methods: {
    async fetchCoursesCategories() {
      this.categoriesList = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}CoursesCategories`
      );
    },
    isTouchDeviceFunc() {
      try {
        document.createEvent('TouchEvent');
        this.isTouchDevice = true;
      } catch (e) {
        // this.openedUserList = false;
        this.isTouchDevice = false;
      }
    },

    scrollWatcher(event) {
      this.headerShadow = document.getElementById('header').offsetTop;
      this.headerId = document.getElementById('header').offsetTop + 100;

      if (this.$route.name === 'first-page') {
        this.lessonsId = document.getElementById('main_lessons').offsetTop;
        this.why_ilm = document.getElementById('why_ilm').offsetTop;
        this.main_newsId = document.getElementById('main_news').offsetTop;
      } else {
        this.headerId = 1000;
      }
    },

    goToTests() {
      this.closeAll();
      this.$router.push({ name: 'tests-main' });
    },
    closeAll() {
      this.userCabinetHover = false;
      this.openedUserList = false;
      this.openedHeader = false;
      this.openedLanguageList = false;
    },
    openHeader(id) {
      this.userCabinetHover = false;
      this.openedLanguageList = false;
      if (this.openedIdHeader === id) {
        this.openedHeader = !this.openedHeader;
        this.openedUserList = false;
      } else {
        if (id === 'lessons') {
          this.openedBurgerListHeader = false;
          this.openedCoursesListHeader = true;
          this.openedHeader = true;
          this.openedUserList = false;
        }
        if (id === 'burger') {
          this.openedCoursesListHeader = false;
          this.openedBurgerListHeader = true;
          this.openedHeader = true;
          this.openedUserList = false;
        }
        this.openedIdHeader = id;
      }
    },
    selectLang(chosenLang) {
      // console.log(chosenLang);
      this.selectedLangTitle = this.languageList[chosenLang].title;
      this.$i18n.locale = chosenLang;
      this.$store.commit('selectLanguage', chosenLang);
    },
    goMain() {
      this.closeAll();
      if (this.$route.path !== '/') {
        this.$router.push({ name: 'first-page' });
      }
    },
    isSignInHandler() {
      if (!this.isAuthUser) {
        this.closeAll();
        this.$router.push({ name: 'sign' });
      } else {
        if (this.getWindowWidth < 768) {
          this.openedUserList = !this.openedUserList;
        }
      }
    },
    goTo(id, headId) {
      if (id === 'feedback') {
        this.$route.name !== 'first-page'
          ? this.$router.push({ name: 'first-page', hash: '#feedback' })
          : scrollToBeginForm('feedback');
      } else {
        if (
          (this.openedCoursesListHeader &&
            (headId === 'categories' ||
              headId === 'levels' ||
              headId === 'languages' ||
              headId === 'prices')) ||
          (this.burgerList && headId === 'categories')
        ) {
          this.$store.commit('setHeaderCoursesFilter', {
            type: headId,
            values: [id],
          });
          this.$router.push({ name: 'courses' });
        } else {
          if (id === 'logout') {
            this.$store.dispatch('userLogout');
          } else if (id === 'login') {
            this.$router.push({ name: 'sign' });
          } else {
            this.$store.commit('selectProfileLink', id);
            if (this.$route.path !== `/${id}`) {
              this.$router.push({ name: id });
            }
          }
        }
      }
      this.closeAll();
    },
    selectlevel(id) {
      this.$router.push({ name: 'courses', params: { level: id } });
    },
    openCourses() {
      this.closeAll();
      this.$store.commit('SET_ALL_COURSES', true);
      this.$store.dispatch(`getAll${this.getCoursesModeDispatch}CoursesList`);
      this.$router.push({ name: 'courses' });
    },
    openCabinetMenu() {
      this.userCabinetHover = !this.userCabinetHover;
      this.openedLanguageList = false;
      if (this.getWindowWidth > 767) {
        this.openedHeader = false;
      }
      if (this.getWindowWidth < 767) {
        this.userCabinetHover = !this.userCabinetHover;
      }
    },
    openLanguageList() {
      this.openedLanguageList = !this.openedLanguageList;
      this.userCabinetHover = false;
      this.openedUserList = false;
      this.openedHeader = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.header
  position: sticky
  top: 0
  left: 0
  right: 0
  background-color: var(--color-background)
  z-index: 15

.header.shadow
  box-shadow: 0px 4px 28px rgba(18, 50, 62, 0.06)
  z-index: 16

.header.white_bg
  background-color: white

.header__wrapper
  padding: 8px 0

.header__wrapper.active
  background-color: var(--color-white)
  position: fixed
  top: 0
  left: 0
  width: 100%
  box-shadow: 0px 4px 32px rgb(231 231 231 / 49%)

.drop_header
  // overflow-y: scroll

.nav_burger__wrapper
  height: 30px
  width: 22px
  display: flex
  align-items: center

.nav_burger
  position: relative
  width: 100%
  height: 2px
  background-color: var(--primary-font-color)

.nav_burger::before,
.nav_burger::after
  position: absolute
  content: ''
  width: 100%
  top: 8px
  height: 2px
  background-color: var(--primary-font-color)

.active.nav_burger::before
  display: none
.nav_burger__wrapper:hover .nav_burger,
.nav_burger__wrapper:hover .nav_burger::before,
.nav_burger__wrapper:hover .nav_burger::after
  background-color: var(--color-main)

.nav_burger__wrapper:active .nav_burger,
.nav_burger__wrapper:active .nav_burger::before
  background-color: var(--color-main)
  opacity: 0.8

.nav_burger::after
  top: -8px

.nav_burger.active
  transform: rotate(-45deg)

.nav_burger.active::before
  opacity: 0

.nav_burger.active::after
  transform: rotate(90deg)
  top: 0

.drop_header.active
  position: fixed
  left: 0
  right: 0
  top: 87px
  background-color: var(--color-white)
  z-index: 12

.drop_header__wrapper
  display: grid
  grid-template-columns: 22% 28% 28% 22%
  padding: 62px 0 60px 0
  min-height: 272px
  @include s
    grid-template-columns: 30% 40% 30%
  @include xs
    grid-template-columns: 1fr
    padding: 0 0 60px 0

.drop_header__wrapper.opened_сourses
  grid-template-columns: 20% 32% 29% 17%
  grid-template-rows: 1fr 180px
  padding: 62px 0 0
  @include m
    grid-template-columns: 27% 46% 27%
    grid-template-rows: 60% 40%
    padding: 62px 0 120px 0
  @include xs
    grid-template-columns: 1fr
    grid-template-rows: 1.3fr 3.5fr 1.3fr 1fr 1fr
    padding: 0 0 16px 0

.drop_header_main
  @include xs
    // height: 830px

.drop_header_main.small_screen
  overflow-y: scroll
  height: 100vh
  padding: 0 0 50px

.drop__item
  display: flex
  justify-content: center
  border-right: 1px solid #E6E6E6
  @include xs
    border-right: 0
    padding: 24px 0
    justify-content: start
    border-bottom: 1px solid #E6E6E6
  @include xxs
    font-size: 14px

.drop__item.prices
  @include m
    border-right: 0

.drop__item.languages
  border-right: 0
  @include m
    border-right: 1px solid #E6E6E6
  @include xs
    padding: 24px 0 0 0
    border-right: 0
    border-bottom: 0

.drop__item.opened_user_list
  justify-content: flex-start
  border: none
  padding: 0
  padding-top: 20px

.drop__item.opened_user_list:first-child
  @include xs
    padding-top: 0

.drop__item.opened_user_list.last_drop_item
  border-top: 1px solid #E6E6E6
  margin-top: 24px
  padding-top: 24px

.drop__item.level
  justify-content: flex-start
  @include m
    grid-row: 1/-1
  @include xs
    padding-top: 0px
    grid-row: auto

.drop__item.navigation
  justify-content: flex-start

.drop__item.courses_categories
  @include m
    grid-row: 1/-1
    min-height: 272px
  @include xs
    justify-content: flex-start

.drop__item.burger_categories
  @include xs
    display: none

.drop__item.lang
  border-right: none
  justify-content: flex-end
  @include m
    grid-row: 1/2
    justify-content: center
  @include xs
    grid-row: auto
    justify-content: flex-start
    border: none

.drop__item.price
  @include m
    grid-row: 2/3
    border-right: none
  @include xs
    grid-row: auto
    justify-content: flex-start

.drop__item.cabinet_login
  border: none
  @include s
    display: none

.drop__item.ilm
  @include s
    border: none
    // padding: 24px 0
  @include xs
    justify-content: flex-start

.language_small
  grid-column: 3/5
  justify-self: flex-end

.language_small__list
  font-weight: bold
  display: flex
  gap: 15px

.drop__content
  display: flex
  flex-direction: column
  gap: 16px

.drop__title
  margin-bottom: 10px
  font-weight: bold

  span
    display: inline-block

.drop__title.burger_title
  margin-bottom: 0px
  padding: 8px 0
  color: var(--color-main)

.drop__title.level span
  padding: 8px 16px
  background-color: #FFF5F1
  color: #EE6023
.drop__title.categories span
  padding: 8px 16px
  background-color: #F3FFF0
  color: #1E810E
.drop__title.price span
  padding: 8px 16px
  background-color: #E9F7FF
  color: #007AD2
.drop__title.lang span
  padding: 8px 16px
  background-color: #F3F2FF
  color: var(--color-business-font)

.drop__link
  display: flex
  align-items: center
  gap: 10px
  cursor: pointer
  @include s
    max-width: 160px
  @include xs
    max-width: none

.drop__link.log_line
  padding-top: 12px
  border-top: 1px solid rgba(150, 150, 150, 0.24)

.log_icon
  max-width: 16px

.log_icon.login
  transform: rotate(180deg)

.drop__link:hover
  text-decoration: none
  color: var(--color-main)

.drop__link:active
  color: var(--color-main)
  opacity: 0.8

.drop_btn__wrapper
  display: flex
  justify-content: center
  align-self: center
  grid-column: 1/-1
  @include m
    padding-top: 25px
    // margin-bottom: 100px
  @include xs
    padding: 32px 0 28px 0

.drop_btn__wrapper .primary_btn--popular
  @include xs
    width: 100% !important

.header__inner
  display: grid
  grid-template-columns: 23% 110px 0.3fr 5fr 0fr 0fr 0fr
  grid-template-rows: 72px
  white-space: nowrap
  align-items: center
  gap: 3%
  @include xs
    grid-template-columns: 28% 93px 1fr
    grid-template-rows: 55px
    gap: 0
  // @include xxs
  //   grid-template-columns: 28% 83px 1fr

.header__inner div:not(:first-child)
  cursor: pointer

.header__inner.burger_categories
  @include xs
    grid-template-columns: 28% 93px 1fr
    grid-template-rows: 55px 72px 1fr

.header__inner.burger_categories--user_list
  grid-template-rows: 72px 72px
  @include xs
    grid-template-rows: 55px 72px

.header__inner .nav_right__link
  @include xs
    display: none

.header__inner.burger_categories .nav_right__link
  @include xs
    display: flex
    grid-row: 2/3

.header__inner .tests_btn,
.header__inner .header__center_input
  @include xs
    display: none

.header__inner.burger_categories .tests_btn
  @include xs
    text-transform: uppercase
    display: block
    grid-row: 4/5
    grid-column: 1/-1
    padding-bottom: 24px
    border-bottom: 1px solid rgba(150, 150, 150, 0.5)

.header__inner.burger_categories .header__center_input
  @include xs
    display: block
    grid-row: 3/4
    grid-column: 1/-1
    background-color: #F8F8F8
    margin: 0 -15px
    padding: 0 15px

.header__center_input.opened_user_list
  display: none

.header__center_input
  @include xs
    display: none

.header__inner .nav_burger__wrapper
  @include xs
    justify-self: flex-end

.header__nav
  display: flex
  align-items: center

.header__logo
  max-height: 55px
  max-width: 101px
  cursor: pointer
  @include xxs
    max-width: 60px

.header__center
  display: flex
  align-items: center
  gap: 40px
  cursor: pointer
  @include m
    left: 0

.lessons_btn
  display: flex
  align-items: center
  justify-content: space-between
  font-weight: bold
  gap: 6px
  padding: 8px 24px
  border: 1px solid var(--primary-font-color)
  z-index: 13
  // width: 102px
  @include xs
    padding: 5px 14px

.lessons_btn svg
  max-height: 7px
  position: relative
  top: 2px
  fill: none
  stroke: #12323E

.lessons_btn.active span
  color: var(--color-main)

.lessons_btn:hover
  border: 1px solid var(--color-main)

.tests_btn
  font-weight: bold
  z-index: 14

.tests_btn:hover
  color: var(--color-main)

.tests_btn:active
  color: var(--color-main)
  opacity: 0.8

.header__center_input
  display: flex
  gap: 10px

.header__center_input.active
  height: 44px
  align-items: center
  padding: 12px 16px
  background: var(--color-white)

.header__center_input svg
  max-height: 16px
  max-width: 16px

.header__center_input span
  opacity: 0.4

  @include s
    display: none

////////////// hidden search input
.header__center_input
  opacity: 0

.language__arrow
  max-width: 10px
  max-height: 5px
  position: relative
  top: 1px
  fill: none
  stroke: #12323E

.language__arrow
  top: 0

.nav_right
  display: flex
  gap: 15px
  align-items: center
  cursor: pointer
  justify-content: flex-end

.nav_right__link
  display: flex
  align-items: center
  gap: 4px

.user_cabinet
  display: flex
  align-items: center
  position: relative

.user_cabinet:hover .user_cabinet__text
  color: var(--color-main)
  opacity: 0.8

.user_cabinet.hover .user_cabinet__text
  color: var(--color-main)

.user_cabinet__text
  @include s
    display: none

.user_profile
  display: flex
  justify-content: center
  height: 40px
  width: 40px
  @include s
    justify-content: start

.user_profile > svg
  fill: none
  stroke: var(--primary-font-color)
  stroke-width: 2

.user_cabinet:hover .user_profile > svg
  stroke: var(--color-main)
  opacity: 0.8

.user_cabinet.hover .user_profile > svg
  stroke: var(--color-main)

.user_cabinet
  @include xs
    display: none

.header__inner.burger_categories .user_cabinet
  @include xs
    grid-row: 2/3
    display: block

.user_profile svg, .header__center_search_icon
  max-height: 20px
  max-width: 20px

.language
  height: 40px
  padding: 0 10px
  min-width: 62px
  background-color: rgba(255, 255, 255, 0.6)
  font-weight: bold
  position: relative
  z-index: 13

.language:hover
  outline: 1px solid var(--color-main)

.language.active
  outline: 1px solid var(--color-main)

.language__list_wrapper,
.user_profile__list_wrapper
  display: none

.user_cabinet.hover.not_touch_device .user_profile.active .user_profile__list_wrapper
  display: block
  position: absolute
  top: 39px
  left: -45px
  width: 100%
  z-index: 13
  @include s
    left: -100px

.language.active .language__list_wrapper
  display: block
  position: absolute
  top: 39px
  left: 0
  width: 100%
  z-index: 13

// .user_cabinet.hover.not_touch_device .user_profile.active .user_profile__list_wrapper
//   width: auto
//   left: -45px
//   @include s
//     left: -100px

.language__list,
.user_profile__list
  display: flex
  flex-direction: column
  align-items: center
  padding: 16px 0
  gap: 16px
  margin-top: 9px
  background-color: rgba(255, 255, 255, 1)
  outline: 1px solid var(--color-main)

.user_profile__list
  display: flex
  align-items: flex-start
  gap: 16px
  padding: 24px 25px
  min-width: 240px

.user_profile__link
  display: flex
  align-items: center
  gap: 10px
  white-space: pre-wrap

.user_profile__link:last-child
  width: 100%
  border-top: 1px solid var(--color-border-bottom-stars)
  padding-top: 18px

.user_profile__link span
  position: relative

.user_profile__link:hover
  color: var(--color-main)
  transition: 0 !important

.language.active svg
  transform: rotate(180deg)

.language__link:hover
  color: var(--color-main)

.language__link.selected
  color: var(--color-main)
</style>
