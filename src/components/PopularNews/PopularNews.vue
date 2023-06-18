<template>
  <div id="main_news" class="news_wraper">
    <div class="container">
      <div class="news">
        <div class="news_row">
          <Heading level="2">{{ $t('titles.news') }}</Heading>
        </div>

        <div v-if="windowWidth > 710" class="news_cards_wrapper">
          <NewsEventsCard
            v-for="card in posts"
            :key="card.id"
            :occurrent-data="card"
          />
        </div>

        <div v-else class="news_cards_carousel_wrapper">
          <v-carousel v-model="model" hide-delimiters height="100%">
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

            <v-carousel-item
              v-for="item in posts"
              :key="item.id"
              item-disabled="container"
              class="occurrent_wrapper__background"
            >
              <v-sheet :item="item" height="100%" tile>
                <v-row class="fill-height" align="center" justify="center">
                  <NewsEventsCard
                    :key="item.id"
                    :window-width="windowWidth"
                    :occurrent-data="item"
                  />
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </div>

        <ButtonBase
          color="orange"
          :size="getWindowWidth < 540 ? 'max' : 'big'"
          class="more_news_btn"
          @click.native="goToNewsPage"
          >{{ $t('buttons.more_news_and_events_btn') }}</ButtonBase
        >
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import NewsEventsCard from '@/components/NewsEventsCard/NewsEventsCard.vue';
import { mapGetters } from 'vuex';

export default {
  components: { Heading, ButtonBase, NewsEventsCard },

  data() {
    return {
      model: 0,
      windowWidth: document.documentElement.clientWidth,
      isLoader: false,

      posts: [],
    };
  },

  computed: {
    ...mapGetters(['getSelectedLanguage', 'getWindowWidth']),
  },
  watch: {
    getSelectedLanguage(value) {
      value && this.fetchNewsList();
    },
  },

  mounted() {
    window.addEventListener('resize', this.windowWidthListener);
    this.fetchNewsList();
  },

  methods: {
    async fetchNewsList() {
      this.isLoader = true;
      let res = await this.$store.dispatch('getNewsDigestList');
      this.posts = res.posts;
      this.isLoader = !this.posts;
    },

    goToNewsPage() {
      this.$router.push({ name: 'news' });
    },

    selectFilter(id) {
      this.selectedFilterNews = id;
      this.$emit('choose-filter', id);
    },

    windowWidthListener() {
      this.windowWidth = document.documentElement.clientWidth;
    },
  },
};
</script>

<style lang="sass" scoped>
.news_wraper
  background-color: var(--color-white)

.news
  padding: 73px 0 120px
  @include xxs
    padding: 50px 0

.pro-courses .news_row .title--2
  @include s
  font-weight: 600
  font-size: 34.1333px
  line-height: 43px

.news_row
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 45px

.news_filters_btns
  display: grid
  grid-template-columns: repeat(3, minmax(175px, 175px))
  margin-bottom: 67px

.news_filter_btn
  display: flex
  align-items: center
  justify-content: center
  padding: 6px 0
  cursor: pointer

.news_filter_btn:hover
  color: var(--color-main)

.news_filter_btn.active
  outline: 1px solid var(--color-main)

.news_cards_wrapper
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  column-gap: 6%
  row-gap: 60px
  margin-bottom: 60px
  @media screen and (max-width: 1150px)
    column-gap: 4%
  @include s
    display: flex
    justify-content: space-between
  @media screen and (max-width: 768px)
    display: grid
    grid-template-columns: 1fr 1fr

.more_news_btn
  display: flex
  justify-content: center
  @include xxs

.news_cards_carousel_wrapper
  margin: 0 -14px 40px
#main_news
  max-width: 100%
  overflow: hidden

.news_cards_carousel_wrapper .occurrent_wrapper__background
  margin: 0 auto
</style>
