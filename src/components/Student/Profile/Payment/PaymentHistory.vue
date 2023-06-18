<template>
  <div class="history_container__wrapper">
    <div v-if="getPaymentHistory.length >= 1" class="history_container">
      <div class="card_history__table_wrapper">
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
            {{ getPaymentHistory.utc_time }}
            <span v-if="content === 'type'">
              <svg-icon :name="`${element[content]}_${getCoursesMode}`"
            /></span>
            <span v-else-if="content === 'payment_time'">
              <!-- {{ element.utc_time }} -->
              {{ convertUTCDateToLocalDate(element.utc_time) }}
            </span>
            <span v-else>
              <span
                v-if="
                  element[content] ===
                  'common::transactions.description.paynet_deposit'
                "
                >{{ $t(`table.paynet_deposit`) }}</span
              >
              <span v-else>{{ element[content] }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="pagination_wrapper">
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
    <h4 v-else>{{ $t('profilePage.history_error__mess') }}</h4>
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
    convertUTCDateToLocalDate(date) {
      let newDate = new Date(
        new Date(date).getTime() - new Date(date).getTimezoneOffset()
      );
      return `${newDate.getHours()}:${`0${newDate.getMinutes()}`.slice(-2)}`;
    },
  },
};
</script>

<style lang="sass" scoped>
.pagination_wrapper
  display: flex
  justify-content: flex-end

.history_container__wrapper
  @include xs
    overflow: hidden
  @include xxs
    margin: 0 -16px

.icon-deposit_pro
  max-width: 20px
.history_container
  overflow: auto
.icon-course_purchase_pro
  max-width: 16.2px

// .icon-course_purchase_school,
// .icon-course_purchase_pro

.icon-course_purchase,
.icon-pro_course_purchase
  width: 18px
  height: 16px
.icon-pro_course_purchase_pro
  max-width: 16.2px

.icon-deposit,
.icon-referral_fee_deposit
  width: 20px

.card_history__table_wrapper
  background-color: var(--color-white)
  margin-bottom: 40px
  @include xs
    width: 150%
    overflow: scroll
  @include xxs
    width: 185%

.card_history__table_header,
.card_history__table_content
  display: grid
  grid-template-columns: 7% 35% 20% 18% 20%
  padding: 20px 40px
  @include xxs
    padding: 20px 20px
.card_history__table_content
  padding: 20px 20px !important
  @include xxs
    padding: 20px 0px !important

.card_history__table_header
  border-bottom: 2px solid var(--color-head-line)

.card_history__table_header.teacher,
.card_history__table_content.teacher
  grid-template-columns: 2% 33% 20% 16% 21%
  gap: 2%

.content__value span
  display: -webkit-box
  -webkit-line-clamp: 1
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis

.header__title,
.content__value
  display: flex
  align-items: center
  justify-content: flex-start
  @include xxs
    font-size: 14px

.content__value.circle_avg
  justify-content: center

.content__value:first-child
  justify-content: center

.header__title
  max-width: 160px
  opacity: 0.5
  font-size: 14px

.card_history__table_content
  padding: 20px 40px
  border-bottom: 1px solid rgba(150, 150, 150, 0.2)
  @include xxs
    padding: 20px

.content__value.title
  font-weight: bold
  font-size: 16px
  @include xxs
    font-size: 14px

.content__value.orange_title
  color: #39A455
  font-weight: bold

.content__value.amount
  color: #39A455

// .content__value svg
//   max-width: 20px
//   max-height: 20px
</style>
