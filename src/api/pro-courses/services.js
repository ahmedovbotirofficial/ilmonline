import { Axios } from '@/api/config';
const api_version = '/api';

export const getProCoursesFilters = () => {
  const url = `${api_version}/pro-courses/filters`;
  return Axios.get(url);
};

export const getCurrentProCoursePreview = (id) => {
  const url = `${api_version}/pro-courses/course/${id}/preview`;
  return Axios.get(url);
};

export const getCurrentProCourseData = (id) => {
  const url = `${api_version}/pro-courses/course/${id}/detailed`;
  return Axios.get(url);
};

export const getProCoursesCategories = () => {
  const url = `${api_version}/pro-courses/categories`;
  return Axios.get(url);
};

export const getProCoursesList = (data) => {
  const url = `${api_version}/pro-courses`;
  return Axios.get(url, {
    params: data,
  });
};

export const getMyCoursesList = (data) => {
  const url = `${api_version}/profile/pro-courses`;
  return Axios.get(url, {
    params: data,
  });
};

export const getPopularProCoursesList = () => {
  const url = `${api_version}/pro-courses/popular`;
  return Axios.get(url);
};

export const getLatestProCoursesList = () => {
  const url = `${api_version}/pro-courses/latest`;
  return Axios.get(url);
};

// export const getCurrentProCourseData = (id) => {
//   const url = `${api_version}/pro-courses/course/${id}/preview`;
//   return Axios.get(url);
// };

export const getMyProCourseProgress = (id) => {
  // console.log('course', id);
  const url = `${api_version}/profile/pro-courses/${id}/progress`;
  return Axios.get(url);
};

export const setProVideoSecond = (data) => {
  const url = `${api_version}/profile/pro-courses/lesson/${data.lesson_id}/set-lesson-progress-video-minute`;
  return Axios.post(url, data.minute);
};

export const startProCourse = ({ course_id }) => {
  const url = `${api_version}/profile/pro-courses/${course_id}/start-course`;
  return Axios.post(url);
};

export const startProLesson = ({ course_id, lesson_id }) => {
  const url = `${api_version}/profile/pro-courses/${course_id}/lesson/${lesson_id}/start`;
  return Axios.post(url);
};

export const getLessonTest = ({ lesson_id }) => {
  const url = `${api_version}/profile/pro-courses/lesson/${lesson_id}/test`;
  return Axios.get(url);
};

export const deleteLessonTest = ({ test_id }) => {
  // console.log('deleteLessonTest ID', test_id);
  const url = `${api_version}/profile/pro-courses/test/${test_id}`;
  return Axios.delete(url);
};

export const passingTest = ({ urlInfo, currentAnswer }) => {
  // console.log('answer for current test >>>', currentAnswer);
  const url = `${api_version}/profile/pro-courses/${urlInfo.course_id}/lesson/${urlInfo.lesson_id}/test/${urlInfo.test_id}`;
  return Axios.post(url, currentAnswer);
};

export const getLessonTestRightResponses = ({ lesson_id }) => {
  const url = `${api_version}/profile/pro-courses/lesson/${lesson_id}/test-right-responses`;
  return Axios.get(url);
};

export const getProCourseReviews = (id, offset) => {
  const url = `${api_version}/pro-courses/course/${id}/reviews?offset=${offset}`;
  return Axios.get(url);
};

export const addProCourseReview = (id, rating, text) => {
  const url = `${api_version}/pro-courses/course/${id}/reviews/add`;
  const data = { rating, text };
  return Axios.post(url, data);
};

export const purchaseProCourse = (id) => {
  const url = `${api_version}/profile/pro-courses/${id}/purchase-course`;
  return Axios.post(url);
};

export const getProStudentSubscriptionInfo = () => {
  const url = `${api_version}/profile/pro-course-smart-subscriptions`;
  return Axios.get(url);
};

export const deleteProStudentSubscription = () => {
  const url = `${api_version}/profile/pro-course-smart-subscriptions`;
  return Axios.delete(url);
};

