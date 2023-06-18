import {
  getIndividualTaskProgress,
  retakeIndividualTaskProgress,
  getIndividualTask,
  startIndividualTask,
  uploadIndividualTaskFile,
  deleteIndividualTaskFile,
  sendIndividualTask,
  getUploadedFilesArchive,
  gradeIndividualTask,
  getFilesArchiveFromStudent,
  getMyNotCheckedTasksCounter,
} from '@/api/pro-courses/services';
import router from '@/router';

export default {
  state: {
    notCheckedTasksCounter: null,
  },
  getters: {
    getNotCheckedTasksCounter: (state) => state.notCheckedTasksCounter,
  },
  mutations: {
    SET_NOT_CHECKED_TASKS_COUNTER(state, options) {
      state.notCheckedTasksCounter = options;
    },
  },
  actions: {
    async getIndividualTaskProgress({ commit }, task_progress_id) {
      try {
        const res = await getIndividualTaskProgress(task_progress_id);
        if (res.status === 200) return res.data.data.task_progress;
      } catch (error) {
        console.log(error);
      }
    },

    async retakeIndividualTaskProgress({ commit }, task_progress_id) {
      try {
        const res = await retakeIndividualTaskProgress(task_progress_id);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getIndividualTask({ commit }, lessonId) {
      try {
        const res = await getIndividualTask(lessonId);
        if (res.status === 200) return res.data.data.task;
      } catch (error) {
        console.log(error);
      }
    },

    async startIndividualTask({ commit }, payload) {
      try {
        const res = await startIndividualTask(payload);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async uploadIndividualTaskFile(
      { commit },
      { task_progress_id, data, onProgress }
    ) {
      try {
        const res = await uploadIndividualTaskFile(
          task_progress_id,
          data,
          onProgress
        );
        if (res.status === 200) return res.data.data.file;
      } catch (error) {
        commit('SET_ERRORS', error.response.data.error);
      }
    },

    async deleteIndividualTaskFile({ commit }, payload) {
      try {
        const res = await deleteIndividualTaskFile(payload);
        if (res.status === 200) return res.data.data.is_deleted;
      } catch (error) {
        console.log(error);
      }
    },

    async sendIndividualTask({ commit }, payload) {
      try {
        const res = await sendIndividualTask(payload);
        if (res.status === 200) {
          commit('SET_MY_COURSE_PROGRESS', res.data.data.courseProgress);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getUploadedFilesArchive({ commit }, task_progress_id) {
      try {
        const res = await getUploadedFilesArchive(task_progress_id);
        if (res.status === 200) {
          return res;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async gradeIndividualTask({ commit }, payload) {
      try {
        const res = await gradeIndividualTask(payload);
        if (res.status === 200) router.push({ name: 'students' });
      } catch (error) {
        console.log(error);
      }
    },

    async getFilesArchiveFromStudent({ commit }, task_progress_id) {
      try {
        const res = await getFilesArchiveFromStudent(task_progress_id);
        if (res.status === 200) {
          return res;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getMyNotCheckedTasksCounter({ commit }) {
      try {
        const res = await getMyNotCheckedTasksCounter();
        if (res.status === 200) {
          commit(
            'SET_NOT_CHECKED_TASKS_COUNTER',
            res.data.data.not_checked_tasks_counter
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
