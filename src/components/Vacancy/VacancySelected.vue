<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="main_vacancy">
    <Loader v-if="!getVacancyDetails" color="orange"></Loader>
    <template v-else>
      <div class="vanacy_selected__top_block">
        <div class="container">
          <div class="vanacy_selected__card">
            <div class="vacancy__control_box">
              <img
                :src="getVacancyDetails.poster.square_url"
                class="vacancy__control_box_img desktop"
                alt=""
              />
              <span class="vacancy_selected__info_salary mobile">
                {{
                  getVacancyDetails.not_fixed_salary
                    ? $t('vacancy.salary_negotiable')
                    : `${getVacancyDetails.salary_amount} UZS`
                }}
              </span>

              <div class="vacany__control_btns">
                <a :href="mailLink">
                  <ButtonBase
                    color="orange"
                    size="vacancy"
                    type="submit"
                    class="auth_form__sign_in_btn vacancy_btn"
                    >{{ $t('buttons.sent_resume') }}
                  </ButtonBase>
                </a>
                <a :href="telegramLink">
                  <ButtonBase
                    color="telegram"
                    size="vacancy"
                    type="submit"
                    icon-name="telegram"
                    class="auth_form__sign_in_btn write_btn"
                    >{{ $t('buttons.write_to_telegram') }}
                  </ButtonBase>
                </a>
              </div>
            </div>
            <div class="vanacy_selected__wrapper">
              <div class="vacancy_selected__list_wrapper">
                <div class="vacancy_selected">
                  <div class="vacancy_selected__row">
                    <div class="vacancy_selected__block-top">
                      <div class="vacancy_selected__info_left">
                        <span
                          v-if="getVacancyDetails.direction"
                          class="vacancy_selected__info_item majority desktop"
                          :style="{
                            'background-color': getVacancyDetails.direction
                              .css_classnames
                              ? convertColor(
                                  getVacancyDetails.direction.css_classnames,
                                  0.5
                                )
                              : '',
                          }"
                          >{{ getVacancyDetails.direction.title }}</span
                        >
                        <span
                          v-if="getVacancyDetails.condition"
                          class="vacancy_selected__info_item"
                        >
                          <svg-icon name="vacancy_card_timer" />
                          {{
                            getVacancyDetails.condition.title
                              ? getVacancyDetails.condition.title
                              : ''
                          }}
                        </span>
                        <span
                          v-if="getVacancyDetails.city"
                          class="vacancy_selected__info_item"
                        >
                          <svg-icon name="vacancy_card_location" />
                          {{
                            getVacancyDetails.city.title
                              ? getVacancyDetails.city.title
                              : ''
                          }}
                        </span>
                        <span
                          v-if="getVacancyDetails.level"
                          class="vacancy_selected__info_item"
                        >
                          <svg-icon
                            :name="`vacancy_card_${getVacancyDetails.level.title.toLowerCase()}`"
                          />
                          {{
                            getVacancyDetails.level.title
                              ? getVacancyDetails.level.title
                              : ''
                          }}
                        </span>
                      </div>
                      <div class="vacancy_selected__top mobile">
                        <span
                          v-if="getVacancyDetails.direction"
                          class="vacancy_selected__info_item majority mobile"
                          :style="{
                            'background-color': getVacancyDetails.direction
                              .css_classnames
                              ? convertColor(
                                  getVacancyDetails.direction.css_classnames,
                                  0.5
                                )
                              : '',
                          }"
                          >{{ getVacancyDetails.direction.title }}</span
                        >
                        <div class="vacancy_selected__info_date">
                          <svg-icon name="vacancy_card_date" />
                          {{
                            getDateFromString(getVacancyDetails.published_at)
                          }}
                        </div>
                      </div>
                      <div class="vacancy__control_box_img_wrapper mobile">
                        <img
                          :src="getVacancyDetails.poster.square_url"
                          class="vacancy__control_box_img"
                          alt=""
                        />
                      </div>
                      <div class="vacancy_selected__info_date desktop">
                        <svg-icon name="vacancy_card_date" />
                        {{ getDateFromString(getVacancyDetails.published_at) }}
                      </div>
                      <span class="vacancy_selected__info_salary tablet">
                        {{
                          getVacancyDetails.not_fixed_salary
                            ? $t('vacancy.salary_negotiable')
                            : `${getVacancyDetails.salary_amount} UZS`
                        }}
                      </span>
                    </div>
                  </div>
                  <div class="vacancy_selected__row">
                    <div class="vacancy_selected__title-block">
                      <div class="vacancy_selected__cost">
                        <Heading level="3" class="vacancy_selected__title">
                          {{
                            getVacancyDetails.title
                              ? getVacancyDetails.title
                              : ''
                          }}
                        </Heading>
                        <span class="vacancy_selected__info_salary desktop">
                          {{
                            getVacancyDetails.not_fixed_salary
                              ? $t('vacancy.salary_negotiable')
                              : `${getVacancyDetails.salary_amount} UZS`
                          }}
                        </span>
                      </div>

                      <span class="vacancy_selected__title--small"
                        >в
                        <span class="vacancy_selected__title--underline">
                          {{
                            getVacancyDetails.employer
                              ? getVacancyDetails.employer
                              : ''
                          }}
                        </span>
                      </span>
                    </div>

                    <div
                      v-if="!!getVacancyDetails.description"
                      class="vacancy_selected__info_text_box"
                      v-html="getVacancyDetails.description"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="vanacy_selected__main_blocks">
        <div class="container">
          <div class="vanacy_selected__block">
            <div
              v-for="(item, key) in getVacancyDetailsContent"
              :key="key"
              class="vacancy_conditions_list_item"
            >
              <span class="vanacy_selected__block_title">
                {{ $t(`vacancy.${key}`) }}</span
              >
              <div class="vanacy_selected__block_paragraph_wrapper">
                <div
                  class="vanacy_selected__block_paragraph"
                  v-html="item"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ButtonBase from '@/elements/Buttons/ButtonBase.vue';
