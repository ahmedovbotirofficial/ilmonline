<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="trial_current_direction">
    <div
      v-if="!!getTrialCategories.length"
      class="trial_current_direction__header"
    >
      <div class="container">
        <Heading
          level="2"
          v-html="
            $t('tests.trial_direction_test_header', {
              direction: getTrialCategories.find(
                (el) => el.slug === this.$route.params.direction
              ).title,
            })
          "
        />
      </div>
    </div>

    <div class="trial_current_direction__main container">
      <div v-for="item in schoolItmes" :key="item[0]" class="direction_block">
        <div class="direction_block__subtitle">
          <span>{{ $t(`tests.${item[0]}`) }}</span>
          <div></div>
        </div>

        <div class="direction_block__cards">
          <TrialTestCard
            v-for="card in item[1]"
            :key="card.id"
            :test-by-directions-data="card"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import TrialTestCard from '@/components/Tests/TrialTests/TrialTestCard.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    Heading,
    // ButtonBase,
    TrialTestCard,
  },
  data() {
    return {
      title: null,
      direction: [],
    };
  },

  computed: {
    ...mapGetters([
      'getTrialSchoolItems',
      'getTrialCategories',
      'getSelectedLanguage',
    ]),
    schoolItmes() {
      return Object.entries(this.getTrialSchoolItems);
    },
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchTrialTestList();
    },
  },

  async created() {
    await this.fetchTrialTestList();
  },

  methods: {
    getLabel() {
      let CURRENT_BREAD_LABEL = this.getTrialCategories.find(
        (el) => el.id === +this.$route.params.school_id
      ).title;
      this.$store.commit('SET_CURR_BREAD_LABEL', {
        direction: CURRENT_BREAD_LABEL,
        school_id: +this.$route.params.school_id,
      });
    },
    async fetchTrialTestList() {
      const fetchSchoolItems = this.$store.dispatch('getTrialSchoolItem', {
        school_id: +this.$route.params.school_id,
      });
      await this.$store.dispatch('getTrialTestCategories');
      await fetchSchoolItems;

      this.getLabel();
    },
  },
};
</script>

<style lang="sass" scoped>
.trial_current_direction__header
  margin: 60px 0

.trial_current_direction__main
  @include xxs
    margin-bottom: 100px

.direction_block__subtitle
  display: flex
  align-items: center
  gap: 15px
  font-size: 18px
  font-weight: bold
  margin-bottom: 30px

.direction_block__subtitle div
  width: 100%
  border-bottom: 1px solid #D8D8D8

.direction_block__cards
  display: grid
  grid-template-columns: repeat(3, 29.15%)
  gap: 6%
  margin-bottom: 60px
  @include s
    grid-template-columns: repeat(2, 47%)
  @include xxs
    grid-template-columns: 1fr
    gap: 0
</style>
