<template>
  <div class="history_container__wrapper">
    <div v-if="getPaymentHistory.length >= 1" class="history_container">
      <div class="card_history__table_wrapper">
        <Heading level="5" class="card_history__title">
          {{ hisoryTableTitle }}
        </Heading>
        <div
          class="card_history__table_header"
          :class="{ teacher: getUserRole !== 'student' }"
        >
          <div
            v-for="title in userPaymentHistoryHeader"
            :key="title"
            class="header__title"
          >
            <p v-if="title !== 'description'">{{ $t(`table.${title}`) }}</p>
          </div>
        </div>

        <div
          v-for="element in getPaymentHistory"
          :key="element.id"
          class="card_history__table_content"
          :class="{ teacher: getUserRole !== 'student' }"
        >
          <div
            v-for="content in userPaymentHistoryHeader"
            :key="content"
            class="content__value"
            :class="{
              title: content === 'payment_date',
              amount: content === 'amount',
            }"
          >
            <span v-if="content === 'type'">
              <svg-icon :name="`${element[content]}_${getCoursesMode}`"
            /></span>
            <span v-else>{{ element[content] }}</span>
          </div>
        </div>
      </div>
      <Paginate
        v-if="getLastPage > 1"
        :page-count="getLastPage"
        :force-page="getCurrentPage"
        :value="getCurrentPage"
        :click-handler="pageChangeHandler"
        :prev-text="''"
        :next-text="''"
        :container-class="'pagination'"
        :page-class="'pagination_el'"
        :prev-class="'prev_arrow'"
        :next-class="'next_arrow'"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      userPaymentHistoryHeader: [
        'type',
        'description',
        'payment_date',
        'payment_time',
        'amount',
      ],
    };
  },

  computed: {
    ...mapGetters([
      'getCoursesMode',
      'getCards',
      'getUserRole',
      'getPaymentHistory',
      'getLastPage',
      'getCurrentPage',
    ]),
  },

  async mounted() {
    await this.getPaymentHistoryData();
  },
  methods: {
    async getPaymentHistoryData() {
      return this.$store.dispatch('getPaymentHistoryData');
    },
    async pageChangeHandler(selectedPage) {
      await this.$store.dispatch('changeCurrentPage', selectedPage);
      await this.$store.dispatch('getPaymentHistoryData', selectedPage);
    },
  },
};
</script>

<style lang="sass" scoped>
.history_container__wrapper
  @include xs
    overflow: scroll
  @include xxs
    margin: 0 -16px

.history_container
  overflow: scroll

.card_history__table_wrapper
  background-color: var(--color-white)
  margin-bottom: 40px
  @include xxs
    max-width: 680px
    width: 185%

.card_history__table_header,
.card_history__table_content
  display: grid
  grid-template-columns: 5% 35% 20% 20% 20%
  padding: 20px 40px

.card_history__table_header
  border-bottom: 2px solid var(--color-head-line)

.card_history__table_header.teacher,
.card_history__table_content.teacher
  grid-template-columns: 2% 33% 20% 16% 21%
  gap: 2%
.icon-pro_course_purchase_pro
  max-width: 19px
.header__title,
.content__value
  display: flex
  align-items: center

.content__value.circle_avg
  justify-content: center

.header__title
  max-width: 160px
  opacity: 0.5
  font-size: 14px

.card_history__table_content
  padding: 20px 40px
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)

.content__value.title
  font-weight: bold
  font-size: 16px

.content__value.orange_title
  color: #39A455
  font-weight: bold

.content__value.amount
  color: #39A455
</style>
