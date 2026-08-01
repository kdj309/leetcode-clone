import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Problem } from '../../utils/types';
interface ProblemSlice {
  problems: Problem[];
  setProblems: (problems: Problem[]) => void;
}

export const useProblemSlice = create<ProblemSlice>()(
  devtools(
    (set) => ({
      problems: [],
      setProblems: (problems) => set(() => ({ problems }), false, 'setProblems'),
    }),
    { name: 'problemSlice' }
  )
);
