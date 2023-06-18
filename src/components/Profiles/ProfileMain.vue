<template>
  <div class="container">
    <div class="profile__title_wrapper">
      <Heading
        level="2"
        class="profile__title"
        :class="{ active: isParentControlPage }"
        >{{ getTitle }}</Heading
      >

      <div v-if="isParentControlPage" class="parent_status">
        <div
          class="parent_status__text"
          :class="{
            active: !getBotConnection.is_parental_control_bot_connected,
          }"
        >
          {{ $t('profilePage.not_connected') }}
        </div>
        <div
          class="parent_status__handler"
          :class="{
            active: getBotConnection.is_parental_control_bot_connected,
          }"
        >
          <div
            class="parent_status__circle"
            :class="{
              active: getBotConnection.is_parental_control_bot_connected,
            }"
          ></div>
        </div>
        <div
          class="parent_status__text"
          :class="{
            active: getBotConnection.is_parental_control_bot_connected,
          }"
        >
          {{ $t('profilePage.connected') }}
        </div>
      </div>
    </div>

    <div v-if="!activeMenu && getWindowWidth < 1024" class="menu_btn__wrapper">
      <div class="menu_btn" :class="{ active: activeMenu }" @click="openedMenu">
        <span class="menu_btn__text"> {{ $t('main.menu') }}</span>
        <svg-icon name="arrow_down" />
      </div>
    </div>

    <div
      class="profile_wrapper"
      :class="{ loader: !activeMenu && getWindowWidth > 1024 }"
    >
      <ProfileSidebar :active-menu="activeMenu" @active-menu="openedMenu" />

      <div
        v-if="activeMenu && getWindowWidth < 1024"
        class="menu_btn__wrapper_small"
        :class="{ active: activeMenu }"
      >
        <div
          class="menu_btn"
          :class="{ active: activeMenu }"
          @click="openedMenu"
        >
          <span class="menu_btn__text"> {{ $t('main.menu') }}</span>
          <svg-icon name="arrow_down" />
        </div>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ProfileSidebar from '@/components/Profiles/ProfileSidebar.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    Heading,
    ProfileSidebar,
    // ButtonBase,
  },

  data() {
    return {
      activeMenu: false,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getSeledtedProfileLink',
      'getUserRole',
      'isAuthUser',
      'getWindowWidth',
      'getBotConnection',
    ]),

    getTitle() {
      if (this.$route.name === 'payment-add-card') {
        return this.$t('profilePage.title_payment_add');
      }
      if (this.$route.name === 'payment-edit-card') {
        return this.$t('profilePage.title_payment_edit');
      }
      if (this.$route.name === 'lessons') {
        return this.$t(
          `profilePage.title_${this.getSeledtedProfileLink}.${this.getCoursesMode}`
        );
      }
      if (this.getSeledtedProfileLink === 'chat') {
        return this.$t(
          `profilePage.title_chat_for_${this.getUserRole}.${this.getCoursesMode}`
        );
      } else {
        return this.$t(`profilePage.title_${this.getSeledtedProfileLink}`);
      }
    },
    isParentControlPage() {
      return this.$route.name === 'parent_control' ? true : false;
    },
  },
  watch: {
    getWindowWidth(value) {
      if (value > 1024) {
        this.activeMenu = true;
      } else {
        this.activeMenu = false;
      }
    },
  },
  async created() {
    await this.$store.dispatch('getParentConnectionStatus');

    if (
      this.$route.name === 'payment-add-card' ||
      this.$route.name === 'payment-edit-card'
    ) {
      this.$store.commit('selectProfileLink', 'payment');
    } else {
      this.$store.commit('selectProfileLink', this.$route.name);
    }
    if (this.getWindowWidth > 1024) {
      this.activeMenu = true;
    }
  },

  // kololopnikoff+10@gmail.com
  methods: {
    chooseProfileLink(id) {
      if (id === 'logout') {
        this.$store.dispatch('userLogout');
      } else {
        this.$store.commit('selectProfileLink', id);
        if (this.$route.path !== `/${id}`) {
          this.$router.push({ name: id });
        }
      }
    },
    openedMenu(value) {
      if (this.getWindowWidth < 1024) {
        this.activeMenu = !this.activeMenu;
      }
    },
  },
};
</script>

<style lang="sass">
.profile__title_wrapper
  display: flex
  align-items: center
  justify-content: space-between
  @media only screen and (max-width: 690px)
    flex-direction: column
    align-items: flex-start

.parent_status
  display: flex
  align-items: center
  gap: 12px
  position: relative
  top: 8px
  @media only screen and (max-width: 690px)
    top: 0px
    margin-bottom: 40px

.parent_status__handler
  width: 64px
  height: 32px
  border-radius: 18px
  background-color: var(--color-white)
  display: flex
  align-items: center
  @include s
    width: 48px
    height: 24px
    border-radius: 12px

.parent_status__handler.active
  justify-content: flex-end

.parent_status__circle
  position: relative
  left: 2px
  width: 28px
  height: 28px
  border-radius: 18px
  background-color: var(--color-main)
  @include s
    left: 2px
    width: 20px
    height: 20px
    border-radius: 12px

.parent_status__circle.active
  left: -2px

.parent_status__text
  font-size: 16px
  color: var(--color-font-light-dark)
  @include s
    font-size: 14px

.parent_status__text.active
  color: var(--primary-font-color)

.profile__title
  margin: 50px 0 40px 0
  @include xxs
    margin: 0px 0 40px 0

.profile__title.active
  margin: 50px 0 40px 0
  @media only screen and (max-width: 690px)
    margin-bottom: 12px
  @include xxs
    margin: 0px 0 12px 0

.profile_wrapper
  display: grid
  grid-template-columns: 1fr 2fr
  gap: 6%
  margin-bottom: 100px
  @include s
    display: block
  @include xxs
    margin-bottom: 60px

.profile_wrapper.loader
  grid-template-columns: 1fr

.profile_sidebar__list
  display: flex
  flex-direction: column

.menu_btn__wrapper
  display: none
  @include s
    position: relative
    display: flex
    flex-direction: column-reverse
    margin-bottom: 32px
  @include xs
    margin-bottom: 24px

.menu_btn
  display: flex
  align-items: center
  font-weight: bold
  cursor: pointer
  gap: 6px
  padding: 14px
  border: 1px solid var(--color-main)
  z-index: 13
  justify-content: center

.menu_btn__wrapper_small
  margin-bottom: 32px

.user_profile > svg
  fill: none
  stroke-width: 2
  stroke: var(--color-main)

.user_profile svg
  max-height: 20px
  max-width: 20px

.user_profile__list
  display: flex
  flex-direction: column
  gap: 16px
  background-color: rgba(255, 255, 255, 1)
  outline: 1px solid var(--color-main)
  padding: 24px 25px

.user_profile__link
  display: flex
  align-items: center
  gap: 10px
  cursor: pointer

.user_profile__link:last-child
  width: 100%
  border-top: 1px solid var(--color-boreder-bottom-stars)
  padding-top: 18px

.user_profile__link:hover
  color: var(--color-main)

.menu_btn svg
  max-width: 10px
  max-height: 5px
  position: relative
  top: 1px
  fill: none
  stroke: #12323E

.menu_btn.active
  border-top: none

.menu_btn.active svg
  transform: rotate(180deg)

.menu_btn__text
  text-transform: uppercase
</style>
