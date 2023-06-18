const COURSES_MODES = Object.freeze({
  SCHOOL: 'school',
  PRO: 'pro',
});

const DEFAULT_COURSES_MODE = COURSES_MODES.SCHOOL;

const MAIN_COLORS = {
  school: {
    text: '#EC5239',
    button: '#EC5239',
  },
  pro: {
    text: '#055dff',
    button: '#59C676',
  },
};

export { COURSES_MODES, DEFAULT_COURSES_MODE, MAIN_COLORS };