import Loader from '@/elements/Loader/Loader.vue';
import Heading from '@/elements/Heading/Heading.vue';
import { mapGetters } from 'vuex';
import { getDateFromString } from '@/library/dateFormat';

export default {
  components: {
    ButtonBase,
    Loader,
    Heading,
  },
  data() {
    return {
      getDateFromString,
    };
  },
  computed: {
    ...mapGetters(['getVacancyDetails', 'getSelectedLanguage']),
    getVacancyDetailsContent() {
      let content = {
        skills: !!this.getVacancyDetails.required_skills
          ? this.getVacancyDetails.required_skills
          : '-',
        will_be_plus: !!this.getVacancyDetails.pluses
          ? this.getVacancyDetails.pluses
          : '-',
        duties: !!this.getVacancyDetails.duties
          ? this.getVacancyDetails.duties
          : '-',
        we_offer: !!this.getVacancyDetails.we_offer
          ? this.getVacancyDetails.we_offer
          : '-',
        about_company: !!this.getVacancyDetails.about_company
          ? this.getVacancyDetails.about_company
          : '-',
      };
      return content;
    },

    telegramLink() {
      return `https://telegram.me/${this.getVacancyDetails.telegram_username}`;
    },

    mailLink() {
      return `mailto:${this.getVacancyDetails.email_for_applications}`;
    },
  },
  watch: {
    getSelectedLanguage(value) {
      value &&
        this.$store.dispatch('getVacancyDetailsData', this.$route.params.slug);
    },
  },
  async mounted() {
    await this.$store.dispatch(
      'getVacancyDetailsData',
      this.$route.params.slug
    );

    this.$store.commit('SET_CURR_BREAD_LABEL', {
      current_vacancy_name: this.getVacancyDetails.title,
    });
  },
  methods: {
    convertColor(hex, alpha) {
      let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
      } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      }
    },
  },
};
</script>

<style lang="sass" scoped>
p
  position: relative
  margin-bottom: 12px
  margin-left: 16px
  line-height: 26px
  list-style: none

p::after
  position: absolute
  content: ''
  background-color: var(--color-main)
  height: 5px
  width: 5px
  left: -16px
  top: 12px
  border-radius: 50%
  box-shadow: 0px 2px 4px var(--box-shadow-color)

