<template>
  <div class="profile_main">
    <template v-if="!!myTests">
      <div v-if="myTests.length" class="profile_students">
        <div class="students_table_container">
          <div class="students_table_wrapper">
            <div class="students_table__header">
              <div
                v-for="title in tableHeader"
                :key="title"
                class="header__title"
              >
                {{ $t(`table.${title}`) }}
              </div>
            </div>

            <div
              v-for="{
                id,
                school_item_title,
                created_at,
                grade,
                avg_result,
              } in myTests"
              :key="id"
              class="students_table__content_container"
              @click="goToResults(id)"
            >
              <div class="students_table__content">
                <div class="content__value title">{{ school_item_title }}</div>
                <div class="content__value">
                  {{ normalizeStartDate(created_at) }}
                </div>
                <div class="content__value big_circle_avg">
                  <vue-ellipse-progress
                    :progress="grade"
                    :color="
                      grade <= 40
                        ? '#EC5239'
                        : grade <= 50
                        ? '#F7CD46'
                        : grade <= 85
                        ? '#F2994A'
                        : '#59C676'
                    "
                    empty-color="#C4C4C4"
                    :size="50"
                    :thickness="4"
                    :legend="true"
                    :empty-thickness="1.3"
                  />
                </div>
                <div v-if="!!avg_result" class="content__value circle_avg">
                  <vue-ellipse-progress
                    :progress="avg_result"
                    :color="
                      avg_result <= 40
                        ? '#EC5239'
                        : avg_result <= 50
                        ? '#F7CD46'
                        : avg_result <= 85
                        ? '#F2994A'
                        : '#59C676'
                    "
                    empty-color="#C4C4C4"
                    :size="42"
                    :thickness="3"
                    :legend="true"
                    empty-thickness="1"
                  />
                </div>
                <span v-if="!avg_result" class="content__value_no_results">
                  {{ $t('profilePage.have_not_results') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isShowPagination" class="students_table__paginate">
          <Paginate
            :page-count="pagesCount"
            :force-page="currentPage"
            :value="currentPage"
            :click-handler="pageChangeHandler"
            :prev-text="''"
            :next-text="''"
            :container-class="'pagination'"
            :page-class="'pagination_el'"
            :prev-class="'prev_arrow'"
            :next-class="'next_arrow'"
          />
        </div>
      </div>
      <div v-else class="profile_no_tests">
        <div class="profile_no_tests__title">
          {{ $t('profilePage.have_not_tests') }}
        </div>
        <div class="profile_no_tests__text">
          {{ $t('profilePage.choose_direction') }}
        </div>
        <ButtonBase
          color="orange"
          size="popular"
          type="submit"
          class="current_lesson__btn"
          @click.native="goToTrialTests"
        >
          <span>
            {{ $t('buttons.go_to_tests') }}
          </span>
        </ButtonBase>
      </div>
    </template>
    <Loader v-else color="orange"></Loader>
  </div>
</template>

<script>
import moment from 'moment';
import Loader from '@/elements/Loader/Loader.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';
export default {
  components: { ButtonBase, Loader },
  data() {
    return {
      header: ['school_item_title', 'created_at', 'grade', 'avg_result'],
      myTests: null,
      testsPerPage: 1,
      pagesCount: 1,
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters(['getWindowWidth']),

    tableHeader() {
      return this.header;
    },

    isShowPagination() {
      return this.pagesCount > 1;
    },
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchMyTrialTests();
    },
  },
  async created() {
    this.currentPage = this.$route.query.page ? +this.$route.query.page : 1;
    await this.fetchMyTrialTests();
  },
  mounted() {},
  methods: {
    async fetchMyTrialTests() {
      this.isLoader = true;
      const res = await this.$store.dispatch('getMyTrialTests', {
        page: this.currentPage,
      });
      this.myTests = res.data;
      this.testsPerPage = res.per_page;
      this.pagesCount = res.last_page;
    },
    pageChangeHandler(selectedPage) {
      this.currentPage = +selectedPage;
      this.fetchMyTrialTests();
    },
    normalizeStartDate(date) {
      return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
    },
    goToTrialTests() {
      this.$router.push({ name: 'tests-main' });
    },

    goToResults(id) {
      this.$router.push({
        name: 'trial-list-results',
        params: {
          try_id: id,
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_main
  @include xs
    overflow: hidden

.students_table_container
  @include s
   overflow: scroll

.students_table_wrapper
  background-color: var(--color-white)
  margin-bottom: 40px
  @media screen and (max-width: 680px)
    width: 125%
  @media screen and (max-width: 520px)
    width: 185%



.students_table__header,
.students_table__content
  cursor: pointer
  display: grid
  grid-template-columns: 44% 19% 19% 24%
  background-color: var(--color-white)
  @include s
    grid-template-columns: 25% 25% 25% 25%
  @include xs
    grid-template-columns: 25% 25% 25% 25%
  @include xxs
    grid-template-columns: 25% 25% 25% 25%

.students_table__content_container
  background-color: #12323E

.students_table__content:hover
  transform: translate(4px, -4px)
  // border-left: 1px solid #12323E
  // border-right: 1px solid #12323E
  // border-top: 1px solid #12323E
  outline: 1px solid #12323E

.students_table__header
  padding: 15px 40px
  border-bottom: 2px solid rgba(150, 150, 150, 0.2)
  @include xs
    padding: 15px 25px

.header__title,
.content__value
  display: flex
  align-items: center
  @include xxs
    font-size: 14px

.content__value.circle_avg
  justify-content: center

.header__title
  max-width: 160px
  opacity: 0.5
  font-size: 14px
  @include s
    max-width: 100%

.header__title_adaptive
  display: none
  @include xxs
    display: block
    opacity: 0.5
    font-size: 14px
  @include xxxs
    font-size: 12px

.students_table__content
  padding: 12px 40px
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)
  @include xs
    padding: 12px 25px

.content__value.title
  font-weight: bold
  font-size: 16px
  @include xs
    font-size: 14px

.content__value svg
  max-width: 56px
  max-height: 56px

.content__value.circle_avg svg
  max-width: 42px
  max-height: 42px

.content__value.big_circle_avg
  position: relative
  left: 15px

.content__value_no_results
  display: flex
  align-items: center
  text-align: center
  @include xs
    font-size: 14px

.students_table__paginate
  display: flex
  justify-content: flex-end

.profile_no_tests
  display: flex
  align-items: center
  flex-direction: column
  padding: 20px 40px
  border: 1px solid var(--color-main)
  @include xxs
    padding: 20px 16px

.profile_no_tests__title,
.profile_no_tests__text
  color: var(--primary-font-color)
  text-align: center

.profile_no_tests__title
  font-weight: 500
  font-size: 24px
  line-height: 32px
  @include xxs
    font-size: 18px
    line-height: 22px

.profile_no_tests__text
  font-size: 18px
  line-height: 28px
  margin: 16px 0 40px 0
  @include xxs
    font-size: 14px
    line-height: 18px
</style>
