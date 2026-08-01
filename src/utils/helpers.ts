import { problemsubmission, submission } from './types';

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function getResult(batchwiseresults: submission[]) {
  let successcount = 0;

  for (let index = 0; index < batchwiseresults.length; index++) {
    const result = batchwiseresults[index];
    if (result.status.description != 'Accepted') {
      return { status: false, successcount };
    }
    successcount++;
  }
  return { status: true, successcount };
}
export function isAccepted(problemId: string, submissions: problemsubmission[]) {
  const userSubmissions = [
    ...new Set(submissions.filter((s) => s.status.toLowerCase() === 'accepted').map((s) => s.problemId)),
  ];
  return userSubmissions.includes(problemId);
}
export function isRejected(problemId: string, submissions: problemsubmission[]) {
  const userSubmissions = [
    ...new Set(submissions.filter((s) => s.status.toLowerCase() === 'wrong answer').map((s) => s.problemId)),
  ];
  return userSubmissions.includes(problemId);
}
export const getGridColumnStyles = (
  isPanelExpanded: boolean,
  isOtherPanelShrunk: boolean,
  isThisPanelShrunk: boolean
) => {
  if (isPanelExpanded || isOtherPanelShrunk) {
    return '1 / -1';
  } else if (isThisPanelShrunk) {
    return 'auto';
  }
  return 'auto';
};

export const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * 10) % length;
};

export const getGridTemplateColumns = (size1: number, size2: number) => {
  const halfSize = Math.floor(size1 / 2);
  const floredSizeTwp = Math.floor(size2);
  return `${halfSize - 1}% ${100 - (halfSize + floredSizeTwp) + 2}% ${floredSizeTwp - 1}%`;
};
export function getProblemWindow(currentProblemIndex: number, totalProblems: number, windowSize = 15) {
  if (currentProblemIndex === 0) {
    return { start: 0, end: 14 };
  }
  const beforeCount = Math.floor(windowSize / 2);
  const afterCount = windowSize - beforeCount - 1;

  let start = Math.max(currentProblemIndex - beforeCount, 1);
  let end = Math.min(currentProblemIndex + afterCount, totalProblems);

  // Adjust window if at edges
  if (start === 1) {
    end = Math.min(windowSize, totalProblems);
  }
  if (end === totalProblems) {
    start = Math.max(1, totalProblems - windowSize + 1);
  }

  return { start, end };
}