.main_vacancy
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  min-height: calc(100vh - 88px)

.vanacy_selected__wrapper
  @media screen and (max-width: 1310px)
    max-width: 78%
    width: 78%
  @include s
    max-width: 100%
    width: 100%

.vanacy_selected__top_block
  background: var(--color-white)
  padding: 65px 0
  margin-top: 20px
  width: 100%

  @include s
    padding: 40px 0 44px 0

  @include xs
    padding: 32px 0
    margin-top: 0

.vanacy_selected__card
  display: flex

  @include xs
    flex-direction: column-reverse

.vacancy__control_box
  max-width: 280px
  min-width: 238px

  @include xs
    margin: 0 auto
    text-align: center
    padding-top: 22px

  @include xxs
    margin: 0
    max-width: 100%
    text-align: left

.vacancy__control_box_img.desktop
  width: 100%
  max-width: 245px
  min-width: 245px

  @include xs
    display: none

.vacancy__control_box_img_wrapper.mobile
  display: none

  @include xs
    display: flex
    justify-content: center
    flex: 0 0 100%

.vacancy__control_box_img
  @include xxxs
    width: 100%

.auth_form__sign_in_btn
  width: 100%
  margin-top: 24px
  margin-bottom: 0
  @include xs
    margin-top: 0

.vacany__control_btns
  display: flex
  justify-content: space-between
  flex-direction: column
  @include xs
    margin-top: 24px
    gap: 16px

.write_btn
  // background: var(--btn-color-light-blue)
  text-transform: initial
  gap: 8px
  margin-top: 16px
  @include xs
    margin-top: 0

.vacancy_selected__cost .vacancy_selected__title
  @include adaptive-font-size(40, 28, 24)
  @include adaptive-line-height(50, 35, 30)
  font-weight: 600
  padding: 12px 0

.vanacy_selected__block_paragraph .vacancy_conditions_list_item:last-child
  border-bottom: none

.vacancy_conditions_list_item
  display: flex
  width: 100%
  justify-content: space-between
  padding: 52px 0
  border-bottom: 1px solid rgb(18 50 62 / 8%)

  @include s
    padding: 40px 0

  @include xs
    padding: 20px 0
    flex-direction: column

.vacancy_selected__title--small
  @include adaptive-font-size(24, 20, 16)
  @include adaptive-line-height(30, 25, 20)
  opacity: 0.8

.vacancy_selected__title--underline
  text-decoration: underline
  font-size: 24px
  font-weight: 400

.vacancy_selected__info_text_box
  line-height: 30px
  padding-top: 24px
  min-width: 920px
  @include m
    min-width: auto
  @include s
    padding-top: 20px

  @include xs
    padding-top: 16px

.vacancy_selected__info_text
  font-size: 20px!important
  font-weight: 400

.vacancy_selected__info_text_box ::v-deep .vacancy_selected__info_text + .vacancy_selected__info_text
  line-height: 27px
  margin-top: 20px

  @include xs
    margin-top: 16px

.vacancy_selected__info_text_box ::v-deep .vacancy_selected__info_text
  font-size: 18px!important
  @include adaptive-font-size(20, 18, 16)
  @include adaptive-line-height(30, 24, 24)

.vacancy_selected__title-block
  display: flex
  flex-direction: column

.vacancy_selected
  padding-left: 40px
  display: flex
  flex-direction: column
  max-width: 960px

  @include s
    padding-left: 32px

  @include xs
    padding-left: 0

.vacancy_selected__date
  display: flex
  align-items: center
  gap: 6px
  margin-bottom: 24px

.vacancy_selected__date svg
  position: relative
  top: 1px
  max-width: 17px

.vacancy_selected__cost
  display: flex
  justify-content: space-between
  align-items: center

.vacancy_selected__block-top
  display: flex
  justify-content: space-between
  align-items: center
  flex-wrap: wrap

.vacancy_selected__info_left
  display: flex
  gap: 30px

  @include s
    order: 1
    flex: 0 0 100%
    gap: 20px

  @include xs
    padding-top: 16px
    padding-bottom: 4px

