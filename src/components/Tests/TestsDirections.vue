<template>
  <div class="trial_directions">
    <div class="container">
      <div class="trial_directions__wrapper">
        <div
          v-for="{ id, slug, title, image } in typeOfTestsData"
          :key="id"
          class="item"
          @click="openTestByDirection(id, slug, title)"
        >
          <div class="trial_direction__item_text">
            <span>{{ title }}</span>
            <svg-icon name="trial_direction_arrow" />
          </div>
          <div class="hover_white_bg">
            <div class="trial_direction__item">
              <img :src="image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeOfTestsData: {
      type: Array,
      default: () => [],
    },

    selectedTestType: {
      type: String,
      default: 'trial',
    },
  },
  data() {
    return {
      isLoader: false,
    };
  },

  methods: {
    openTestByDirection(id, slug, title) {
      // console.log('open test', id, slug);
      this.$router.push({
        name: `${this.selectedTestType}-current-direction`,
        params: { direction: slug, category_id: id, school_id: id },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.trial_directions__wrapper
  display: grid
  grid-template-columns: repeat(3, 29.3%)
  row-gap: 80px
  column-gap: 6%
  margin-bottom: 100px
  @include s
    grid-template-columns: repeat(2, 47%)
  @include xxs
    grid-template-columns: 1fr

.trial_direction__item
  cursor: pointer
  padding: 18px 50px
  background: rgba(18, 50, 62, 0.72)

.trial_direction__item img
  height: 160px
  object-fit: contain
  filter: opacity(0.72) brightness(0.5)

.item
  position: relative
  min-height: 200px

.item, .hover_white_bg, .trial_direction__item
  transition-duration: var(--transition-speed)

.hover_white_bg
  background: var(--color-white)

.item:hover .hover_white_bg
  position: absolute
  width: 100%
  // height: 100%
  transition-property: transform background
  transition-duration: var(--transition-speed)
  transform: translate(8px, -8px)
  position: relative
  left: 1px

.item:hover .trial_direction__item
  position: relative

.item:hover
  background: #12323E

.trial_direction__item_text
  font-size: 24px
  position: absolute
  left: 50%
  bottom: 50%
  transition-property: transform
  transform: translate(-50%, 50%)
  color: var(--color-white)
  transition-duration: var(--transition-speed)
  z-index: 1
  display: flex
  align-items: center
  gap: 10px

.item:hover .trial_direction__item_text
  transform: translate(-45%, 20%)
</style>
