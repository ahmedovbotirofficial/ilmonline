<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__container">
        <div class="footer__content">
          <div class="footer__item">
            <svg-icon :name="`icon_logo_${getCoursesMode}`" />
            <!-- <img src="@/assets/images/logo/logo_footer.png" alt="" /> -->
          </div>
          <div
            v-for="{ mainId, parentTitle, child } in footerList"
            :key="mainId"
            class="footer__item"
          >
            <div class="item__col">
              <div class="item__title">
                <span>{{ $t(`header.${parentTitle}.${getCoursesMode}`) }}</span>
              </div>
              <div
                v-for="{ id, link, title } in child"
                :key="id"
                class="item__link"
                @click="goTo(id)"
              >
                <span v-if="!!link">{{
                  $t(`header.${link}.${getCoursesMode}`)
                }}</span>
                <span v-else>{{ title }}</span>
              </div>
              <ModeSwitcher v-if="parentTitle === 'ilm'" />
            </div>
          </div>
        </div>

        <div class="footer__company">
          <div class="footer__company_logos">
            <a :href="telegramLink"><svg-icon name="telegram" /></a>
            <a href="https://www.facebook.com/ILM-Online-111096658108195"
              ><svg-icon name="icon_facebook_footer"
            /></a>
            <a href="https://www.instagram.com/ilmonline.uz/"
              ><svg-icon name="icon_insta_footer"
            /></a>
            <a href="https://www.youtube.com/channel/UCeIjF63A_mc_4MGPCMlK7PQ"
              ><svg-icon name="icon_youtube_footer"
            /></a>
            <a href="tiktok.com"><svg-icon name="icon_tiktok_footer" /></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
// import CompanyLogo from '@/components/Logo/CompanyLogo.vue';
import { mapGetters } from 'vuex';
import { scrollToBeginForm } from '@/helpers/scroll';
import ModeSwitcher from '@/elements/Switchers/ModeSwitcher';

export default {
  components: { ModeSwitcher },
  computed: {
    ...mapGetters([
      'getSelectedLanguage',
      'isAuthUser',
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getUserRole',
      'getFiltersOfCourses',
    ]),

    footerList() {
      const levels = {
        mainId: 1,
        parentTitle: 'lessons_for_students',
        child: this.getFiltersOfCourses.levels,
      };
      let footerList = [
        {
          mainId: 2,
          parentTitle: 'ilm',
          child: [
            {
              id: 'about',
              link: 'about',
            },
            {
              id: 'tests-main',
              link: 'trial_tests_title_footer',
            },
            {
              id: 'vacancy',
              link: 'vacancy',
            },
            {
              id: 'news',
              link: 'news',
            },
            {
              id: 'education',
              link: 'education',
            },
          ],
        },
        {
          mainId: 3,
          parentTitle: 'navigation',
          child: [
            {
              id: 'policy',
              link: 'policy',
            },
            {
              id: 'agreement',
              link: 'condition',
            },
            {
              id: 'profile',
              link: 'private_cabinet_footer',
            },
            {
              id: 'feedback',
              link: 'callback',
            },
          ],
        },
      ];
      footerList.unshift(levels);
      return footerList;
    },
    telegramLink() {
      if (this.getSelectedLanguage === 'ru') {
        return 'https://t.me/ilmonline';
      } else {
        return 'https://t.me/ilmonlineuz';
      }
    },
    currentYear() {
      return new Date().getFullYear();
    },
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchCoursesFilters();
    },
  },
  async created() {
    await this.$store.dispatch(
      `getAll${this.getCoursesModeDispatch}CoursesFilters`
    );
  },

  methods: {
    async fetchCoursesFilters() {
      await this.$store.dispatch(
        `getAll${this.getCoursesModeDispatch}CoursesFilters`
      );
    },
    goTo(id) {
      if (id === 'feedback') {
        this.$route.name !== 'first-page'
          ? this.$router.push({ name: 'first-page', hash: '#feedback' })
          : scrollToBeginForm('feedback');
      } else if (id === 'profile') {
        if (!this.isAuthUser) {
          this.$router.push({ name: 'sign' });
        } else {
          this.$router.push({ name: 'profile' });
        }
      } else if (typeof id === 'number') {
        this.$store.commit('setHeaderCoursesFilter', {
          type: 'levels',
          values: [id],
        });
        this.$router.push({ name: 'courses' });
      } else {
        this.$router.push({ name: id });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.footer
  background-color: var(--color-white)

.footer__container
  display: flex
  flex-direction: column
  padding-top: 53px

  @include s
    padding-top: 35px

  @include xs
    padding-top: 26px

.footer__content
  display: grid
  grid-template-columns: 1fr 1fr 1fr 1fr
  padding-bottom: 39px
  border-bottom: 1px solid rgba(18, 50, 62, 0.12)
  @include s
    grid-template-columns: 1.2fr 1fr 1fr
    grid-template-rows: 80px 1fr
  @include xxs
    grid-template-columns: 1fr
    grid-template-rows: 40px
    row-gap: 25px

.footer__item > svg
  position: relative
  top: -20px
  max-height: 90px
  max-width: 160px
  @include s
    max-width: 90px

.footer__item:first-child
  @include s
    grid-column: 1/-1

.item__col
  display: flex
  flex-direction: column
  gap: 10px

.item__title
  color: var(--color-main)
  font-size: 14px
  font-weight: bold
  text-transform: uppercase
  margin-bottom: 14px
  cursor: pointer
  @include xs
    font-size: 13px
  @include xxs
    margin-bottom: 0

.item__link
  display: flex
  align-items: center
  gap: 8px
  font-size: 14px
  @include xs
    font-size: 13px

.item__link > span
  position: relative
  cursor: pointer

.item__link:hover
  text-decoration: none
  color: var(--color-main)

.item__link:active
  color: var(--color-main)
  opacity: 0.8

.footer__company
  display: flex
  padding: 20px 0 24px
  justify-content: flex-end
  @include s
    padding: 20px 0 40px
  @include xxs
    padding: 10px 0
    flex-direction: column-reverse
    align-items: flex-start
    gap: 12px

.item_footer__text
  @include xxxs
    font-size: 12px

.item_footer__logo svg
  max-width: 100px
  max-height: 16px
  position: relative
  top: 2px

.item_footer
  display: flex
  align-items: center
  gap: 12px
  cursor: pointer

.footer__company_logos svg
  max-height: 28px
  max-width: 28px

.footer__company_logos
  display: flex
  align-items: center
  gap: 16px
  cursor: pointer
  @include xxxs
    margin-bottom: 12px
</style>
