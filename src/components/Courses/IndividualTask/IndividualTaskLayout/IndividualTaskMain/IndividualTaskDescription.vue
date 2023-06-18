<template>
  <div class="individual_task__description">
    <div class="individual_task__caption">
      {{ $t('individual_task.title')
      }}<span v-if="task.is_required_individual_task" class="required">* </span
      >:
    </div>
    <div v-if="!!task.image" class="individual_task__img_box">
      <img :src="task.image" alt="" class="individual_task__img" />
    </div>
    <div class="individual_task__text">
      <p>{{ task.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="sass" scoped>
.individual_task__caption
  @include adaptive-font-size(24, 24, 20)
  @include adaptive-line-height(32, 32, 26)
  font-weight: 600

  .required
    color: var(--color-orange)

.individual_task__caption,
.individual_task__img_box
  margin-bottom: 16px
  @include xxs
    margin-bottom: 12px

.individual_task__text p
  @include adaptive-font-size(16, 16, 14)
  @include adaptive-line-height(24, 24, 22)

  p + p
    margin-top: 10px
    @include xxs
      margin-top: 8px

  .important
    font-weight: 600
</style>
