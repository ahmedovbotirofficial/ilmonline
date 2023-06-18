import { Axios } from '@/api/config';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';
import { COURSES_MODES } from '@/types/constants';

const api_version = '/api';

export const login = (data) => {
  const url = `${api_version}/auth/sign-in`;
  return Axios.post(url, data);
};

export const getExistEmail = (data) => {
  const url = `${api_version}/auth/exist-user-email`;
  return Axios.post(url, data);
};

export const singUp = (data) => {
  const url = `${api_version}/auth/sign-up`;
  return Axios.post(url, data);
};

export const singUpVerify = (data) => {
  const url = `${api_version}/auth/sign-up/verify`;
  return Axios.post(url, data);
};

export const resetPassword = (data) => {
  const url = `${api_version}/auth/reset-password`;
  return Axios.post(url, data);
};

export const resentResetPassword = (data) => {
  const url = `${api_version}/auth/sign-up/re-send-verify-mail`;
  return Axios.post(url, data);
};

export const confirmResetPassword = (data) => {
  const url = `${api_version}/auth/reset-password-confirm`;
  return Axios.post(url, data);
};

export const getCoursesFilters = () => {
  const url = `${api_version}/courses/filters`;
  return Axios.get(url);
};

export const getCoursesCategories = () => {
  const url = `${api_version}/courses/categories`;
  return Axios.get(url);
};

export const getCoursesList = (data) => {
  // console.log('getCoursesList >>>>>', data);
  const url = `${api_version}/courses`;
  return Axios.get(url, {
    params: data,
  });
};

export const getMyCoursesList = (data) => {
  const url = `${api_version}/profile/courses`;
  return Axios.get(url, {
    params: data,
  });
};

export const addCourseReview = (id, rating, text) => {
  const url = `${api_version}/profile/courses/${id}/reviews/add`;
  const data = { rating, text };
  return Axios.post(url, data);
};

export const getCourseReviews = (id, offset) => {
  const url = `${api_version}/courses/course/${id}/reviews?offset=${offset}`;
  return Axios.get(url);
};

export const getPopularCoursesList = () => {
  const url = `${api_version}/courses/popular`;
  return Axios.get(url);
};

export const getStudentsList = (data) => {
  const url = `${api_version}/profile/teacher/my-students`;
  return Axios.get(url, {
    params: data,
  });
};

export const getStudentsCourseProgressList = (id) => {
  const url = `${api_version}/profile/teacher/my-students/student-course-progress/${id}/all`;
  return Axios.get(url);
};

export const getStudentsCourseProgress = (id) => {
  const url = `${api_version}/profile/teacher/my-students/student-course-progress/${id}`;
  return Axios.get(url);
};

export const getLessonProgressData = (data) => {
  const url = `${api_version}/profile/teacher/my-students/student/${data.student_id}/lesson/${data.lesson_id}/progress`;
  return Axios.get(url);
};

export const getTeacherTestResults = (data) => {
  const url = `${api_version}/profile/teacher/my-students/student/${+data.student_id}/test/${+data.test_id}/progress`;
  return Axios.get(url);
};

export const getTeacherLessonProgress = ({ lesson_progress_id }) => {
  const url = `${api_version}/profile/teacher/my-students/student-lesson-progress/${+lesson_progress_id}`;
  return Axios.get(url);
};

export const getNewsDigestList = (data) => {
  const url = `${api_version}/news/digest`;
  return Axios.get(url, {
    params: data,
  });
};

export const getNewsList = (data) => {
  const url = `${api_version}/news`;
  return Axios.get(url, {
    params: data,
  });
};

export const getNewsCategories = (data) => {
  const url = `${api_version}/news/categories`;
  return Axios.get(url);
};

export const getNewsSimilar = (data) => {
  const url = `${api_version}/news/posts/similar`;
  return Axios.get(url);
};

