import i18n from './../i18n';
export const calcTimeHHMMSS = (time) => {
  let mm = 0;
  let ss = 0;
  let hh = 0;
  if (time < 60) return `${time} ${i18n.t('times.sec')}`;
  if (time >= 60 && time < 3600) {
    mm = Math.floor(time / 60);
    ss = time - mm * 60;
    return `${mm} ${i18n.t('times.minutes')} ${ss} ${i18n.t('times.sec')}`;
  } else {
    ss = Math.floor((time % 3600) % 60);
    mm = Math.floor((time % 3600) / 60);
    hh = Math.floor(time / 3600);
    return `${hh} ${i18n.t('times.hours')} ${mm} ${i18n.t(
      'times.minutes'
    )} ${ss} ${i18n.t('times.sec')}`;
  }
};

export const onlyHoursAndMinutes = (time) => {
  let mm = 0;
  let ss = 0;
  let hh = 0;
  if (time < 60) return `${time} ${i18n.t('times.sec')}`;
  if (time >= 60 && time < 3600) {
    mm = Math.floor(time / 60);
    ss = time - mm * 60;
    return `${mm} ${i18n.t('times.minutes')} ${ss} ${i18n.t('times.sec')}`;
  } else {
    ss = Math.floor((time % 3600) % 60);
    mm = Math.floor((time % 3600) / 60);
    hh = Math.floor(time / 3600);
    return `${hh} ${i18n.t('times.hours')} ${mm} ${i18n.t('times.minutes')}`;
  }
};
