<template>
  <div class="level__select" @click="selectedCategory(id)">
    <div
      class="level__checkbox"
      :class="{ selected: selectedCheckbox.includes(id) }"
    >
      <div
        v-if="selectedCheckbox.includes(id)"
        class="level__checkbox--center"
      ></div>
    </div>
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