export const getNewsBySlug = (data) => {
  const url = `${api_version}/news/post/${data.slug}`;
  return Axios.get(url);
};

export const getPprofileData = (data) => {
  const url = `${api_version}/profile`;
  return Axios.get(url, { params: data });
};

// export const getVideo = (id) => {
//   const url = `${api_version}/profile/courses/lesson/${id}/video`;
//   const config = { responseType: 'blob' };
//   return Axios.get(url, config);
// };

export const getCurrentCoursePreview = (id) => {
  const url = `${api_version}/courses/course/${id}/preview`;
  return Axios.get(url);
};

// export const getCurrentCourseData = (id) => {
//   const url = `${api_version}/courses/course/${id}`;
//   return Axios.get(url);
// };

export const getCurrentCourseData = (id) => {
  const url = `${api_version}/courses/course/${id}/detailed`;
  return Axios.get(url);
};

export const getConnectionToken = () => {
  const url = `${api_version}/profile/connection-token`;
  return Axios.get(url);
};

export const getParentConnectionStatus = () => {
  const url = `${api_version}/profile/parental-control/application/status`;
  return Axios.get(url);
};

export const sendSubmitParentControl = (data) => {
  const url = `${api_version}/profile/parental-control/application/submit`;
  return Axios.post(url, data);
};

export const getBroadcastingChannelId = () => {
  const url = `${api_version}/profile/broadcasting-channel-id`;
  return Axios.get(url);
};

export const getThreads = (searchQuery = '') => {
  let url = `${api_version}/profile/messenger/threads?course_type=course`;
  if (!!searchQuery) {
    url += `&search_query=${searchQuery}`;
  }
  return Axios.get(url);
};

export const getMyUnreadMessages = () => {
  let url = `${api_version}/profile/messenger/threads/my-unread-messages?course_type=course`;
  return Axios.get(url);
};

export const sendUserMessage = (data) => {
  // console.log(data);
  const url = `${api_version}/profile/messenger/threads/send-message`;
  return Axios.post(url, data);
};

export const getMessages = ({ thread_id, offset }) => {
  const url = `${api_version}/profile/messenger/threads/messages?thread_id=${thread_id}&offset=${offset}`;
  return Axios.get(url);
};

export const getSchoolStudentSubscriptionInfo = () => {
  const url = `${api_version}/profile/smart-subscriptions`;
  return Axios.get(url);
};

export const deleteStudentSubscription = () => {
  const url = `${api_version}/profile/smart-subscriptions`;
  return Axios.delete(url);
};

export const updateStudentSubscription = (data) => {
  // console.log(data);
  const url = `${api_version}/profile/smart-subscriptions/subscription`;
  return Axios.post(url, data);
};

export const getMyCourseProgress = (id) => {
  // console.log('course', id);
  const url = `${api_version}/profile/courses/${id}/progress`;
  return Axios.get(url);
};

export const startCourse = ({ course_id }) => {
  const url = `${api_version}/profile/courses/${course_id}/start-course`;
  return Axios.post(url);
};

export const purchaseCourse = (id) => {
  const url = `${api_version}/profile/courses/${id}/purchase-course`;
  return Axios.post(url);
};

export const startLesson = ({ course_id, lesson_id }) => {
  const url = `${api_version}/profile/courses/${course_id}/lesson/${lesson_id}/start`;
  return Axios.post(url);
};

export const setVideoSecond = (data) => {
  const url = `${api_version}/profile/courses/lesson/${data.lesson_id}/set-lesson-progress-video-minute`;
  return Axios.post(url, data.minute);
};

export const getLessonTest = ({ lesson_id }) => {
  const url = `${api_version}/profile/courses/lesson/${lesson_id}/test`;
  return Axios.get(url);
};

export const passingTest = ({ urlInfo, currentAnswer }) => {
  // console.log('answer for current test >>>', urlInfo, currentAnswer);
  const url = `${api_version}/profile/courses/${urlInfo.course_id}/lesson/${urlInfo.lesson_id}/test/${urlInfo.test_id}`;
  return Axios.post(url, currentAnswer);
};

