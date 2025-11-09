import { useNavigate, useParams } from 'react-router';
import { Monaco } from '@monaco-editor/react';
import * as monaco from '@monaco-editor/react';
import { useMutation } from '@tanstack/react-query';
import getProblem from '../../../services/getProblem';
import { Alert, Backdrop, CircularProgress, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Layout from '../../UI/Layout';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import LanguageDropDown from './LanguageDropDown';
import { darktheme, lighttheme, supportedLanguages, theme } from '../../../constants/Index';
import { useAuthSlice } from '../../../store/authslice/auth';
import submitCode from '../../../services/sumbitCode';
import getStatus from '../../../services/getSubmissionStatus';
import { a11yProps, getGridColumnStyles, getGridTemplateColumns, getResult } from '../../../utils/helpers';
import CustomTabPanel from '../../UI/TabPanel';
import { Problem as ProblemType, problemsubmissionstatus, submission, user } from '../../../utils/types';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useUserSlice } from '../../../store/user';
import SkeletonResultsLoader from '../../UI/SkeletonResultsLoader';
import addSubmission from '../../../services/addSubmission';
import batchwiseSubmission from '../../../services/batchwiseSubmission';
import ProblemSubmissions from './ProblemSubmissions';
import SettingsOverscanOutlinedIcon from '@mui/icons-material/SettingsOverscanOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ProblemDescription from './ProblemInfo';
import CodeEditor from './CodeEditor';
import CustomTabs from '../../UI/CustomTabs';
import ProblemResults from './ProblemResults';
import ProblemSubmissionStatus from './ProblemSubmissionStatus';
import useResizePanel from '../../../hooks/useResizePanel';
import useShrinkState from '../../../hooks/useShrinkState';
import { useCodeStorage } from '../../../db';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import useFullScreen from '../../../hooks/useFullScreen';

