<template>
  <div class="profile_main">
    <div>
      <div class="smart_subscribe__wrapper">
        <div>
          <h2 class="smart_subscribe__title title_blue">
            {{ $t('profilePage.title_smart_subscribe') }}
            <svg-icon name="stars" />
          </h2>
          <p class="smart_subscribe__text">
            Следующая оплата: 324 UZS будет снята 10.05.2022.
          </p>
          <div class="buttons">
            <ButtonBase
              size="popular"
              type="submit"
              border
              class="auth_form__sign_in_btn"
              >{{ $t('buttons.refresh') }}
            </ButtonBase>
            <ButtonBase
              size="popular"
              type="submit"
              class="auth_form__sign_in_btn"
              @click="chooseBlocks"
              >{{ $t('buttons.unsubscribe') }}
            </ButtonBase>
          </div>
          <div
            v-for="el in chosenDestinations"
            :key="el.id"
            class="chosen-destinations__block"
          >
            <svg-icon :name="el.icon" />
            <p class="chosen-destinations__item">{{ el.title }}</p>
          </div>
        </div>
        <svg-icon name="logo" />
      </div>
      <div class="profile_inside block_second">
        <h2 class="block_second_title">Скоро будет доступна рассрочка</h2>
        <svg-icon name="men_with_pazl" />
      </div>
      <div class="profile_inside">
        <div class="profile__smart_subscribe smart_subscribe">
          <div class="smart_subscribe__row_items">
            <div class="profile_main__title">
              <Heading class="smart_subscribe__title"
                >Инвестируйте в свое профессиональное развитие с ILM
              </Heading>
              <p class="smart_subscribe__text">
                Присоединяйтесь к тысячам учащихся, которые достигают своих
                целей вместе с ILM подпиской
              </p>
            </div>
            <div class="smart_subscribe__item_block">
              <div class="smart_subscribe__item">
                <div class="smart_subscribe__item_icon">
                  <svg-icon name="open_book" />
                </div>
                <div class="smart_subscribe__item_text">
                  Изучайте любые интересные или популярные уроки и развивайте
                  свои навыки
                </div>
              </div>
              <div class="smart_subscribe__item">
                <div class="smart_subscribe__item_icon">
                  <svg-icon name="money_box" />
                </div>
                <div class="smart_subscribe__item_text">
                  Если вы планируете пройти несколько уроков в этом году, то
                  можете сэкономить на обучении
                </div>
              </div>
              <div class="smart_subscribe__item">
                <div class="smart_subscribe__item_icon">
                  <svg-icon :name="`smart_subscribe_${getCoursesMode}`" />
                </div>
                <div class="smart_subscribe__item_text">
                  Учитесь в своем темпе, проходите несколько уроков одновременно
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  data() {
    return {
      chosenDestinations: [
        {
          id: 1,
          title: 'Естественные и технические науки',
          icon: 'check',
        },
        {
          id: 5,
          title: 'Mатематика и логика',
          icon: 'check',
        },
        {
          id: 3,
          title: 'Изучение языков',
          icon: 'check',
        },
        {
          id: 2,
          title: 'Гуманитарные науки',
          icon: 'check',
        },
        {
          id: 4,
          title: 'Бизнес',
          icon: 'cross',
        },
        {
          id: 6,
          title: 'Компьютерные науки',
          icon: 'cross',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['getCoursesMode']),
  },
};
</script>

<style lang="sass" scoped>
.chosen-destinations__item
  font-size: 15px
  line-height: 24px
  padding-left: 10px

.chosen-destinations__block
  display: flex
  align-items: center
  margin-top: 10px
  cursor: pointer

.icon-check
  max-width: 14px
  max-height: 14px
  fill: var(--color-success)

.icon-cross
  max-width: 12px
  max-height: 12px
  fill: var(--color-main)
</style>