.vacancy_selected__info_item
  display: flex
  align-items: center
  gap: 7px

.vacancy_selected__info_item.majority
  color: #12323E
  padding: 8px 10px
  background-color: #F3F2FF

.vacancy_selected__info_item.majority.desktop
  @include xs
    display: none

.vacancy_selected__info_item.majority.mobile
  display: none
  @include xs
    display: inline

.vacancy_selected__info_item svg
  max-width: 18px
  max-height: 18px

.vacancy_selected__info_salary
  display: block
  font-size: 32px!important
  @include adaptive-font-size(32, 28, 28)
  @include adaptive-line-height(40, 35, 35)
  font-weight: bold
  color: var(--color-head-title)
  //margin-bottom: 22px

.vacancy_selected__info_salary.desktop
  @include s
    display: none

.vacancy_selected__info_salary.tablet
  display: none

  @include s
    display: block
    margin-bottom: 22px

  @include xs
    display: none

.vacancy_selected__info_salary.mobile
  display: none
  @include xs
    display: inline

.vacancy_selected__top.mobile
  display: none

  @include xs
    display: flex
    align-items: center
    justify-content: space-between
    flex: 0 0 100%
    margin-bottom: 12px

.vacancy_selected__info_date
  display: flex
  align-items: center
  gap: 8px
  color: var(--color-font-light-dark)
  @include s
    margin-bottom: 22px

  @include xs
    margin-bottom: 0

.vacancy_selected__info_item,
.vacancy_selected__info_date
  font-size: 16px
  line-height: 26px

.vacancy_selected__info_date.desktop
  @include xs
    display: none

.icon-vacancy_selected_date
  max-height: 18px
  max-width: 18px
  margin-right: 8px

.vanacy_selected__main_blocks
  padding: 0 0 60px 0
  width: 100%

  @include s
    padding: 0 0 40px 0

.vanacy_selected__block
  display: flex
  padding: 60px 0
  justify-content: space-between
  border-bottom: 1px solid #E7E3E0
  flex-direction: column
  @include xs
    padding: 30px 0

.vanacy_selected__block:last-child
  border-bottom: none
.vanacy_selected__block_paragraph
  width: 100%
.vanacy_selected__block_paragraph_wrapper
  display: flex
  flex-direction: column
  width: 60%

  @include xs
    width: 100%

.vanacy_selected__block_title
  @include adaptive-font-size(20, 18, 16)
  @include adaptive-line-height(28, 28, 20)
  font-weight: 600
  text-transform: uppercase

  @include xs
    margin-bottom: 16px

.vanacy_selected__block_paragraph
  @include adaptive-font-size(18, 16, 14)
  @include adaptive-line-height(26, 24, 20)

.vanacy_selected__block_paragraph_wrapper
  .vanacy_selected__block_paragraph ::v-deep p
    @include adaptive-font-size(18, 16, 14)
    @include adaptive-line-height(26, 24, 20)
    padding-left: 12px
    position: relative
    @include xs
      // padding-left: 0

.vanacy_selected__block_paragraph_wrapper
  .vanacy_selected__block_paragraph ::v-deep p:after
    display: none

.vanacy_selected__block_paragraph_wrapper
  .vanacy_selected__block_paragraph ::v-deep p:before
    position: absolute
    content: ''
    top: 10px
    left: 0
    width: 5px
    height: 5px
    border-radius: 50%
    background-color: var(--color-main)
    box-shadow: 0px 2px 4px var(--box-shadow-color)
    @include xs
      top: 12px

.vanacy_selected__block_paragraph_wrapper ::v-deep
  .vanacy_selected__block_paragraph + .vanacy_selected__block_paragraph
    margin-top: 12px

.vacancy_conditions_list_item:last-child
  .vanacy_selected__block_paragraph ::v-deep p:before
    display: none

.vacancy_conditions_list_item:last-child
  .vanacy_selected__block_paragraph ::v-deep p
    padding-left: 0

.vacancy_conditions_list_item:last-child
  .vanacy_selected__block_paragraph ::v-deep li:after,
  .vanacy_selected__block_paragraph ::v-deep li:before
    display: none
</style>
