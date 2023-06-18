<template>
  <div class="modal__content">
    <Heading level="4" class="modal_rate__title">
      {{ $t('titles.rate_course') }}
    </Heading>
    <Heading level="4" class="modal_rate__subtitle">
      {{ getModalProps }}
    </Heading>
    <div class="card_lesson__star">
      <star-rating
        v-model="reviewRating"
        :star-size="32"
        text-class="card_custom_star_text"
        :fixed-points="1"
        :show-rating="false"
        inactive-color="#FFEBD4"
        active-color="#FF9B26"
      />
    </div>
    <textarea
      id="review-text"
      v-model="reviewText"
      name="review-text"
      class="modal_rate__textarea"
      :placeholder="$t('form.share_info')"
    ></textarea>

    <div class="modal_rate__send">
      <div class="modal_rate__send_text">
        {{ $t('form.i_agree') }}
        <a class="modal_rate__send_text_link" @click="goTo()">
          {{ $t('form.policy_info_url') }}
        </a>
      </div>

      <ButtonBase
        class="modal__btn"
        color="orange"
        size="popular"
        :disabled="isDisabledSendBtn"
        @click.native="sendRate"
        >{{ $t('buttons.send_btn') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    Heading,
    StarRating,
  },
  data() {
    return {
      reviewRating: null,
      reviewText: '',
    };
  },
  computed: {
    ...mapGetters(['getCoursesModeDispatch', 'getModalProps']),
    isDisabledSendBtn() {
      return !this.reviewRating || !this.reviewText;
    },
  },
  mounted() {},
  methods: {
    goTo() {
      this.$store.commit('SET_MODAL', {
        state: false,
      });
      this.$router.push({ name: 'policy' });
    },
    async sendRate() {
      const reviewData = {
        id: this.$route.params.course_id,
        rating: this.reviewRating,
        text: this.reviewText,
      };

      await this.$store.dispatch(
        `add${this.getCoursesModeDispatch}CourseReview`,
        reviewData
      );

      this.$store.commit('SET_MODAL', {
        state: false,
      });
    },
  },
};
</script>

<style lang="sass">
.v-dialog:not(.v-dialog--fullscreen)
  height: auto

.modal__content
  .modal_rate__title,
  .modal_rate__subtitle
    margin-bottom: 0
    padding-bottom: 10px
    color: var(--primary-font-color)

  .modal_rate__subtitle
    padding-bottom: 24px

  .modal_rate__subtitle
    color: var(--btn-color-blue-dark)
    text-decoration: underline
    @include xxxs
      text-align: center

.card_lesson__star
  margin-bottom: 24px

.modal_rate__textarea
  border: 1px solid rgba(18, 50, 62, 0.24)
  width: 100%
  min-height: 160px
  max-height: 250px
  padding: 12px
  outline: none

.modal_rate__textarea:focus
  border: 1px solid var(--btn-color-blue-dark)

.modal_rate__send
  display: flex
  gap: 40px
  align-items: center
  padding-top: 35px
  @include s
    flex-direction: column
    gap: 24px

.modal_rate__send_text,
.modal_rate__send_text_link
  cursor: pointer
  color: var(--primary-font-color)

.modal_rate__send_text
  flex: 1 0 50%
  font-size: 14px
  line-height: 20px
  min-width: 320px
  @include xxxs
    line-height: 18px
    min-width: auto

.modal_rate__send_text_link
  text-decoration: underline

.modal__content
  padding: 0 90px
  text-align: left
  @include xxxs
    padding: 0 20px

.svg-icon.icon-trial_modal_icon
  max-height: 54px
  max-width: 40px
</style>
