<template>
  <div class="modal__content">
    <Heading level="4" class="card_finish__title">
      {{ $t('titles.error_mess_card') }}
    </Heading>
    <div class="delete_card__text">
      {{ $t('titles.error_text_card') }}
    </div>
  </div>
</template>

<script>
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Heading,
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},
};
</script>

<style lang="sass" scoped>
.svg-icon.icon-card_delete_approve
  max-width: 53px
  max-height: 53px

.card_finish__title
  margin: 32px 0px 16px

.delete_card__text
  margin-bottom: 40px

.card_finish__btns
  display: flex
  justify-content: space-between
  gap: 40px
</style>
