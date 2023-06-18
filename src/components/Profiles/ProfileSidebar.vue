<template>
  <div v-if="activeMenu" class="profile_sidebar_wrapper">
    <div class="profile_sidebar" :class="{ isActive: activeMenu }">
      <div class="profile_sidebar__list">
        <span
          v-for="{ id, link, iconName } in profileList"
          :key="id"
          class="profile_sidebar__link"
          :class="{ active: getSeledtedProfileLink === id }"
          @click="chooseProfileLink(id)"
        >
          <svg-icon :name="iconName" />
          <span>{{ $t(`header.${link}`) }}</span>
          <span
            v-if="id === 'students' && !!getNotCheckedTasksCounter"
            class="profile_tasks_counter"
          >
            {{ getNotCheckedTasksCounter }}
          </span>
          <span
            v-if="id === 'chat' && !!getUnreadCounter"
            class="profile_chat_counter"
          >
            {{ getUnreadCounter }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: {
    // Heading,
    // ButtonBase,
  },

  props: {
    activeMenu: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getSeledtedProfileLink',
      'getUserRole',
      'getUnreadCounter',
      'getNotCheckedTasksCounter',
      'getCoursesModeDispatch',
    ]),

    profileList() {
      return this.getUserRole === 'student'
        ? this.profileListStudent
        : this.profileListTeacher;
    },
    profileListStudent() {
      const list = [
        {
          id: 'profile',
          link: 'profile',
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
        list.splice(2, 0, {
          id: 'profile-tests',
          link: 'my_tests',
          iconName: `icon_tests_school`,
        });
        list.splice(-1, 0, {
          id: 'parent_control',
          link: 'parent_control',
          iconName: 'icon_parent_control',
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
  },

  async created() {
    await this.$store.dispatch(
      `getMy${this.getCoursesModeDispatch}UnreadMessages`
    );
    if (this.getUserRole === 'teacher')
      await this.$store.dispatch(`getMyNotCheckedTasksCounter`);
  },

  mounted() {
    if (this.$route.name.includes('payment')) {
      this.$store.commit('selectProfileLink', 'payment');
    } else {
      this.$store.commit('selectProfileLink', this.$route.name);
    }
  },
  methods: {
    chooseProfileLink(id) {
      this.$emit('active-menu', false);
      if (id === 'logout') {
        this.$store.dispatch('userLogout');
      } else {
        this.$store.commit('selectProfileLink', id);
        if (this.$route.path !== `/${id}`) {
          this.$router.push({ name: id });
        }
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_main
  height: 100vh

.profile_main .container .title
  margin: 50px 0

.profile_sidebar_wrapper
  width: 100%
  // background-color: var(--color-white)
  @include s
    // display: none

.profile_sidebar
  padding: 16px 40px 16px
  background-color: var(--color-white)
  @include s
    padding: 20px

.profile_sidebar.isActive
  @include s
    border: 1px solid var(--color-main)
    border-bottom: none
  // margin-bottom: 40px

.profile_sidebar__list
  display: flex
  flex-direction: column

.profile_sidebar__link
  display: flex
  align-items: center
  gap: 11px
  padding: 12px 40px
  margin: 0 -40px
  cursor: pointer
  position: relative
  @include xs
    gap: 8px

.profile_sidebar__link.active
  color: var(--color-main)
  font-weight: bold
  background-color: var(--color-main-light-bg)
  @include s
    margin: 0px -20px
    padding: 12px 20px

.profile_sidebar__link:last-child
  margin-top: 26px

.profile_sidebar__link span
  @include xs
    font-size: 16px

.profile_sidebar__link svg
  max-width: 20px
  max-height: 20px

.profile_sidebar__link:hover
  color: var(--color-main)

.profile_tasks_counter,
.profile_chat_counter
  position: absolute
  right: 20px
  top: 50%
  transform: translateY(-50%)
  width: 20px
  height: 20px
  font-size: 12px
  color: var(--color-white)
  background-color: var(--color-main)
  text-align: center
  display: flex
  justify-content: center
  align-items: center
  @include s
    right: 40px
  @include xs
    font-size: 12px !important

.profile_sidebar__link.active
  .profile_tasks_counter,
  .profile_chat_counter
    @include s
      right: 20px
</style>
