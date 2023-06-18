<template>
  <div class="filter_sidebar_wrapper">
    <div class="filter_sidebar">
      <div
        class="lessons_filter__drop_menu_cross"
        :class="{ active: openedFilters }"
        @click.stop="openFilters"
      ></div>
      <div v-if="openedFilters" class="filter_sidebar_text__small">
        <svg-icon name="icon_filter" />
        <span>
          {{ $t('buttons.filtration_btn') }}
        </span>
      </div>

      <div class="filter_sidebar__list">
        <Loader v-if="!typeOfFilters.length" color="orange" />
        <Filters
          v-for="type in typeOfFilters"
          v-else
          :key="type"
          :type="type"
          :filters-data="getFiltersOfCourses"
          @select-filters="selectedFilters"
        />
      </div>
      <div class="filters_sidebar__btns">
        <div
          v-if="openedFilters"
          class="head_filtration__clear_btn"
          @click="clearAll"
        >
          <svg-icon name="icon_cross" />
          <span>
            {{ $t('buttons.clear_all_btn') }}
          </span>
        </div>
        <div v-if="openedFilters" class="close_btn" @click.stop="closeFilters">
          {{ $t('buttons.apply') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Filters from '@/components/AllCoursesPage/Filters.vue';
import { mapGetters } from 'vuex';
import Loader from '@/elements/Loader/Loader.vue';

export default {
  components: {
    Filters,
    Loader,
  },
  props: {
    openedFilters: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      openedDropFilters: false,
    };
  },

  computed: {
    typeOfFilters() {
      return Object.keys(this.getFiltersOfCourses);
    },

    ...mapGetters([
      'getCoursesModeDispatch',
      'getSelectedLanguage',
      'getFiltersOfCourses',
    ]),
  },

  async created() {},
  methods: {
    clearAll() {
      this.$emit('clear-all-filters', true);
    },
    closeFilters() {
      this.openedDropFilters = false;
      this.$emit('close-drop-filters', this.openedDropFilters);
    },

    selectedFilters(dataSelectedFilters) {
      this.$emit('select-filters', dataSelectedFilters);
    },
    selectRating(rating) {
      this.$emit('select-rating', rating);
    },
    openFilters() {
      this.$emit('close-btn');
    },
  },
};
</script>

<style lang="sass" scoped>
.filter_sidebar_wrapper
  padding: 0
  background-color: transparent

  @include s
    background: rgba(5, 12, 15, 0.4)

.filter_sidebar
  background-color: #fff
  padding: 24px 40px 0px
  height: 100%
  @include l
    padding: 24px 20px 0
  @include m
    padding: 20px 20px 0
  @include s
    padding: 20px 20px 20%
    width: 344px
    height: auto
  @include xxs
    min-width: 100%
    width: 100%

.filters_sidebar__btns div
  cursor: pointer
  width: 50%
  text-align: center

// .filters_sidebar__btns div:nth-child(2)
//   @include xxs
//     border-left: 1px solid rgba(18, 50, 62, 0.2)

.lessons_filter__drop_menu_cross
  cursor: pointer
  position: absolute
  left: -50px
  top: 24px
  height: 48px
  width: 48px
  content: ''
  background-image: url(/images/filter_cross.svg)
  background-position: center
  background-color: var(--color-white)
  z-index: 50
  transition: 0.5s
  @include xxs
    left: auto
    right: 540px

.active.lessons_filter__drop_menu_cross
  transform: translateX(417px)
  @include xxs
    right: 340px
    transform: translateX(317px)
    top: 12px
</style>
