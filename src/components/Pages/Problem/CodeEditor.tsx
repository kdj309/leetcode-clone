import { OnChange, OnMount } from '@monaco-editor/react';
import React, { lazy, useEffect } from 'react';
import Loader from '../../UI/Loader';
const Editor = lazy(() => import('@monaco-editor/react').then((module) => ({ default: module.Editor })));
import { loader } from '@monaco-editor/react';
import { darktheme, lighttheme } from '../../../constants/Index';

const CodeEditor: React.FC<{
  code: string;
  language: string;
  theme: string;
  onChange: OnChange | undefined;
  onMount: OnMount | undefined;
}> = ({ code, language, theme, onChange, onMount }) => {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme('mylightTheme', lighttheme);
      monaco.editor.defineTheme('mydarkTheme', darktheme);
    });
  }, []);

  return (
    <React.Suspense fallback={<Loader />}>
      <Editor
        theme={theme}
        language={language === 'c#' ? 'csharp' : language === 'c++' ? 'cpp' : language}
        value={code}
        className='tw-max-h-full tw-overflow-x-auto tw-max-w-dvw'
        onMount={onMount}
        options={{
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
        }}
        onChange={onChange}
      />
    </React.Suspense>
  );
};
export default CodeEditor;
