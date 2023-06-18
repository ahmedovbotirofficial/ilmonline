<template>
  <div class="filter_sidebar_wrapper">
    <div class="filter_sidebar">
      <div v-if="isOpenedFiltersList" class="filter_sidebar_text__small">
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
          :filters-data="filters"
          @select-filters="selectedFilters"
        />
      </div>
      <div class="filters_sidebar__btns">
        <div
          v-if="isOpenedFiltersList"
          class="head_filtration__clear_btn"
          @click="clearAll"
        >
          <svg-icon name="icon_cross" />
          <span>
            {{ $t('buttons.clear_all_btn') }}
          </span>
        </div>
        <div
          v-if="isOpenedFiltersList"
          class="close_btn"
          @click.stop="closeFilters"
        >
          {{ $t('buttons.apply') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Filters from './Filters.vue';
import { mapGetters } from 'vuex';
import Loader from '@/elements/Loader/Loader.vue';

export default {
  components: {
    Filters,
    Loader,
  },
  props: {
    isOpenedFiltersList: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filters: [],

      openedDropFilters: false,
    };
  },

  computed: {
    typeOfFilters() {
      return Object.keys(this.filters);
    },

    ...mapGetters(['getSelectedLanguage']),
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchVacancyFilters();
    },
  },

  mounted() {
    // this.fetchCoursesFilters();
    this.fetchVacancyFilters();
  },

  async created() {
    await this.fetchVacancyFilters();

    // this.$store.commit('selectfilterLink', this.$route.name);
  },

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
    async fetchVacancyFilters() {
      this.filters = await this.$store.dispatch('getVacancyFilters');
    },
  },
};
</script>

<style lang="sass" scoped>
.filter_sidebar_wrapper
  padding: 0
  background-color: transparent
  max-height: 650px
  @include m
    max-height: fit-content

  @include s
    background: rgba(5, 12, 15, 0.4)

.filter_sidebar
  padding: 24px 40px 0px
  background-color: var(--color-white)
  height: 100%
  @include l
    padding: 24px 20px 0
  @include m
    padding: 20px 20px 0
  @include s
    padding: 20px 20px 20%
    width: 344px
    // height: auto
  @include xxs
    width: 100%

.filters_sidebar__btns div
  cursor: pointer
  @include xxs
    width: 50%
.filters_sidebar__btns div:nth-child(2)
  @include xxs
    padding-left: 42px
    border-left: 1px solid rgba(18, 50, 62, 0.2)
</style>