export default function Problem() {
  const { problemname } = useParams();
  const editorRef = useRef(null);
  const user = useUserSlice((state) => state.user);
  const setUser = useUserSlice((state) => state.setUser);
  const { colorMode } = usethemeUtils();
  const [open, setOpen] = useState<boolean>(true);
  const [language, setLanguage] = useState<number>(user?.favoriteProgrammingLanguage ?? 93);
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isSumbitted, setIsSumbitted] = useState<boolean>(false);
  const [submissionTab, setSubmissionTab] = useState<number>(0);
  const [submissionStatusLoading, setSubmissionStatusLoading] = useState<boolean>(false);
  const [submissionStatusError, setSubmissionStatusError] = useState<boolean>(false);
  const [submissionStatusInprocess, setSubmissionStatusInProcess] = useState<boolean>(false);
  const [problemSubmissionLoading, setProblemSubmissionLoading] = useState<boolean>(false);
  const [problemSubmissionStatus, setProblemSubmissionStatus] = useState<'Accepted' | 'Rejected' | ''>('');
  const [problemsuccessCount, setSuccessCount] = useState<number>(0);
  const [leftTab, setLeftTab] = useState<number>(0);
  const [problemRunStatus, setproblemRunStatus] = useState<submission[]>([]);
  const [problemsubmissions, setProblemSubmissions] = useState<problemsubmissionstatus[]>(user?.submissions ?? []);
  const [isProblemLoading, setIsProblemLoading] = useState<boolean>(false);
  const [problemInfo, setProblemInfo] = useState<ProblemType | null>(null);
  const [isErrorWithProblemInfo, setIsErrorWithProblemInfo] = useState<boolean>(false);
  const [errorInfoProblemFetch, setErrorInfoProblemFetch] = useState<Error | null>(null);
  const [code, setCode] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isFullScreenEnabled, toggleFullScreen } = useFullScreen();

  const [isLeftPanelExpanded, toggleLeftPanelExpansion] = useReducer((state) => {
    if (state && editorRef.current) {
      // @ts-ignore
      editorRef.current.layout({});
    }
    return !state;
  }, false);

  const [isRightPanelExpanded, toggleRightPanelExpansion] = useReducer((state) => !state, false);

  const {
    expandLeftPanel,
    expandRightPanel,
    shrinkLeftHandler,
    shrinkRightHandler,
    isResizeActive,
    isLeftPanelOnlyShrinked,
    isRightPanelOnlyShrinked,
    shrinkState,
  } = useShrinkState({ isLeftPanelExpanded, isRightPanelExpanded });

  const { startDragging, sizes } = useResizePanel({
    initialSize: { div1: 100, div2: 50 },
    containerRef,
    resizeHandler: (e) => {
      if (!containerRef.current) {
        return null;
      }
      const containerRect = containerRef.current.getBoundingClientRect();
      const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 200;
      const constrainedPercentage = Math.floor(percentage);
      return { div1: constrainedPercentage, div2: Math.floor((200 - constrainedPercentage) / 2) };
    },
  });

  const { saveUserCode, getUserCode } = useCodeStorage();

  useEffect(() => {
    setCurrentTab(0);
    setProblemSubmissionStatus('');
    setSuccessCount(0);
  }, [problemname]);

  useEffect(() => {
    try {
      (async () => {
        setIsProblemLoading(true);
        const problemResponse = await getProblem(problemname?.slice(0, 24) as string);
        setIsProblemLoading(false);
        if (problemResponse?.status === 'Success') {
          setProblemInfo(problemResponse.data);
          const storedCode = await getUserCode(problemname?.slice(0, 24) as string);
          if (Object.keys(storedCode).length) {
            if (!storedCode[language]) {
              setCode({
                ...storedCode,
                [language]: problemResponse.data?.starterCode.find((s) => s.lang_id == language)?.code ?? '',
              });
            } else {
              setCode(storedCode);
            }
          } else {
            setCode({ [language]: problemResponse.data?.starterCode.find((s) => s.lang_id == language)?.code ?? '' });
          }
        } else {
          throw new Error(problemResponse?.error);
        }
      })();
    } catch (error) {
      setIsProblemLoading(false);
      setIsErrorWithProblemInfo(true);
      if (error instanceof Error) {
        setErrorInfoProblemFetch(error);
      }
    }
  }, [problemname]);
  useEffect(() => {
    if (user?.submissions.length) {
      setProblemSubmissions(user?.submissions.filter((sub) => sub.problemId === problemname?.slice(0, 24)));
    }
  }, [user?.submissions.length, problemname]);
  useEffect(() => {
    monaco.loader.init().then((monacoinstance: Monaco) => {
      monacoinstance.editor.defineTheme('mylightTheme', lighttheme as theme);
      monacoinstance.editor.defineTheme('mydarkTheme', darktheme as theme);
    });
  }, [colorMode]);
  const { mutateAsync } = useMutation({
    mutationKey: ['codesubmission'],
    mutationFn: submitCode,
  });
  const { mutateAsync: updateSubmitMutateAsync } = useMutation({
    mutationKey: ['updatesubmission'],
    mutationFn: addSubmission,
  });

  const firstPanelTabLabels = useMemo(() => ['Description', 'Submissions'], []);
  const secondPanelTabLabels = useMemo(() => ['Code', 'Test Results', 'Output'], []);
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (id: number) => {
    setLanguage(id);
    setCode((prev) => {
      const copy = { ...prev };
      if (!copy[id]) {
        copy[id] = problemInfo?.starterCode.find((s) => s.lang_id == id)?.code ?? '';
      }
      return copy;
    });
  };
  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: number,
    type: 'firstpaneltabs' | 'secondpaneltabs' | 'codesubmissiontab'
  ) => {
    if (type === 'firstpaneltabs') {
      setLeftTab(newValue);
    } else if (type === 'secondpaneltabs') {
      setCurrentTab(newValue);
    } else {
      setSubmissionTab(newValue);
    }
  };
  if (isProblemLoading) {
    return (
      <>
        <Backdrop
          sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  if (isErrorWithProblemInfo) {
    return (
      <Layout>
        <Alert className='tw-mx-auto' severity='error'>
          {errorInfoProblemFetch?.message}
        </Alert>
      </Layout>
    );
  }

  const getSubmission = async (id: string) => {
    async function getData<T extends submission>(response: T) {
      if (!['Processing', 'In Queue'].includes(response?.status?.description)) {
        setSubmissionStatusInProcess(false);
        return response;
      }
      try {
        const submissionresponse = await getStatus(id);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve('resolved');
          }, 2000);
        });
        setSubmissionStatusInProcess(true);
        return getData(submissionresponse as submission);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          throw error;
        }
      }
    }
    try {
      setSubmissionStatusLoading(true);
      // @ts-ignore
      const data = await getData({ status: { description: 'Processing' } });
      setSubmissionStatusLoading(false);
      setproblemRunStatus([data as submission]);
      return data;
    } catch (error) {
      setSubmissionStatusLoading(false);
      setSubmissionStatusError(true);
      console.error(error);
    }
  };

  const onClickHandler = async () => {
    if (!isLogedIn) {
      navigate('/signin');
    }

    if (editorRef.current && problemInfo) {
      // @ts-ignore
      const code = `${problemInfo.imports.find((s) => s.lang_id == language)?.code} \n${editorRef.current.getValue()} \n${problemInfo?.systemCode.find((s) => s.lang_id == language)?.code}`;
      try {
        setIsSumbitted(true);
        setCurrentTab(1);
        const testcases = problemInfo?.testCases;
        const [firsttestcase] = testcases;
        const response = await mutateAsync({
          code,
          expected_output: firsttestcase.output,
          input: firsttestcase.input,
          language_id: language,
        });
        setSubmissionId(response?.data.token);
        await getSubmission(response?.data.token);
      } catch (error) {
        setIsSumbitted(false);
        console.log(error);
      }
    }
  };

  const onSubmitHandler = async () => {
    if (!isLogedIn) {
      navigate('/signin');
    }
    if (editorRef.current && problemInfo) {
      const submissionbatch = [];
      const testcases = problemInfo?.testCases;
      // @ts-ignore
      const code = `${problemInfo.imports.find((s) => s.lang_id == language)?.code} \n ${editorRef.current.getValue()} \n ${problemInfo?.systemCode.find((s) => s.lang_id == language)?.code}`;
      if (testcases?.length) {
        for (let index = 0; index < testcases?.length; index++) {
          if (testcases) {
            const { input, output } = testcases[index];
            submissionbatch.push({
              language_id: language,
              source_code: code,
              stdin: input,
              expected_output: output,
            });
          }
        }
      }
      try {
        setCurrentTab(2);
        setProblemSubmissionLoading(true);
        const batchwiseresponse = await batchwiseSubmission(submissionbatch);
        // @ts-ignore
        const batchwiseresponsepromises = [];
        batchwiseresponse?.forEach((submission) => {
          batchwiseresponsepromises.push(getSubmission(submission.token));
        });
        // @ts-ignore
        const batchwiseresults = await Promise.all(batchwiseresponsepromises);
        setProblemSubmissionLoading(false);
        const { status, successcount } = getResult(batchwiseresults);
        setSuccessCount(successcount);
        if (status) {
          setProblemSubmissionStatus('Accepted');
        } else {
          setProblemSubmissionStatus('Rejected');
        }
        const updatesubmissionbody = {
          problemId: problemname?.slice(0, 24) as string,
          languageId: language,
          status: status ? 'Accepted' : 'Wrong Answer',
          submissionId: submissionId,
          submittedAt: new Date(),
        };
        const submissionupdateResponse = await updateSubmitMutateAsync({
          id: user?._id as string,
          newsubmission: updatesubmissionbody,
        });
        setProblemSubmissions((prev) => [...prev, updatesubmissionbody]);
        setUser({
          ...(user as user),
          submissions: [
            ...(user?.submissions ?? []),
            {
              problemId: problemname?.slice(0, 24) as string,
              submissionId: submissionupdateResponse?.data._id as string,
              languageId: language,
              status: status ? 'Accepted' : 'Wrong Answer',
              submittedAt: new Date(),
            },
          ],
        });
      } catch (error) {
        setProblemSubmissionLoading(false);
        setProblemSubmissionStatus('Rejected');
        await updateSubmitMutateAsync({
          id: user?._id as string,
          newsubmission: {
            problemId: problemname?.slice(0, 24) as string,
            languageId: language,
            status: 'Wrong Answer',
            submissionId: submissionId,
            submittedAt: new Date(),
          },
        });
        setProblemSubmissions((prev) => [
          ...prev,
          {
            problemId: problemname?.slice(0, 24) as string,
            languageId: language,
            status: 'Wrong Answer',
            submissionId: submissionId,
            submittedAt: new Date(),
          },
        ]);
        console.log(error);
      }
    }
  };

  return (
    <Layout
      problemExecuteHandler={onClickHandler}
      executionLoading={submissionStatusLoading}
      submitionLoading={problemSubmissionLoading}
      problemSubmitHandler={onSubmitHandler}
      className='problem-layout'
      showFooter={false}
    >
      <div
        ref={containerRef}
        className={`tw-gap-0.5 tw-h-full problem-container ${isLeftPanelExpanded || isRightPanelExpanded ? 'expanded' : isLeftPanelOnlyShrinked ? 'leftshrinked' : isRightPanelOnlyShrinked ? 'rightshrinked' : ''}`}
        style={
          isResizeActive
            ? {
                gridTemplateColumns: `${getGridTemplateColumns(sizes.div1, sizes.div2)}`,
              }
            : undefined
        }
      >
        {isResizeActive && <div onMouseDown={startDragging} className='problem-resizer'></div>}
        {isLeftPanelOnlyShrinked ? (
          // !left Sidepanel
          <div
            className='tw-flex tw-flex-col tw-justify-between tw-w-full tw-h-full tw-p-2 tw-border-2 tw-rounded-lg'
            style={{
              backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
              borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
              display: isLeftPanelExpanded && shrinkState.shrinkrightpanel ? 'none' : 'flex',
              gridColumn: getGridColumnStyles(
                isLeftPanelExpanded,
                shrinkState.shrinkleftpanel,
                shrinkState.shrinkrightpanel
              ),
            }}
          >
            <CustomTabs
              tabs={firstPanelTabLabels}
              writingMode='vertical-lr'
              className={colorMode === 'dark' ? '!tw-text-white' : ''}
              value={leftTab}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'firstpaneltabs')}
              orientation='vertical'
            ></CustomTabs>
            <IconButton
              title='Unfold'
              onClick={() => {
                // @ts-ignore
                editorRef.current.layout(771, 436);
                expandRightPanel();
              }}
            >
              <ChevronRightOutlinedIcon fontSize='small' />
            </IconButton>
          </div>
        ) : null}
        {/* !first container*/}
        <div
          className={`tw-w-full tw-h-full tw-p-2 tw-border-2 tw-rounded-lg`}
          style={{
            backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
            borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
            display: isLeftPanelExpanded || shrinkState.shrinkrightpanel ? 'none' : 'block',
            gridColumn: getGridColumnStyles(
              isRightPanelExpanded,
              shrinkState.shrinkrightpanel,
              shrinkState.shrinkleftpanel
            ),
          }}
        >
          <div className='tw-flex tw-items-center tw-justify-between'>
            <CustomTabs
              tabs={firstPanelTabLabels}
              className={colorMode === 'dark' ? '!tw-text-white' : ''}
              value={leftTab}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'firstpaneltabs')}
            ></CustomTabs>
            <div>
              <IconButton
                onClick={() => {
                  toggleRightPanelExpansion();
                }}
                size='small'
              >
                {!isRightPanelExpanded ? (
                  <SettingsOverscanOutlinedIcon titleAccess='Maximise' fontSize='small' />
                ) : (
                  <CloseFullscreenOutlinedIcon titleAccess='Minimise' fontSize='small' />
                )}
              </IconButton>
              {!isRightPanelExpanded && (
                <IconButton onClick={shrinkRightHandler} size='small'>
                  {!shrinkState.shrinkrightpanel ? (
                    <ChevronLeftOutlinedIcon titleAccess='Fold' fontSize='small' />
                  ) : (
                    <ChevronRightOutlinedIcon titleAccess='UnFold' fontSize='small' />
                  )}
                </IconButton>
              )}
            </div>
          </div>
          <CustomTabPanel value={leftTab} index={0}>
            <ProblemDescription problem={problemInfo} serialNo={problemname?.slice(24)}></ProblemDescription>
          </CustomTabPanel>
          <CustomTabPanel value={leftTab} index={1}>
            {problemsubmissions.length ? <ProblemSubmissions data={problemsubmissions}></ProblemSubmissions> : null}
          </CustomTabPanel>
        </div>
        {isRightPanelOnlyShrinked ? (
          // !Right Sidepanel
          <div
            className={`tw-p-2 tw-border-2 tw-rounded-lg tw-h-full tw-flex tw-flex-col tw-justify-between`}
            style={{
              backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
              borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
              display: isRightPanelExpanded && shrinkState.shrinkleftpanel ? 'none' : 'flex',
              gridColumn: getGridColumnStyles(
                isRightPanelExpanded,
                shrinkState.shrinkrightpanel,
                shrinkState.shrinkleftpanel
              ),
            }}
          >
            <CustomTabs
              className={colorMode === 'dark' ? 'tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'secondpaneltabs')}
              value={currentTab}
              orientation='vertical'
              tabs={secondPanelTabLabels}
              writingMode='vertical-lr'
            />
            <IconButton onClick={expandLeftPanel}>
              <ChevronLeftOutlinedIcon titleAccess='Fold' fontSize='small' />
            </IconButton>
          </div>
        ) : null}

        {/* //!second section */}
        <div
          className={`tw-p-2 tw-border-2 tw-rounded-lg tw-h-full tw-order-3`}
          style={{
            backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
            borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
            gridColumn: getGridColumnStyles(
              isLeftPanelExpanded,
              shrinkState.shrinkleftpanel,
              shrinkState.shrinkrightpanel
            ),
            display: isRightPanelExpanded || shrinkState.shrinkleftpanel ? 'none' : 'block',
            width: isResizeActive ? `${sizes.div2}%` : '100%',
            height: isResizeActive ? `calc(100% - 70px)` : '100%',
            position: isResizeActive ? 'absolute' : 'static',
            right: isResizeActive ? 0 : 'initial',
          }}
        >
          <div className='tw-flex tw-items-center tw-justify-between'>
            <CustomTabs
              value={currentTab}
              tabs={secondPanelTabLabels}
              className={colorMode === 'dark' ? 'tw-text-white' : ''}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'secondpaneltabs')}
            ></CustomTabs>
            <div>
              <IconButton onClick={toggleLeftPanelExpansion} size='small'>
                {!isLeftPanelExpanded ? (
                  <SettingsOverscanOutlinedIcon titleAccess='Maximise' fontSize='small' />
                ) : (
                  <CloseFullscreenOutlinedIcon titleAccess='Minimise' fontSize='small' />
                )}
              </IconButton>
              {!isLeftPanelExpanded && (
                <IconButton onClick={shrinkLeftHandler} size='small'>
                  {!shrinkState.shrinkleftpanel ? (
                    <ChevronLeftOutlinedIcon titleAccess='Fold' fontSize='small' />
                  ) : (
                    <ChevronRightOutlinedIcon titleAccess='UnFold' fontSize='small' />
                  )}
                </IconButton>
              )}
            </div>
          </div>
          <CustomTabPanel innerDivClassName='tw-h-full' value={currentTab} index={0}>
            <div className='tw-h-[73dvh]'>
              <div className='tw-border-b-2 tw-p-2 tw-border-b-[#ffffff12] tw-flex tw-justify-between tw-items-center'>
                <LanguageDropDown
                  languagestoskip={problemInfo?.languagestoskip ?? ([] as number[])}
                  label='supported language'
                  language={language}
                  handleChange={handleChange}
                />
                <div>
                  <IconButton onClick={() => toggleFullScreen()} size='small'>
                    {isFullScreenEnabled ? (
                      <CloseFullscreenOutlinedIcon titleAccess='Exit FullScreen' fontSize='small' />
                    ) : (
                      <OpenInFullOutlinedIcon titleAccess='FullScreen' fontSize='small' />
                    )}
                  </IconButton>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setCode((prev) => ({
                        ...prev,
                        [language]: problemInfo?.starterCode.find((s) => s.lang_id == language)?.code ?? '',
                      }));
                    }}
                  >
                    <RestoreOutlinedIcon titleAccess='Restore' fontSize='small' />
                  </IconButton>
                </div>
              </div>
              <CodeEditor
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                onChange={async (changedcode) => {
                  if (changedcode) {
                    await saveUserCode(problemname?.slice(0, 24) as string, language, changedcode as string);
                    setCode((prev) => {
                      const copy = { ...prev };
                      if (copy[language]) {
                        copy[language] = changedcode;
                      }
                      return copy;
                    });
                  }
                }}
                code={code[language]}
                language={supportedLanguages[language].toLowerCase()}
                theme={colorMode === 'light' ? 'mylightTheme' : 'mydarkTheme'}
              ></CodeEditor>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={1}>
            {(submissionStatusLoading && isSumbitted) || submissionStatusInprocess ? (
              <Stack className='tw-h-[75dvh]' spacing={2}>
                <SkeletonResultsLoader />
              </Stack>
            ) : !submissionStatusLoading && submissionStatusError ? (
              <div className='tw-h-[75dvh]' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body2'>Some Error Occurred Please Try Again</Typography>
              </div>
            ) : !isSumbitted && !problemRunStatus.length ? (
              <div className='tw-h-[75dvh]' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body2'>You must run your code first</Typography>
              </div>
            ) : problemRunStatus.length ? (
              <Stack spacing={2} className='tw-h-[75dvh]'>
                <Tabs
                  className={colorMode === 'dark' ? 'tw-text-white' : ''}
                  value={submissionTab}
                  onChange={(event: React.SyntheticEvent, value: any) =>
                    handleTabChange(event, value, 'codesubmissiontab')
                  }
                >
                  {problemRunStatus.map((s, i) => (
                    <Tab
                      key={i}
                      className={colorMode === 'dark' ? 'tw-text-white min-w-12' : 'min-w-12'}
                      label={
                        <div className='tw-flex tw-gap-1 tw-items-center'>
                          <FiberManualRecordIcon
                            color={s.status.description === 'Accepted' ? 'success' : 'error'}
                            sx={{ fontSize: '0.7em' }}
                            fontSize='small'
                          />
                          <span>{`Case ${i + 1}`}</span>
                        </div>
                      }
                      {...a11yProps(i)}
                    ></Tab>
                  ))}
                </Tabs>
                {problemInfo?.metadata.variables_names != undefined
                  ? problemRunStatus.map((s, i) => {
                      const inputvalues = s.stdin.split('\n');
                      return (
                        <CustomTabPanel index={i} key={`language${s.language_id}`} value={submissionTab}>
                          <ProblemResults
                            inputValues={inputvalues}
                            variables={Object.values(problemInfo?.metadata.variables_names)}
                            standardOutput={s.stdout}
                            expectedOutput={s.expected_output}
                          />
                        </CustomTabPanel>
                      );
                    })
                  : null}
              </Stack>
            ) : (
              <div className='tw-h-[75dvh]'>
                <SkeletonResultsLoader />
              </div>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={2}>
            {problemSubmissionLoading ? (
              <Stack className='tw-h-[90dvh]' spacing={2}>
                <SkeletonResultsLoader />
              </Stack>
            ) : (
              <ProblemSubmissionStatus
                isFullmode={isLeftPanelExpanded || (shrinkState.shrinkrightpanel && !shrinkState.shrinkleftpanel)}
                totalTestCases={problemInfo?.testCases.length}
                successCount={problemsuccessCount}
                problemSubmissionStatus={problemSubmissionStatus}
              />
            )}
          </CustomTabPanel>
        </div>
      </div>
    </Layout>
  );
}
