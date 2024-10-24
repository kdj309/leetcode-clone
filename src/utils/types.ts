import { ReactNode } from 'react';

export interface themeContext {
  toggleColorMode: () => void;
  colorMode: 'light' | 'dark';
}

export interface contextWrapperProps {
  children: ReactNode;
}
export interface Problem {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; output: string }[];
  status: string;
  _id: string;
  starterCode: { lang_id: number; code: string }[];
  systemCode: { lang_id: number; code: string }[];
  imports: { lang_id: number; code: string }[];
  metadata: metadata;
  languagestoskip: number[];
}
export interface commonresponse {
  status: 'Success' | 'Failure';
  error?: string;
  data: any;
}
export interface getProblemsType extends Omit<commonresponse, 'data'> {
  data: Problem[];
}
export interface getProblemType extends Omit<commonresponse, 'data'> {
  data: Problem;
}

export interface getUserType extends Omit<commonresponse, 'data'> {
  data: user;
}
export interface signInType extends Omit<commonresponse, 'data'> {
  data: { id: string };
}
export interface signUpType extends Omit<commonresponse, 'data'> {
  data: { id: string };
}

export interface updateUserType extends Omit<commonresponse, 'data'> {
  data: user;
}
export interface refreshTokenRes extends Omit<commonresponse, 'data'> {
  data: {};
}

export interface metadata {
  input_format: string;
  output_format: string;
  judge_input_template: string;
  variables_names: Record<string, string>;
  variables_types: Record<string, string>;
}
export interface inputformat extends Omit<metadata, 'judge_input_temple' | 'output_format'> {}
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export interface submission {
  language_id: number;
  stdin: string;
  stdout: null | string;
  stderr: null | string;
  status: {
    id: number;
    description: string;
  };
  expected_output: string;
}
export interface problemsubmission {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: 'Accepted' | 'Wrong Answer' | 'Error';
  submittedAt: Date;
}
export interface user {
  _id: string;
  username: string;
  email: string;
  password: string;
  favoriteProgrammingLanguage: string;
  roles: string[];
  submissions: problemsubmission[];
}
export interface createUser extends Partial<user> {}
export interface updateuser extends Partial<user> {}
export type status = 'Accepted' | 'Wrong Answer' | 'Processing';
export interface submissionprops {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: string;
  submittedAt: Date;
}
export interface batchsubmission {
  token: string;
}
export interface problemsubmissionstatus {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: string;
  submittedAt: Date;
}
