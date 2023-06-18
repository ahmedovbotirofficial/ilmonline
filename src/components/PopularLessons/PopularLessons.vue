<template>
  <div id="main_lessons" class="page_lessons_wrapper">
    <div class="container">
      <div class="page_lessons">
        <div class="page_lessons__column">
          <Heading level="2">{{
            $t(`mainPage.popular_coursies.${getCoursesMode}`)
          }}</Heading>
          <div class="page_lessons__subtile">
            {{ $t(`mainPage.popular_class.${getCoursesMode}`) }}
          </div>
        </div>

        <div v-if="isLoader" class="page_lessons__cards">
          <span></span>
          <Loader color="orange" />
        </div>
        <div v-else-if="windowWidth > 710" class="page_lessons__cards">
          <LessonCard
            v-for="card in cardsData"
            :key="card.id"
            :cards-data="card"
          />
        </div>

        <div v-else class="page_lessons__cards_carousel">
          <v-carousel
            v-model="model"
            item-disabled="container"
            hide-delimiters
            height="100%"
          >
            <template v-slot:next="{ on, attrs }">
              <v-btn
                height="110"
                width="124"
                absolute
                fab
                color="#EC5239"
                v-bind="attrs"
                v-on="on"
              >
                <svg-icon name="arrow_carousel_right" />
              </v-btn>
            </template>
            <template v-slot:prev="{ on, attrs }">
              <v-btn
                height="110"
                width="124"
                absolute
                fab
                color="#EC5239"
                v-bind="attrs"
                v-on="on"
              >
                <svg-icon name="arrow_carousel_left" />
              </v-btn>
            </template>

            <v-carousel-item v-for="item in cardsData" :key="item.id">
              <v-sheet :item="item" height="100%" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <LessonCard
                    :key="item.id"
                    :window-width="windowWidth"
                    :cards-data="item"
                  />
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import LessonCard from '@/components/LessonCard/LessonCard.vue';
import Loader from '@/elements/Loader/Loader.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
    LessonCard,
    Loader,
    // ButtonBase,
  },
  data() {
    return {
      model: 0,
      cardsData: [],
      windowWidth: document.documentElement.clientWidth,

      isLoader: false,
    };
  },
  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getSelectedLanguage',
      'getCoursesModeDispatch',
    ]),
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchCoursesList();
    },
  },
  mounted() {
    this.fetchCoursesList();
    window.addEventListener('resize', this.windowWidthListener);
  },
  methods: {
    async fetchCoursesList() {
      this.isLoader = true;
      let res = await this.$store.dispatch(
        `getPopular${this.getCoursesModeDispatch}CoursesList`
      );
      this.cardsData = [...res];
      this.isLoader = !res.length;
    },

    windowWidthListener() {
      this.windowWidth = document.documentElement.clientWidth;
    },
  },
};
</script>

<style lang="sass" scoped>
.page_lessons_wrapper
  background-color: var(--color-white)
  padding-bottom: 60px
  @include xs
    padding-bottom: 40px

.page_lessons
  padding-top: 120px
  @include xxs
    padding-top: 50px

.page_lessons__column .title--2
  color: #1B3138

.page_lessons__subtile
  font-size: 18px
  max-width: 430px
  padding: 16px 0 52px
  line-height: 26px
  opacity: 0.8

.page_lessons__cards
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  column-gap: 6%
  row-gap: 60px

  @media screen and (max-width: 1150px)
    column-gap: 4%
  @include s
    grid-template-columns: 1fr 1fr

.page_lessons__cards_carousel
  margin: 0 -14px 0

.page_lessons__cards_carousel .card_lesson_background
  margin: 0 auto
  @media screen and (max-width: 360px)
    margin: 0 14px
</style>
