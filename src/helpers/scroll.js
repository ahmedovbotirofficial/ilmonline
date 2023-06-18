export const scrollToBeginForm = (id) => {
  const scrollPosition = window.pageYOffset;
  let offsetTop = '';
  if (id > 0) {
    offsetTop = id;
  } else {
    offsetTop = document.getElementById(id).offsetTop;
  }
  if (scrollPosition !== offsetTop) {
    window.scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
  }
};
