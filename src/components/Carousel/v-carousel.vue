<template>
  <div class="wrapper">
    <div
      class="v-carousel"
      :style="{ 'margin-left': '-' + (100 + curentSlideIndex) + '%' }"
    >
      <CurrentLesson
        v-for="item in carouselData"
        :key="item.id"
        :name="item.title"
      />
    </div>
    <div class="buttons_wrapper">
      <div @click="prevSlide">
        <svg-icon name="arrow" />
      </div>
      <div @click="nextSlide">
        <svg-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import CurrentLesson from '@/components/Courses/CurrentLesson.vue';
export default {
  name: 'VCarousel',
  components: { CurrentLesson },
  props: {
    carouselData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      curentSlideIndex: 0,
    };
  },
  methods: {
    prevSlide() {
      if (this.curentSlideIndex > 0) {
        this.curentSlideIndex--;
      }
    },
    nextSlide() {
      this.curentSlideIndex++;
    },
  },
};
</script>
<style lang="sass">
.wrapper
  overflow: hidden
  margin: 0 auto

.v-carousel
  display: flex

.buttons_wrapper
  display: flex
</style>
