<template>
  <div class="profile_main">
    <div class="profile_inside" :class="{ loading: !categoriesList.length }">
      <Loader v-if="!categoriesList.length" color="orange" />

      <template v-else>
        <Heading level="4">{{ $t('titles.directions') }}</Heading>
        <div class="directions__checkbox_wrapper">
          <div
            v-for="{ id, title } in categoriesList"
            :key="id"
            class="directions__checkbox_wrapper-item"
          >
            <div
              class="direction__select"
              :class="{
                selected: selectedCheckbox.includes(id),
                disabled: studentSubscriptionsIds.includes(id),
              }"
              @click="chooseDerection(id)"
            >
              <div
                class="level__checkbox smart"
                :class="{
                  selected: selectedCheckbox.includes(id),
                  disabled: studentSubscriptionsIds.includes(id),
                }"
              >
                <div
                  v-if="selectedCheckbox.includes(id)"
                  type="checkbox"
                  class="level__checkbox--center smart"
                />
              </div>
              <span
                class="level__select_title"
                :class="{
                  disabled: studentSubscriptionsIds.includes(id),
                }"
                >{{ title }}</span
              >
            </div>
          </div>
        </div>
        <div class="directions__price_wrapper">
          <h3 class="directions__price_title">{{ $t('courses.price') }}:</h3>
          <h1 class="directions__price">{{ totalCost }} UZS</h1>
        </div>
        <div class="directions__btns">
          <ButtonBase
            size="popular"
            color="transparent"
            @click.native="goToSmartSubscribe()"
            >{{ $t('buttons.cansel') }}
          </ButtonBase>
          <ButtonBase
            :color="selectedCheckbox.length > 0 ? 'orange' : 'transparent'"
            :disabled="selectedCheckbox.length > 0 ? false : true"
            size="popular"
            @click.native="openDateModal()"
          >
            {{ $t('buttons.pay') }}
          </ButtonBase>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import Loader from '@/elements/Loader/Loader.vue';
import { mapGetters } from 'vuex';
import { COURSES_MODES } from '@/types/constants';

export default {
  components: { ButtonBase, Heading, Loader },
  data() {
    return {
      categoriesList: [],
      selectedCheckbox: [],
      studentSubscriptionsIds: [],
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCoursesModeDispatch',
      'getStudentsSubscribes',
    ]),

    totalCost() {
      let result = [];
      for (let item of this.categoriesList) {
        if (this.selectedCheckbox.includes(item.id)) {
          result.push(item.price);
        }
      }
      return result.reduce(function (sum, el) {
        return sum + el;
      }, 0);
    },
  },

  watch: {
    getStudentsSubscribes(value) {
      if (value) {
        this.getStudentsSubscribes.map((el) =>
          this.studentSubscriptionsIds.push(el.category_id)
        );
        this.selectedCheckbox = [];
      }
    },
  },

  mounted() {
    this.fetchStudentSubscriptionInformation();
    this.fetchStudentCategory();
  },
  methods: {
    chooseDerection(chosenId) {
      if (this.studentSubscriptionsIds.includes(chosenId)) return;
      if (this.selectedCheckbox.includes(chosenId)) {
        this.selectedCheckbox = this.selectedCheckbox.filter(
          (el) => el !== chosenId
        );
      } else {
        this.selectedCheckbox.push(chosenId);
      }
    },
    openDateModal() {
      this.$store.commit('SET_MODAL', {
        state: true,
        name: `smart-subscribe`,
        props: {
          existSubscribes: this.studentSubscriptionsIds,
          waitingSubscribes: this.selectedCheckbox,
        },
      });
    },
    goToSmartSubscribe() {
      this.$router.push({ name: 'smart_subscribe' });
    },
    async fetchStudentSubscriptionInformation() {
      this.studentSubscriptions = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}StudentSubscriptionInfo`
      );

      this.getStudentsSubscribes.map((el) =>
        this.studentSubscriptionsIds.push(el.category_id)
      );
    },
    async fetchStudentCategory() {
      this.categoriesList = await this.$store.dispatch(
        `get${this.getCoursesModeDispatch}CoursesCategories`
      );
    },
  },
};
</script>

<style lang="sass" scoped>
.profile_inside.loading
  height: 50vh
  display: flex
  align-items: center
  justify-content: center

.direction__select
  display: flex
  gap: 12px
  align-items: center
  cursor: pointer
  border: 1px solid #D8D8D8
  padding: 16px
  position: relative
  @include xs
    width: 100%

.direction__select.selected
  border: 1px solid var(--color-main)

.direction__select.disabled
  border: 1px solid #D8D8D8

.level__checkbox.smart
  height: 16px
  width: 16px
  border-color: var(--primary-font-color)
  position: absolute
  top: 50%
  transform: translateY(-50%)

.level__checkbox.smart.selected
  display: flex
  align-items: center
  justify-content: center
  height: 16px
  width: 16px
  border-color: var(--color-main)
  background-color: var(--color-white)

.level__checkbox.smart.disabled
  border: 1px solid #D8D8D8

.level__select_title
  font-size: 18px
  line-height: 24px
  margin-left: 28px
  @include s
    font-size: 16px
  @include xxs
    font-size: 14px

.level__select_title.disabled
  color: #D8D8D8

.level__checkbox--center.smart
  height: 8px
  width: 8px
  background-color: var(--color-main)

.directions__checkbox_wrapper
  border-bottom: 2px solid #D8D8D8
  padding-bottom: 40px
  display: grid
  grid-template-columns: repeat(2, 47%)
  column-gap: 6%
  row-gap: 24px
  @include xs
    display: flex
    flex-wrap: wrap
    border-bottom: none
    // padding-bottom: 20px
.directions__checkbox_wrapper-item
  width: 100%

.directions__price_wrapper
  display: flex
  align-items: baseline
  justify-content: center
  gap: 10px
  margin-top: 32px
  @include s
    // margin-top: 0px

.directions__price_title
  font-size: 24px
  color: var(--color-font-light-dark)

.directions__price
  color: var(--color-main)
  font-weight: 600
  font-size: 44px
  @include xs
    font-size: 28px

.directions__btns
  display: flex
  justify-content: space-between
  margin-top: 48px
  flex-wrap: wrap
  align-items: center
  @include xxs
    gap: 16px
</style>