export const updateProStudentSubscription = (data) => {
  console.log(data);
  const url = `${api_version}/profile/pro-course-smart-subscriptions/subscription`;
  return Axios.post(url, data);
};

// Teacher role

export const getProStudentsList = (data) => {
  const url = `${api_version}/profile/teacher/pro/my-students`;
  return Axios.get(url, {
    params: data,
  });
};

export const getStudentsProCourseProgressList = (id) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student-pro-course-progress/${id}/all`;
  return Axios.get(url);
};

export const getStudentsProCourseProgress = (id) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student-course-progress/${id}`;
  return Axios.get(url);
};

export const getProLessonProgressData = (data) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student/${data.student_id}/lesson/${data.lesson_id}/progress`;
  return Axios.get(url);
};

export const getProTeacherLessonProgress = ({ lesson_progress_id }) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student-lesson-progress/${+lesson_progress_id}`;
  return Axios.get(url);
};

// Individual Task

// Student

export const getIndividualTask = (lessonId) => {
  const url = `${api_version}/profile/pro-courses/lesson/${lessonId}/task`;
  return Axios.get(url);
};

export const startIndividualTask = ({
  course_id,
  lesson_id,
  individual_task_id,
}) => {
  const url = `${api_version}/profile/pro-courses/${course_id}/lesson/${lesson_id}/task/${individual_task_id}/start`;
  return Axios.post(url);
};

export const uploadIndividualTaskFile = (
  task_progress_id,
  data,
  onProgress
) => {
  const url = `${api_version}/profile/pro-courses/task-progress/${task_progress_id}/upload-file`;

  const config = {
    onUploadProgress(event) {
      const percentCompleted = Math.round((event.loaded * 100) / event.total);
      // execute the callback
      if (onProgress) onProgress(percentCompleted);

      return percentCompleted;
    },
  };

  return Axios.post(url, data, config);
};

export const deleteIndividualTaskFile = ({ task_progress_id, hash }) => {
  const url = `${api_version}/profile/pro-courses/task-progress/${task_progress_id}/file/${hash}`;
  return Axios.delete(url);
};

export const sendIndividualTask = ({
  course_id,
  lesson_id,
  individual_task_id,
  data,
}) => {
  const url = `${api_version}/profile/pro-courses/${course_id}/lesson/${lesson_id}/task/${individual_task_id}`;
  return Axios.post(url, data);
};

export const getUploadedFilesArchive = (task_progress_id) => {
  const url = `${api_version}/profile/pro-courses/task-progress/${task_progress_id}/files-to-zip-archive`;
  const config = { responseType: 'arraybuffer' };
  return Axios.get(url, config);
};

// Teacher

export const getIndividualTaskProgress = (task_progress_id) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student-task-progress/${task_progress_id}`;
  return Axios.get(url);
};

export const retakeIndividualTaskProgress = (task_progress_id) => {
  const url = `${api_version}/profile/pro-courses/task-progress/${task_progress_id}/retake`;
  return Axios.post(url);
};

export const gradeIndividualTask = ({ task_progress_id, data }) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student-task-progress/${task_progress_id}`;
  return Axios.post(url, data);
};

export const getFilesArchiveFromStudent = (task_progress_id) => {
  const url = `${api_version}/profile/teacher/pro/my-students/student-task-progress/${task_progress_id}/files-to-zip-archive`;
  const config = { responseType: 'arraybuffer' };
  return Axios.get(url, config);
};

export const getMyNotCheckedTasksCounter = () => {
  const url = `${api_version}/profile/teacher/pro/my-students/not-checked-tasks-counter`;
  return Axios.get(url);
};

export const getProThreads = (searchQuery = '') => {
  let url = `${api_version}/profile/messenger/threads?course_type=pro-course`;
  if (!!searchQuery) {
    url += `&search_query=${searchQuery}`;
  }
  return Axios.get(url);
};

export const getMyProUnreadMessages = () => {
  let url = `${api_version}/profile/messenger/threads/my-unread-messages?course_type=pro-course`;
  return Axios.get(url);
};
