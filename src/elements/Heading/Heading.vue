<template>
  <h4 class="title" :class="cssClasses">
    <slot />
  </h4>
</template>

<script>
export default {
  props: {
    level: {
      type: String,
      required: true,
    },
  },
  computed: {
    cssClasses() {
      return {
        'title--1': this.level === '1',
        'title--2': this.level === '2',
        'title--3': this.level === '3',
        'title--4': this.level === '4',
        'title--5': this.level === '5',
      };
    },
  },
};
</script>

<style lang="sass" scoped>
.title
  font-weight: 600

.title--1
  font-size: 72px
  line-height: 86px
  margin-bottom: 42px
  @include m
    font-size: 52px
    line-height: 60px
  @include xs
    font-size: 44px
    line-height: 50px
  @include xxs
    font-size: 32px
    line-height: 40px

.title--2
  font-size: 48px
  line-height: 60px
  @include s
    font-size: 40px
    line-height: 50px
  @include xs
    font-size: 36px
    line-height: 44px
  @include xxs
    font-size: 24px
    line-height: 30px

.why_ilm__column .title--2
  font-size: 48px
  @include s
    font-size: 42px
    @include xxs
      font-size: 24px

.title--3
  font-size: 44px
  line-height: 56px
  @include s
    font-size: 32px
    line-height: 38px
  @include xxs
    font-size: 20px
    line-height: 24px

.title--4
  font-size: 24px
  line-height: 30px
  margin-bottom: 24px
  @include s
    font-size: 20px
    line-height: 24px
  @include xxs
    font-size: 18px
    line-height: 22px

.title--5
  font-size: 20px
  line-height: 27px
  // margin-bottom: 16px
</style>
