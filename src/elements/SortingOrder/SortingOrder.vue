<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-click-outside.stop="closeAll" class="sorting_select">
    <div
      class="sorting_select__title"
      :class="{ active: hover }"
      @click="openMenu"
    >
      <span class="order__title" v-html="$t(`sorting.${orderBy.title}`)"></span>
      <svg-icon name="icon_filter_arrow" />
      <div class="sorting_select__wrapper">
        <div class="sorting_select__sort">
          <div class="sorting_select__list">
            <span
              v-for="{ title, id } in orderList"
              :key="id"
              class="sorting__link"
              :class="{ active: id === orderBy.id }"
              @click="selectOrderBy(id)"
              v-html="$t(`sorting.${title}`)"
            >
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderList: {
      type: Array,
      default: () => [],
    },
    orderBy: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      hover: false,
    };
  },

  methods: {
    closeAll() {
      this.hover = false;
    },
    openMenu() {
      this.hover = !this.hover;
    },
    leaveHover() {
      this.hover = false;
    },
    selectOrderBy(id) {
      this.$emit('selectOrderBy', id);
    },
  },
};
</script>

<style lang="sass" scoped>
.sorting_select
  position: relative
  display: flex
  align-items: center
  gap: 8px
  @include xs
    width: 100%
    justify-content: center

.sorting_select span
  white-space: nowrap

.sorting_select svg
  position: relative
  top: 2px
  width: 8px

.sorting_select__title
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  justify-self: end
  background-color: var(--color-white)
  padding: 10px 24px
  font-weight: bold
  font-size: 14px
  cursor: pointer
  min-width: 254px
  border: 1px solid transparent
  transition: 0.2s
  @include xs
    justify-content: center
    width: 100%

.sorting_select__title:hover,
.sorting_select__title.active
  border: 1px solid var(--color-main)

.sorting_select__title.active svg
  transform: rotate(180deg)

.sorting_select__wrapper
  visibility: hidden
  opacity: 0
  position: absolute
  cursor: pointer
  z-index: 10
  top: 46px
  right: 0
  font-size: 16px
  width: 100%
  right: 0
  background: none
  transition: 0.2s
  min-width: 284px
  @include xs
    max-width: 100%

.sorting_select__sort
  // box-shadow: 0px 4px 32px rgba(181, 181, 181, 0.16)
  display: flex
  flex-direction: column
  margin-top: 8px
  border: 1px solid var(--color-main)
  background-color: var(--color-white)
  padding: 14px 24px

.sorting_select__title.active .sorting_select__wrapper
  visibility: visible
  opacity: 1

.sorting_select__list
  display: flex
  flex-direction: column

.sorting__link
  padding: 10px 0

.sorting__link:hover
  background: var(--color-main-light-bg)
  padding: 10px 23px
  margin: 0 -23px

.sorting__link.active
  color: var(--color-main)

.order__title
  font-size: 18px

.order--small
  font-weight: normal
  font-size: 14px
</style>
