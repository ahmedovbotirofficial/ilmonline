<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="agreement_policy">
    <div class="agreement_policy__head">
      <div class="container">
        <div class="agreement_policy__title">
          {{ $t('titles.policy') }}
        </div>
      </div>
    </div>
    <div class="agreement_policy__content">
      <div class="container">
        <div
          v-for="{ title, id, text } in policyBlock"
          :key="id"
          class="agreement_policy__content_wrapper"
        >
          <h1
            class="agreement_policy__content_title"
            :class="{ opened: openItem.includes(id) }"
            @click="toggleItem(id)"
          >
            {{ $t(`policy.${title}`) }}
          </h1>
          <div v-if="openItem.includes(id)">
            <p
              class="agreement_policy__content_text"
              v-html="$t(`policy.${text}`)"
            ></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      policyBlock: [
        {
          id: 1,
          title: 'user_agreement_title',
          text: 'user_agreement_text',
        },
        {
          id: 2,
          title: 'general_conditions_title',
          text: 'general_conditions_text',
        },
        {
          id: 3,
          title: 'policy_title',
          text: 'policy_text',
        },
        {
          id: 4,
          title: 'access_title',
          text: 'access_text',
        },
        {
          id: 5,
          title: 'account_title',
          text: 'account_text',
        },
        {
          id: 6,
          title: 'information_copyright_holder_title',
          text: 'information_copyright_holder_text',
        },
      ],
      openItem: [],
    };
  },
  methods: {
    toggleItem(id) {
      if (this.openItem.includes(id)) {
        this.openItem = this.openItem.filter((item) => item !== id);
      } else {
        this.openItem.push(id);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.agreement_policy__title
  @include m
    font-size: 55px
  @include s
    font-size: 45px
    line-height: 50px
  @include xs
    font-size: 24px
    line-height: 30px
</style>
