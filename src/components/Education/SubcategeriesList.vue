<template>
  <ul class="subcategories_list">
    <li
      v-for="item in subcategories"
      :key="item.slug"
      class="subcategory_list__item"
      @click="openSubcategoryItems(item.slug)"
    >
      <h4 class="title-main">
        {{ item.title }} <svg-icon name="arrow-back" />
      </h4>
      <p class="subcategory__text">{{ item.description }}</p>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    subcategories: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    openSubcategoryItems(sub_slug) {
      this.$router.push({
        name: 'subcategory-articles',
        params: {
          category_slug: this.$route.params.category_slug,
          subcategory_slug: sub_slug,
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.subcategories_list li::after
  display: none
.subcategory__text
  font-size: 16px
  font-weight: 400
  line-height: 22px
.subcategories_list
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin: 60px 0
  cursor: pointer
  @include m
    margin: 32px 0
  @include xs
    justify-content: center
  li
    max-width: 373px
    padding: 32px
    width: 29%
    border: 1px solid #D8D8D8
    background-color: white
    margin-bottom: 60px
    @include m
      width: 48%
      margin-bottom: 20px
      padding: 20px
    @media only screen and (max-width: 768px)
      width: 47%
    @include xs
      width: 100%
      justify-content: center
      margin: 0 auto 20px
.title-main
  display: flex
  align-items: center
  font-size: 24px
  font-weight: 600
  line-height: 28px
  margin-bottom: 13px
  svg
    margin-left: 13px
</style>
