<template>
  <div class="modal__content">
    <svg-icon name="quiz_timer" />
    <!-- getQuizTestResponse >>> {{ getQuizTestResponse }} <br /><br /><br /> -->
    <!-- getQuizTestResponse >>> {{ getQuizTestResponse }} -->

    <Heading level="4" class="modal__content_title">
      {{ $t('titles.need_timer') }}
    </Heading>
    <div class="quiz_modal__description">
      {{ $t('tests.timer_info') }}
    </div>

    <div class="modal__btns">
      <ButtonBase
        class="modal__btn"
        color="transparent"
        :size="getWindowWidth < 640 ? 'max' : 'popular'"
        @click.native="startTest('turn_off')"
      >
        {{ $t('buttons.turn_off') }}
      </ButtonBase>
      <ButtonBase
        class="modal__btn"
        color="orange"
        :size="getWindowWidth < 640 ? 'max' : 'popular'"
        @click.native="startTest('turn_on')"
        >{{ $t('buttons.turn_on') }}
      </ButtonBase>
    </div>
  </div>
</template>

<script>
import ButtonBase from '../Buttons/ButtonBase.vue';
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ButtonBase,
    Heading,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'getModalProps',
      'getQuizTestResponse',
      'getWindowWidth',
      'getQuizTestResponse',
    ]),
  },
  mounted() {},
  methods: {
    closeModal() {
      this.$store.commit('SET_MODAL', { state: false });
    },
    startTest(timer_handler) {
      this.$store.commit('SET_QUIZ_STUDENT_RESPONSES', {
        studentResponses: null,
      });
      if (timer_handler === 'turn_on') {
        this.$store.commit('SET_QUIZ_TIMER_STATUS', true);
      } else {
        this.$store.commit('SET_QUIZ_TIMER_STATUS', false);
      }
      this.$router.push({
        name: 'quiz-passing',
        params: {
          direction: this.$route.params.direction,
          category_id: this.$route.params.category_id,
          quiz_id: this.getModalProps.id,
        },
      });

      this.closeModal();
    },
  },
};
</script>

<style lang="sass" scoped>
li
  position: relative
  margin-bottom: 12px
  margin-left: 16px
  line-height: 26px
  list-style: none
  @include xxs
    font-size: 14px

li::after
  position: absolute
  content: ''
  background-color: var(--color-main)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px var(--box-shadow-color)

.modal__content
  padding: 0 90px
  text-align: left
  @include xs
    padding: 0 24px
  @include xxs
    padding: 0 16px

.svg-icon.icon-trial_modal_icon
  max-height: 54px
  max-width: 40px

.quiz_modal__description
  display: flex
  flex-direction: column
  text-align: center
  gap: 20px
  font-size: 18px
  line-height: 24px
  margin-bottom: 40px
  @include xxs
    font-size: 14px
    line-height: 20px
    gap: 0px

.tiral_modal__results
  font-size: 18px
  font-weight: bold
  align-self: flex-start
  margin-bottom: 40px
  @include xxs
    font-size: 14px

.modal__btns
  display: flex
  gap: 40px
  width: 100%
  justify-content: center
  @include xs
    flex-wrap: wrap
    padding: 0 40px
    gap: 16px
  @include xxs
    padding: 0

.icon-quiz_timer
  max-width: 44px
  max-height: 52px
</style>