export const endPassingTest = ({ urlInfo }) => {
  // console.log('answer for current test >>>', urlInfo);
  const url = `${api_version}/profile/courses/${+urlInfo.course_id}/lesson/${+urlInfo.lesson_id}/test/${+urlInfo.test_id}/end`;
  return Axios.post(url);
};

export const getLessonTestRightResponses = ({ lesson_id }) => {
  const url = `${api_version}/profile/courses/lesson/${lesson_id}/test-right-responses`;
  return Axios.get(url);
};

export const deleteLessonTest = ({ test_id }) => {
  // console.log('deleteLessonTest ID', test_id);
  const url = `${api_version}/profile/courses/test/${test_id}`;
  return Axios.delete(url);
};

export const getTrialTestCategories = () => {
  const url = `${api_version}/profile/trial-tests/categories/all`;
  return Axios.get(url);
};

export const getQuizTestCategories = () => {
  const url = `${api_version}/profile/quiz-tests/categories/all`;
  return Axios.get(url);
};

export const getQuizTestsList = (data) => {
  let url = `${api_version}/profile/quiz-tests/category/${data.category_id}?`;
  let filtersUrl = '';
  if (!!data.filters.length) {
    for (let i = 0; i < data.filters.length; i++) {
      filtersUrl += `&filters[${i}]=${data.filters[i]}`;
    }
  }
  url += filtersUrl;

  if (!!data.token) {
    // console.log('data.token >>>>', data.token);
    url += `&student_unique_token=${data.token}`;
  }
  return Axios.get(url, data.filters);
};

export const getQuizSubCategories = () => {
  const url = `${api_version}/profile/quiz-tests/subcategories/all`;
  return Axios.get(url);
};

export const getQuizCategoriesBySubCategories = ({ id }) => {
  const url = `${api_version}/profile/quiz-tests/subcategory/${id}/categories`;
  return Axios.get(url);
};

export const getQuizFilters = () => {
  const url = `${api_version}/profile/quiz-tests/categories/filters`;
  return Axios.get(url);
};

export const getQuizTest = ({ quiz_id }) => {
  const url = `${api_version}/profile/quiz-tests/${quiz_id}`;
  return Axios.get(url);
};

export const startQuizTest = (data) => {
  // console.log('start quiz_id >>>', quiz_id);
  let url = `${api_version}/profile/quiz-tests/${data.quiz_id}/start`;

  if (!!data.token) {
    // console.log('start data.token >>>>', data.token);
    url += `?student_unique_token=${data.token}`;
  }
  return Axios.post(url, data);
};

export const quizTestStartTimer = ({ quiz_id }) => {
  const url = `${api_version}/profile/my-quiz-tests/${quiz_id}/update-timer-status`;
  return Axios.post(url);
};

export const passingQuizTest = ({ answersData, quiz_id, token }) => {
  // console.log('passingQuizTest data >>>', selectedAnswerData);
  let url = `${api_version}/profile/quiz-tests/${quiz_id}/pass`;

  if (!!token) {
    // console.log('start data.token >>>>', token);
    url += `?student_unique_token=${token}`;
  }
  return Axios.post(url, answersData);
};

export const getQuizTestResults = ({ quiz_passing_id }) => {
  // console.log('quiz_passing_id', quiz_passing_id);
  const url = `${api_version}/profile/quiz-tests/my-quiz-test/${+quiz_passing_id}`;
  return Axios.get(url);
};

export const getQuizCertificate = ({ quiz_passing_id, unique_token }) => {
  // console.log(!!getFromLS('token'));
  let url = `${api_version}/profile/quiz-tests/my-quiz-test/${+quiz_passing_id}/certificate`;

  // if (!!!getFromLS('token')) {
  // console.log('start data.token >>>>', token);
  url += `?student_unique_token=${unique_token}`;
  // }
  const config = { responseType: 'arraybuffer' };
  return Axios.get(url, config);
};

