import store from '@/store';

export const getDateFromString = (val, withoutYear) => {
  let strArray;
  if (store.getters.getSelectedLanguage === 'ru') {
    strArray = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
  } else if (store.getters.getSelectedLanguage === 'uz') {
    strArray = [
      'Январ',
      'Феврал',
      'Март',
      'Апрел',
      'Май',
      'Июн',
      'Июл',
      'Август',
      'Сентябр',
      'Октябр',
      'Ноябр',
      'Декабр',
    ];
  } else if (store.getters.getSelectedLanguage === 'uz-latn') {
    strArray = [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentyabr',
      'Oktyabr',
      'Noyabr',
      'Dekabr',
    ];
  }
  let date = new Date(val.replace(/-/g, '/'));
  let d = date.getDate();
  let m = strArray[date.getMonth()];
  let y = date.getFullYear();
  let total = m + ' ' + (d <= 9 ? '0' + d : d);
  if (!withoutYear) total += ', ' + y;
  return total;
};
