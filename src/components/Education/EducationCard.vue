<template>
  <div>
    <Loader v-if="items.length === 0" color="orange" />
    <div v-else-if="items && isCategory" class="categories__list">
      <div
        v-for="{ title, slug, description, poster_url } in items"
        :key="slug"
        class="categories__list_item"
        @click="openSubcategory(slug, title)"
      >
        <img :src="`${poster_url}`" />
        <div class="text-content">
          <h4 class="title">{{ title }}</h4>
          <p class="description">{{ description }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="items && !isCategory" class="categories__list">
      <div
        v-for="article in items"
        :key="article.id"
        class="categories__list_item"
        @click="openDetailCard(article)"
      >
        <img :src="`${article.poster_url}`" />
        <div class="text-content">
          <div class="sub-content">
            <p class="date">{{ article.published_at }}</p>
            <div class="like_container">
              <svg-icon name="like_sign" />
              <p class="evaluation">
                {{ article.likes_count }}
              </p>
            </div>
          </div>
          <h4 class="title">{{ article.title }}</h4>
          <p class="description">{{ article.category.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/elements/Loader/Loader';
import { setToLS } from '@/library/helpers';
export default {
  components: {
    Loader,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isCategory: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    openSubcategory(slug, title) {
      this.$router.push({
        name: 'education-category',
        params: { category_slug: slug, category_title: title },
      });
      setToLS('subcategoryTitle', title);
    },
    async openDetailCard({ slug }) {
      await this.$router.push({
        name: 'current-article',
        params: {
          category_slug: this.$route.params.category_slug,
          subcategory_slug: this.$route.params.subcategory_slug,
          article_slug: slug,
        },
      });
      await this.$store.dispatch('getArticleDetailsData', slug);
    },
  },
};
</script>

<style lang="sass" scoped>
.date
  color: #949AA1
  font-size: 14px
.sub-content
  margin-bottom: 12px
  display: flex
  justify-content: space-between
.like_container
  align-items: center
  display: flex
  flex-wrap: wrap
  svg
    margin-right: 6px

.categories__list_item .title
  font-size: 20px
  font-style: normal
  font-weight: 600
  line-height: 28px
  letter-spacing: 0em
  text-align: left
  margin-bottom: 8px
  @include m
    font-size: 16px
    line-height: 18px

.categories__list_item .description
  font-size: 16px
  line-height: 22px
  height: 50px
  text-overflow: ellipsis
  overflow: hidden
  overflow-y: scroll

.categories__list_item .description::-webkit-scrollbar
  display: none

.categories__list
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(373px, 1fr))
  margin: 50px 0 120px
  row-gap: 60px
  column-gap: 6%
  @include s
    grid-template-columns: repeat(auto-fill, minmax(334px, 1fr))
    margin: 50px 0 80px
    column-gap: 2%
    row-gap: 20px
  @include xxs
    grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))

.categories__list .categories__list_item img
  max-width: calc(100% + 2px)
  width: calc(100% + 2px)
  position: relative
  left: -1px
  right: -1px
  top: -1px

.categories__list .categories__list_item
  max-width: 373px
  background-color: white
  border: 1px solid #D8D8D8
  cursor: pointer
  @include s
    max-width: 334px
  .text-content
    background-color: white
    border-top: none
    padding: 16px 35px
    margin-top: -4px
    @include xs
      padding: 16px 20px
      height: auto

.categories__list .categories__list_item:nth-child(even)
  justify-self: start
  @media only screen and (max-width: 720px)
    justify-self: center
.categories__list .categories__list_item:nth-child(odd)
  justify-self: end
  @media only screen and (max-width: 720px)
    justify-self: center

.categories__list_item .title
  font-size: 20px
  font-style: normal
  font-weight: 600
  line-height: 28px
  letter-spacing: 0em
  text-align: left
  margin-bottom: 8px
  @include m
    font-size: 16px
    line-height: 18px

.categories__list_item .description
  font-size: 16px
  line-height: 22px
</style>
