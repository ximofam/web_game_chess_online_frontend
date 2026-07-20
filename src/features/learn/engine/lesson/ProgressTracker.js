const STORAGE_KEY = 'chess_learn_progress_v1';

export class ProgressTracker {
  static getProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { completedLessons: {}, lessonSteps: {} };
    } catch {
      return { completedLessons: {}, lessonSteps: {} };
    }
  }

  static isLessonCompleted(lessonId) {
    const progress = this.getProgress();
    return Boolean(progress.completedLessons[lessonId]);
  }

  static getCompletedSteps(lessonId) {
    const progress = this.getProgress();
    return progress.lessonSteps[lessonId] || [];
  }

  static saveStepProgress(lessonId, stepIndex) {
    try {
      const progress = this.getProgress();
      const current = progress.lessonSteps[lessonId] || [];
      if (!current.includes(stepIndex)) {
        progress.lessonSteps[lessonId] = [...current, stepIndex];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
    } catch {
      // Ignore storage errors
    }
  }

  static markLessonComplete(lessonId) {
    try {
      const progress = this.getProgress();
      progress.completedLessons[lessonId] = {
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage errors
    }
  }

  static resetProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
}
