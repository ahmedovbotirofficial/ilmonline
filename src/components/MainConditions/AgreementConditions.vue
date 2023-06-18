<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="agreement_policy">
    <div class="agreement_policy__head">
      <div class="container">
        <div class="agreement_policy__title">
          {{ $t(`agreement.order_title`) }}
        </div>
      </div>
    </div>
    <div class="agreement_policy__content">
      <div class="container">
        <div
          class="title_agreement"
          v-html="$t(`agreement.order_subtitle`)"
        ></div>
        <div
          v-for="({ title, id, text }, idx) in agreementBlock"
          :key="id"
          class="agreement_policy__content_wrapper"
        >
          <div class="agreement_policy__content_content">
            <p
              class="agreement_policy__content_title"
              :class="{ opened: openItem.includes(id) }"
            >
              {{ idx + 1 }}.
            </p>
            <h1
              class="agreement_policy__content_title"
              :class="{ opened: openItem.includes(id) }"
              @click="toggleItem(id)"
            >
              {{ $t(`agreement.${title}`) }}
            </h1>
          </div>

          <!-- eslint-disable vue/no-v-html -->
          <div v-if="openItem.includes(id)">
            <p
              class="agreement_policy__content_text"
              v-html="$t(`agreement.${text}`)"
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
      agreementBlock: [
        {
          id: 1,
          title: 'terminology_title',
          text: 'terminology_text',
        },
        {
          id: 2,
          title: 'subject_contract_title',
          text: 'subject_contract_text',
        },
        {
          id: 3,
          title: 'user_registration_title',
          text: 'user_registration_text',
        },
        {
          id: 4,
          title: 'rights_responsibilities_title',
          text: 'rights_responsibilities_text',
        },
        {
          id: 5,
          title: 'rights_responsibilities_compane_title',
          text: 'rights_responsibilities_compane_text',
        },
        {
          id: 6,
          title: 'granting_access_title',
          text: 'granting_access_text',
        },
        {
          id: 7,
          title: 'price_procedure_form_title',
          text: 'price_procedure_form_text',
        },
        {
          id: 8,
          title: 'personal_data_title',
          text: 'personal_data_text',
        },
        {
          id: 9,
          title: 'intellectual_property_title',
          text: 'intellectual_property_text',
        },
        {
          id: 10,
          title: 'responsibility_title',
          text: 'responsibility_text',
        },
        {
          id: 11,
          title: 'force_majeure_title',
          text: 'force_majeure_text',
        },
        {
          id: 12,
          title: 'dispute_resolution_procedure_title',
          text: 'dispute_resolution_procedure_text',
        },
        {
          id: 13,
          title: 'order_of_sending_title',
          text: 'order_of_sending_text',
        },
        {
          id: 14,
          title: 'other_conditions_and_warnings_title',
          text: 'other_conditions_and_warnings_text',
        },
        {
          id: 15,
          title: 'company_information_title',
          text: 'company_information_text',
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

<style lang="sass">
.title_agreement
  font-size: 25px
  line-height: 36px
  margin-bottom: 50px
  @include s
    font-size: 22px
  @include xxs
    font-size: 16px
    line-height: 26px
</style>
