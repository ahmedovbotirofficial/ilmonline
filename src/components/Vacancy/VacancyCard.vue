<template>
  <div class="vacancy_card__container">
    <div class="vacancy_card">
      <div class="vacancy_card__row">
        <Heading level="4" class="vacancy_card__title vacancy_desk">
          {{ vacancyCard.title }}
          <span class="vacancy_card__title--small"
            >в {{ vacancyCard.city.title }}</span
          >
        </Heading>
        <span
          class="vacancy_card__info_item majority vacancy_mobile"
          :style="{
            'background-color': vacancyCard.direction.css_classnames
              ? convertColor(vacancyCard.direction.css_classnames, 0.5)
              : '',
          }"
          ><p class="card-item">{{ vacancyCard.direction.title }}</p></span
        >
        <div class="vacancy_card__date">
          <svg-icon name="vacancy_card_date" />
          {{ getDateFromString(vacancyCard.published_at, true) }}
          <!-- {{ getDateFromString(vacancyCard.published_at) }} -->
        </div>
      </div>
      <Heading level="4" class="vacancy_card__title vacancy_mobile">
        {{ vacancyCard.title }}
        <span class="vacancy_card__title--small"
          >в {{ vacancyCard.city.title }}</span
        >
      </Heading>
      <div class="vacancy_card__row">
        <div class="vacancy_card__info_left">
          <span
            class="vacancy_card__info_item majority vacancy_desk"
            :style="{
              'background-color':
                vacancyCard.direction.css_classnames !== 'majority'
                  ? convertColor(vacancyCard.direction.css_classnames, 0.5)
                  : '',
            }"
            ><p class="card-item">{{ vacancyCard.direction.title }}</p></span
          >
          <span class="vacancy_card__info_item">
            <svg-icon name="vacancy_card_timer" />
            {{ vacancyCard.condition.title }}
          </span>
          <span class="vacancy_card__info_item">
            <svg-icon name="vacancy_card_location" />
            {{ vacancyCard.city.title }}
          </span>
          <span class="vacancy_card__info_item">
            <svg-icon
              :name="`vacancy_card_${vacancyCard.level.title.toLowerCase()}`"
            />
            {{ vacancyCard.level.title }}
          </span>
        </div>
        <div class="vacancy_card__info_right">
          {{
            vacancyCard.not_fixed_salary
              ? $t('vacancy.salary_negotiable')
              : `${vacancyCard.salary_amount} UZS`
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: { Heading },
  props: {
    vacancyCard: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      getDateFromString,
    };
  },
  computed: {
    ...mapGetters(['getSelectedLanguage']),
  },
  methods: {
    convertColor(hex, alpha) {
      let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      if (!!alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
      } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.vacancy_card
  padding: 32px 32px 0
  display: flex
  flex-direction: column
  background-color: var(--color-white)
  @include xxs
    padding: 20px 16px 0

.vacancy_card__row
  display: flex
  justify-content: space-between
  align-items: baseline
  width: 100%
  gap: 10px
  @include xs
    flex-wrap: wrap

.vacancy_card__row:last-child
  border-bottom: 1px solid var(--color-border-bottom-stars)
  padding-bottom: 28px

.vacancy_card_list_wrapper .vacancy_card__container:last-child .vacancy_card .vacancy_card__row:last-child
  border-bottom: none

.vacancy_card__date
  display: flex
  align-items: center
  gap: 6px
  margin-bottom: 24px
  color: #969696
  @include xs
    margin-bottom: 0

.vacancy_card__date svg
  position: relative
  top: -1px
  max-width: 17px

.vacancy_card__title--small
  font-size: 18px
  font-weight: normal

.vacancy_card__info_left
  display: flex
  gap: 20px
  @include xs
    width: 100%
    flex-wrap: wrap
    order: 2

.vacancy_card__info_item
  display: flex
  align-items: center
  gap: 10px

.vacancy_card__info_item.majority
  color: #12323E
  padding: 8px 10px
  background-color: #F3F2FF

.vacancy_card__info_item svg
  max-width: 18px
  max-height: 18px

.vacancy_card__info_right
  color: var(--color-head-title)
  font-size: 20px
  font-weight: 600
  line-height: 25px
  @include xs
    margin: 0 auto 16px 0
    font-size: 14px

.vacancy_card__container
  background-color: #12323E

.vacancy_card:hover
  transform: translate(8px, -8px)
  outline: 1px solid #12323E

.vacancy_desk
  display: block
  @include xs
    display: none

.vacancy_mobile
  margin-top: 12px
  display: none
  @include xs
    display: block
</style>
