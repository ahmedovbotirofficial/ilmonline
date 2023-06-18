<template>
  <div>
    <div class="list_title" @click="showChoosenFilters">
      {{ $t(`header.${type}.${getCoursesMode}`) }}
      <svg-icon
        :name="`icon_cross_orange_${getCoursesMode}`"
        :class="showFilters ? 'rotate' : ''"
      />
    </div>
    <template v-if="showFilters">
      <div v-for="{ id, title } in filtersData[type]" :key="id">
        <div
          class="level__select"
          :class="{ hover: hoverId === id }"
          @mouseover="hoverHandler(id)"
          @mouseleave="unHoverHandler"
          @click="selectedFilter(id, type)"
        >
          <div
            class="level__checkbox"
            :class="{
              selected:
                selectedCheckbox.includes(id) ||
                (!!getHeaderCoursesFilter &&
                  getHeaderCoursesFilter.type === type &&
                  getHeaderCoursesFilter.values[0] === id),
            }"
          >
            <div
              v-if="
                selectedCheckbox.includes(id) ||
                (!!getHeaderCoursesFilter &&
                  getHeaderCoursesFilter.type === type &&
                  getHeaderCoursesFilter.values[0] === id)
              "
              class="level__checkbox--center"
            ></div>
          </div>
          <div v-if="type === 'ratings'" class="level__rating">
            <span class="level__rating_title">{{ title }}</span>
            <star-rating
              :rating="id"
              read-only
              :star-size="14"
              :fixed-points="1"
              :show-rating="false"
              inactive-color="#FFEBD4"
              active-color="#FF9B26"
            />
          </div>

          <span v-else>{{ title }} </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StarRating from 'vue-star-rating';
export default {
  components: {
    StarRating,
  },

  props: {
    filtersData: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      showFilters: true,
      selectedCheckbox: [],
      hoverId: null,
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesFilterStatus',
      'getHeaderCoursesFilter',
      'getCoursesMode',
      'getAllCoursesStatus',
    ]),
  },

  watch: {
    getCoursesFilterStatus(value) {
      if (value) {
        this.selectedCheckbox = [];
      }
    },
    getAllCoursesStatus(value) {
      if (value) {
        this.selectedCheckbox = [];
      }
    },
  },

  methods: {
    selectedFilter(filterId) {
      if (
        this.selectedCheckbox.includes(filterId) ||
        (!!this.getHeaderCoursesFilter &&
          this.getHeaderCoursesFilter.type === this.type &&
          this.getHeaderCoursesFilter.values[0] === filterId)
      ) {
        this.selectedCheckbox = this.selectedCheckbox.filter(
          (el) => el !== filterId
        );
        if (!!this.getHeaderCoursesFilter) {
          this.selectedCheckbox = this.selectedCheckbox.filter(
            (el) =>
              el !== this.getHeaderCoursesFilter.values[0] && el !== filterId
          );
        }
        this.hoverId = null;
        this.$store.commit('setHeaderCoursesFilter', null);
      } else {
        this.selectedCheckbox.push(filterId);
        if (
          !!this.getHeaderCoursesFilter &&
          this.getHeaderCoursesFilter.type === this.type
        ) {
          this.selectedCheckbox = [
            ...this.selectedCheckbox,
            ...this.getHeaderCoursesFilter.values,
          ];
          this.$store.commit('setHeaderCoursesFilter', null);
        }
      }
      // console.log('this.selectedCheckbox <<<', this.selectedCheckbox);

      this.$store.commit('clearCheckboxes', false);
      this.$emit('select-filters', {
        type: this.type,
        values: this.selectedCheckbox,
      });
    },

    //////////////////////////// helpers
    hoverHandler(id) {
      this.hoverId = id;
    },
    unHoverHandler() {
      this.hoverId = null;
    },
    showChoosenFilters() {
      this.showFilters = !this.showFilters;
    },
  },
};
</script>

<style lang="sass" scoped>
.list_title
  color: var(--color-main)

.filter_main_levels__child_wrapper
  display: flex
  gap: 16px
  margin-bottom: 24px

.filter_main_levels__child
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  height: 40px
  width: 40px
  border: 1px solid #000

.level__select
  .level__rating
    display: flex
    gap: 5px

  .level__rating_title
    color: #FF9B26
    font-weight: 600
</style>
