<template>
  <div class="trial_list">
    <TrialTestHeader
      svg-name="trial_header_icon"
      :title="headerTitle"
      :img="'trial_header_img_test'"
    />
    <div class="container">
      <div v-if="!!getTrialTestList.length" class="tiral_list__items">
        <div
          v-for="item in getTrialTestList"
          :key="item.id"
          class="tiral_list__item"
          :class="{ passed: item.status === 'passed' }"
          @click="goToTrialTestPassing(item)"
        >
          <span>{{ item.title }}</span>
          <svg-icon name="trial_arrow_right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrialTestHeader from '@/components/Tests/TrialTests/TrialTestHeader.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { ClientJS } from 'clientjs';

export default {
  components: {
    TrialTestHeader,
  },

  data() {
    return {
      variant_id: 1,
      variantTest: null,
    };
  },

  computed: {
    ...mapGetters([
      'getTrialCategories',
      'getMyTrialTest',
      'getSelectedLanguage',
      'getTrialTestList',
      'getUniqueUserID',
      'isAuthUser',
    ]),

    headerTitle() {
      return !!this.getTrialCategories.length
        ? this.$t('tests.trial_direction_test_header', {
            direction: this.getTrialCategories.find(
              (el) => el.slug === this.$route.params.direction
            ).title,
          })
        : '';
    },
  },

  watch: {
    getSelectedLanguage(value) {
      value && this.fetchTrialTestList();
    },
  },

  async created() {
    await this.createUniqueUserID();
    await this.fetchTrialTestList();
  },

  methods: {
    async fetchTrialTestList() {
      await this.$store.dispatch('getTrialTestCategories');
      await this.$store.dispatch('getTrialTestList', {
        category_id: this.$route.params.category_id,
        token: this.isAuthUser ? null : this.getUniqueUserID,
      });
      this.getLabel();
    },

    async goToTrialTestPassing(item) {
      await this.$store.dispatch('startTrialTestVariant', {
        variant_id: item.id,
        token: this.isAuthUser ? null : this.getUniqueUserID,
      });
      this.$router.push({
        name: 'trial-test-variant',
        params: {
          direction: this.$route.params.direction,
          category_id: this.$route.params.category_id,
          variant_list_name: this.$route.params.variant_list_name,
          variant_id: item.id,
          try_id: this.getMyTrialTest.id,
        },
      });
    },

    createUniqueUserID() {
      const client = new ClientJS();
      if (!this.isAuthUser) {
        this.$store.commit('SET_FINGERPRINT', client.getFingerprint());
      }
    },

    getLabel() {
      this.$store.commit('SET_CURR_BREAD_LABEL', {
        direction: this.getTrialCategories.find(
          (el) => el.slug === this.$route.params.direction
        ).title,
        category_id: +this.$route.params.category_id,
        variant_list_name: this.$t('tests.variants'),
        school_id: +this.$route.params.school_id,
      });
    },

    transformDate(date) {
      return moment(date).format('X');
    },
  },
};
</script>

<style lang="sass" scoped>
.tiral_list__items
  display: grid
  grid-template-columns: repeat(auto-fill, 14.5%)
  gap: 32px
  margin-bottom: 150px
  justify-content: center
  @include m
    grid-template-columns: repeat(auto-fill, 22.5%)
  @include s
    grid-template-columns: repeat(auto-fill, 30%)
  @include xs
    grid-template-columns: repeat(auto-fill, 47%)
    gap: 16px
  @media screen and (max-width: 374px)
    grid-template-columns: 1fr

.tiral_list__item
  display: flex
  align-items: center
  justify-content: space-between
  padding: 16px 20px
  background-color: var(--color-white)
  font-size: 20px
  cursor: pointer

  @media screen and (max-width: 420px)
    padding: 16px 15px
  @media screen and (max-width: 350px)
    padding: 16px 20px

.tiral_list__item:hover
  outline: 1px solid var(--color-main)

.tiral_list__item.passed
  color: var(--color-main)

.tiral_list__item svg
  max-width: 14px
</style>
