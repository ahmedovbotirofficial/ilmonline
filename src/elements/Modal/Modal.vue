<template>
  <v-dialog
    v-model="getModalState"
    persistent
    :max-width="`${modalWidth}px`"
    @keydown.esc="close"
    @click:outside="close"
  >
    <!-- :content-class="scroll" -->
    <div
      class="modal modal__container"
      :class="{
        quiz_registration: $route.name === 'quiz-results',
        wide: getModalName === 'rejected-purchase',
      }"
    >
      <div class="modal__container_content">
        <div class="modal__container_wrapper-cross" @click="close">
          <svg-icon name="cross" />
        </div>
        <component
          :is="modalName"
          @go-to-route="closeModalWithRouting"
        ></component>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import ForgotPasswordModal from '@/elements/Modal/ForgotPasswordModal.vue';
import InstructionsSentModal from '@/elements/Modal/InstructionsSentModal.vue';
import VerificationModal from '@/elements/Modal/VerificationModal.vue';
import FinishTestModal from '@/elements/Modal/FinishTestModal.vue';
import DeleteCardModal from '@/elements/Modal/DeleteCardModal.vue';
import UnsubscribeModal from '@/elements/Modal/UnsubscribeModal.vue';
import SmartSubscribeModal from '@/elements/Modal/SmartSubscribeModal.vue';
import TrialTestDescriptionModal from '@/elements/Modal/TrialTestDescriptionModal.vue';
import QuizTestDescriptionModal from '@/elements/Modal/QuizTestDescriptionModal.vue';
import SendTestResultsModal from '@/elements/Modal/SendTestResultsModal.vue';
import RateModal from '@/elements/Modal/RateModal.vue';
import AcceptPurchaseModal from '@/elements/Modal/AcceptPurchaseModal.vue';
import RejectedPurchaseModal from '@/elements/Modal/RejectedPurchaseModal.vue';
import RejectedSubscriptionModal from '@/elements/Modal/RejectedSubscriptionModal.vue';
import ConfirmVerificationModal from '@/elements/Modal/confirmVerificationModal.vue';
import ReplenishBalanceModal from '@/elements/Modal/replenishBalanceModal.vue';
import ParentControlModal from '@/elements/Modal/ParentControlModal.vue';
import ConnectionCodeModal from '@/elements/Modal/ConnectionCodeModal.vue';
import QuizContinueModal from '@/elements/Modal/QuizContinueModal.vue';
import SendQuizResultsModal from '@/elements/Modal/SendQuizResultsModal.vue';
import QuizTimerModal from '@/elements/Modal/QuizTimerModal.vue';
import ErrorAddCardModal from '@/elements/Modal/ErrorAddCardModal.vue';
import AuthorizationModal from '@/elements/Modal/AuthorizationModal.vue';
import RegistrationModal from '@/elements/Modal/RegistrationModal.vue';
import LeavePageModal from '@/elements/Modal/LeavePageModal.vue';
import SelectCoursesModeModal from '@/elements/Modal/SelectCoursesModeModal.vue';

export default {
  components: {
    LeavePageModal,
    RegistrationModal,
    AuthorizationModal,
    ConnectionCodeModal,
    ForgotPasswordModal,
    SendTestResultsModal,
    InstructionsSentModal,
    VerificationModal,
    SendQuizResultsModal,
    FinishTestModal,
    DeleteCardModal,
    SmartSubscribeModal,
    TrialTestDescriptionModal,
    QuizTestDescriptionModal,
    QuizTimerModal,
    RateModal,
    UnsubscribeModal,
    AcceptPurchaseModal,
    RejectedPurchaseModal,
    RejectedSubscriptionModal,
    ConfirmVerificationModal,
    ReplenishBalanceModal,
    ParentControlModal,
    QuizContinueModal,
    ErrorAddCardModal,
    // SelectCoursesModeModal,
  },
  data() {
    return {};
  },

  computed: {
    ...mapGetters(['getModalState', 'getModalName']),
    modalName() {
      return this.getModalName ? `${this.getModalName}-modal` : '';
    },
    scroll() {
      return this.$route.name === 'quiz-results'
        ? 'scroll'
        : this.$route.name === 'direction'
        ? 'scroll'
        : '';
    },

    modalWidth() {
      switch (this.getModalName) {
        case 'forgot_password':
        case 'instructions-sent':
        case 'verification':
        case 'finish-test':
        case 'delete-card':
        case 'smart-subscribe':
        case 'unsubscribe':
        case 'trial-test-description':
        case 'send-test-results':
        case 'confirm-verification':
        case 'replenish-balance':
        case 'rate':
        case 'parent-control':
        case 'connection-code':
        case 'quiz-continue':
        case 'error-add-card':
        // case 'select-courses-mode':
        default:
          return 720;
      }
    },
  },

  methods: {
    close() {
      this.$store.commit('SET_MODAL', { state: false });
    },
    closeModalWithRouting(path) {
      this.close();
      this.$router.push(path);
    },
  },
};
</script>

<style lang="sass">
.v-dialog:not(.v-dialog--fullscreen)
  overflow-x: hidden
  overflow-y: unset
  @include xs
    // min-height: 100%
    min-width: 100%
    // height: 100%
    padding: 16px

.v-dialog:not(.v-dialog--fullscreen).scroll
  overflow-y: scroll
  @include xs
    height: auto

.v-dialog > *
  @include xs
    height: 100%
    max-width: 100%

.v-dialog__content
  width: 100%

.modal
  position: relative
  background: white
  box-shadow: 0px 12px 44px rgba(18, 50, 62, 0.24)
  @include xs
    display: flex
    align-items: center
    justify-content: center
    height: 100%

.modal.quiz_registration
  height: 150%

.modal__container_wrapper-cross
  position: absolute
  top: 18px
  right: 38px
  width: 32px
  height: 32px
  padding: 13px
  cursor: pointer
  @include xs

.modal .icon-cross
  max-width: 24px
  max-height: 24px
  fill: var(--color-font-light-dark)

.modal__container_content
  padding: 60px 0
  display: flex
  justify-content: center

.modal__container_inner
  display: flex
  flex-direction: column
  align-items: center

.modal__container.wide
  .modal__container_content
    width: 100%

.modal__custom-title
  margin-bottom: 10px

.modal__btn--wide.btn__main
  padding: 16px 80px

  .btn__icon
    margin-left: 12px

.modal__btn--full.btn__main
  width: 100%

.modal__content
  text-align: center
  display: flex
  flex-direction: column
  align-items: center
  padding: 0 24px
  @include xxs
    padding: 0 16px
</style>
