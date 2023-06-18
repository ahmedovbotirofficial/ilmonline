<template>
  <div v-click-outside.stop="closeAll" class="sorting_select">
    <div
      class="sorting_select__title"
      :class="{ hover: hover }"
      @click.stop="openMenu"
    >
      <span v-if="!!orderBy.id" class="order__title">
        {{ orderBy.title }}
      </span>
      <span v-else class="order__title">
        {{ $t(`sorting.${orderBy.title}`) }}
      </span>
      <svg-icon name="icon_filter_arrow" />
      <div class="sorting_select__wrapper">
        <div class="sorting_select__sort">
          <div class="sorting_select__list">
            <span
              v-for="{ title, id } in orderList"
              :key="id"
              class="sorting__link"
              :class="{ active: id === orderBy.id }"
              @click.stop="selectOrderBy(id)"
            >
              {{ title }}
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
      this.hover = true;
    },
    selectOrderBy(id) {
      this.hover = false;
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
  min-width: 284px
  border: 1px solid transparent
  transition: 0.2s
  height: 44px
  @include xs
    width: 100%

.sorting_select__title:hover,
.sorting_select__title.hover
  border: 1px solid var(--color-head-title)

.sorting_select__title.hover svg
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
  border: 1px solid var(--color-head-title)
  background-color: var(--color-white)
  padding: 14px 24px

.sorting_select__title.hover .sorting_select__wrapper
  visibility: visible
  opacity: 1

.sorting_select__list
  display: flex
  flex-direction: column

.sorting__link
  padding: 10px 0

.school-courses
  .sorting__link:hover
    background: var(--color-main-light-bg)

.pro-courses
  .sorting__link:hover
    background: var(--color-blue-light-bg)

.sorting__link:hover
  padding: 10px 23px
  margin: 0 -23px

.sorting__link.active
  color: var(--color-head-title)

.order__title
  font-size: 18px

.order--small
  font-weight: normal
  font-size: 14px
</style>
