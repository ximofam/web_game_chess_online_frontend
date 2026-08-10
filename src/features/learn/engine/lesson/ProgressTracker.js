const STORAGE_KEY = 'chess_learn_progress_v1';

export const getProgress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { completedLessons: {}, lessonSteps: {} };
  } catch {
    return { completedLessons: {}, lessonSteps: {} };
  }
};

export const isLessonCompleted = (lessonId) => {
  const progress = getProgress();
  return Boolean(progress.completedLessons[lessonId]);
};

export const getCompletedSteps = (lessonId) => {
  const progress = getProgress();
  return progress.lessonSteps[lessonId] || [];
};

export const saveStepProgress = (lessonId, stepIndex) => {
  try {
    const progress = getProgress();
    const current = progress.lessonSteps[lessonId] || [];
    if (!current.includes(stepIndex)) {
      progress.lessonSteps[lessonId] = [...current, stepIndex];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch {
    // Ignore storage errors
  }
};

export const markLessonComplete = (lessonId) => {
  try {
    const progress = getProgress();
    progress.completedLessons[lessonId] = {
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors
  }
};

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};
