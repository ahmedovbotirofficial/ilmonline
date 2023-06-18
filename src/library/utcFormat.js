export const convertUTCDateToLocalDate = (date) => {
  // console.log(date);
  let newDate = new Date(
    new Date(date).getTime() - new Date(date).getTimezoneOffset()
  );
  // console.log(newDate);
  return `${newDate.getHours()}:${`0${newDate.getMinutes()}`.slice(-2)}`;
};