export const sendQuizTestResults = (data) => {
  // console.log('quiz_passing_id', quiz_passing_id);
  const url = `${api_version}/profile/quiz-tests/results/mail`;
  return Axios.post(url, data);
};

export const getTrialSchoolItem = ({ school_id }) => {
  const url = `${api_version}/profile/trial-tests/category/${+school_id}`;
  return Axios.get(url);
};

export const getTrialTestList = (data) => {
  // console.log('category direction ID >>>', category_id);
  let url = `${api_version}/profile/trial-tests/school_item/${+data.category_id}?`;
  if (!!data.token) {
    // console.log('data.token >>>>', data.token);
    url += `&student_unique_token=${data.token}`;
  }
  return Axios.get(url);
};

export const getTrialTest = (variant_id) => {
  // console.log(variant_id);
  const url = `${api_version}/profile/trial-tests/${+variant_id}`;
  return Axios.get(url);
};

export const getMyTrialTest = ({ try_id }) => {
  const url = `${api_version}/profile/trial-tests/my-trial-test/${+try_id}`;
  return Axios.get(url);
};

export const sendMyTrialTest = (data) => {
  // console.log(data);
  const url = `${api_version}/profile/trial-tests/results/mail`;
  return Axios.post(url, data);
};

export const startTrialTestVariant = (data) => {
  // console.log('variant id', data);
  let url = `${api_version}/profile/trial-tests/${+data.variant_id}/start`;
  if (!!data.token) {
    // console.log('start data.token >>>>', data.token);
    url += `?student_unique_token=${data.token}`;
  }
  return Axios.post(url);
};

export const deleteTrialTestVariant = (data) => {
  // console.log('delete variant >>>', data);
  let url = `${api_version}/profile/trial-tests/my-trial-test/${+data.try_id}`;
  if (!!data.token) {
    url += `?student_unique_token=${data.token}`;
  }
  return Axios.delete(url);
};

export const passingTrialTestVariant = ({
  selectedAnswerData,
  variant_id,
  token,
}) => {
  // console.log('passing data >>>', selectedAnswerData);
  let url = `${api_version}/profile/trial-tests/${variant_id}/pass`;
  if (!!token) {
    // console.log('start data.token >>>>', token);
    url += `?student_unique_token=${token}`;
  }
  // const url = `${api_version}/profile/trial-tests/1/pass`;
  return Axios.post(url, selectedAnswerData);
};

export const getMyTrialTests = (data) => {
  const url = `${api_version}/profile/trial-tests/my-trial-tests/all`;
  return Axios.get(url, { params: data });
};

export const deletePhoto = () => {
  const url = `${api_version}/profile/delete-photo`;
  return Axios.delete(url);
};

export const uploadPhoto = (data) => {
  const url = `${api_version}/profile/upload-photo`;
  return Axios.post(url, data);
};

export const updateProfileInfo = (data) => {
  const url = `${api_version}/profile/update-information`;
  return Axios.post(url, data);
};

export const changePasswrod = (data) => {
  const url = `${api_version}/profile/change-password`;
  return Axios.post(url, data);
};

export const sendFeedbackFormData = (data) => {
  const url = `${api_version}/common/question-form/submit`;
  return Axios.post(url, data);
};

export const createWithdrawalRequest = (data) => {
  const url = `${api_version}/profile/payment-data/withdrawal/create`;
  return Axios.post(url, data);
};

export const getImgByLocation = (data) => {
  const url = `${api_version}/common/region-ornament?lat=${data.lat}&lng_lat=${data.lng_lat}`;
  return Axios.get(url);
};

// export const singInFacebook = (data) => {
//   const url = `${api_version}/auth/social/sign-in/facebook?role=student`;
//   return Axios.get(url, data);
// };
