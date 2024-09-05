import { useNavigate, useParams } from 'react-router';
import Editor from '@monaco-editor/react';
import * as monaco from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import getProblem from '../../../services/getProblem';
import { Alert, Backdrop, Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../UI/Layout';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import LanguageDropDown from './LanguageDropDown';
import { supportedLanguages } from '../../../constants/Index';
import { useAuthSlice } from '../../../store/authslice/auth';
export default function Problem() {
  const { problemname } = useParams();
  const [open, setOpen] = useState<boolean>(true);
  const [langauge, setLangauge] = useState<number>(93);
  const { colorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (id: number) => {
    setLangauge(id);
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['problem', problemname],
    queryFn: () => {
      return getProblem(problemname?.slice(0, problemname.length - 1) as string);
    },
  });
  useEffect(() => {
    monaco.loader.init().then((monaco) => {
      monaco.editor.defineTheme('mylightTheme', {
        inherit: false,
        base: 'vs-dark',
        colors: {
          focusBorder: '#2188ff',
          foreground: '#444d56',
          descriptionForeground: '#6a737d',
          errorForeground: '#cb2431',
          'textLink.foreground': '#0366d6',
          'textLink.activeForeground': '#005cc5',
          'textBlockQuote.background': '#fafbfc',
          'textBlockQuote.border': '#e1e4e8',
          'textCodeBlock.background': '#f6f8fa',
          'textPreformat.foreground': '#586069',
          'textSeparator.foreground': '#d1d5da',
          'button.background': '#159739',
          'button.foreground': '#ffffff',
          'button.hoverBackground': '#138934',
          'checkbox.background': '#fafbfc',
          'checkbox.border': '#d1d5da',
          'dropdown.background': '#fafbfc',
          'dropdown.border': '#e1e4e8',
          'dropdown.foreground': '#2f363d',
          'dropdown.listBackground': '#ffffff',
          'input.background': '#fafbfc',
          'input.border': '#e1e4e8',
          'input.foreground': '#2f363d',
          'input.placeholderForeground': '#959da5',
          'badge.foreground': '#005cc5',
          'badge.background': '#dbedff',
          'progressBar.background': '#2188ff',
          'titleBar.activeForeground': '#2f363d',
          'titleBar.activeBackground': '#ffffff',
          'titleBar.inactiveForeground': '#6a737d',
          'titleBar.inactiveBackground': '#f6f8fa',
          'titleBar.border': '#e1e4e8',
          'activityBar.foreground': '#2f363d',
          'activityBar.inactiveForeground': '#959da5',
          'activityBar.background': '#ffffff',
          'activityBarBadge.foreground': '#ffffff',
          'activityBarBadge.background': '#2188ff',
          'activityBar.activeBorder': '#f9826c',
          'activityBar.border': '#e1e4e8',
          'sideBar.foreground': '#586069',
          'sideBar.background': '#f6f8fa',
          'sideBar.border': '#e1e4e8',
          'sideBarTitle.foreground': '#2f363d',
          'sideBarSectionHeader.foreground': '#2f363d',
          'sideBarSectionHeader.background': '#f6f8fa',
          'sideBarSectionHeader.border': '#e1e4e8',
          'list.hoverForeground': '#2f363d',
          'list.inactiveSelectionForeground': '#2f363d',
          'list.activeSelectionForeground': '#2f363d',
          'list.hoverBackground': '#ebf0f4',
          'list.inactiveSelectionBackground': '#e8eaed',
          'list.activeSelectionBackground': '#e2e5e9',
          'list.inactiveFocusBackground': '#dbedff',
          'list.focusBackground': '#cce5ff',
          'tree.indentGuidesStroke': '#e1e4e8',
          'notificationCenterHeader.foreground': '#6a737d',
          'notificationCenterHeader.background': '#e1e4e8',
          'notifications.foreground': '#2f363d',
          'notifications.background': '#fafbfc',
          'notifications.border': '#e1e4e8',
          'notificationsErrorIcon.foreground': '#d73a49',
          'notificationsWarningIcon.foreground': '#e36209',
          'notificationsInfoIcon.foreground': '#005cc5',
          'pickerGroup.border': '#e1e4e8',
          'pickerGroup.foreground': '#2f363d',
          'quickInput.background': '#fafbfc',
          'quickInput.foreground': '#2f363d',
          'statusBar.foreground': '#586069',
          'statusBar.background': '#ffffff',
          'statusBar.border': '#e1e4e8',
          'statusBar.noFolderBackground': '#ffffff',
          'statusBar.debuggingBackground': '#f9826c',
          'statusBar.debuggingForeground': '#ffffff',
          'editorGroupHeader.tabsBackground': '#f6f8fa',
          'editorGroupHeader.tabsBorder': '#e1e4e8',
          'editorGroup.border': '#e1e4e8',
          'tab.activeForeground': '#2f363d',
          'tab.inactiveForeground': '#6a737d',
          'tab.inactiveBackground': '#f6f8fa',
          'tab.activeBackground': '#ffffff',
          'tab.hoverBackground': '#ffffff',
          'tab.unfocusedHoverBackground': '#ffffff',
          'tab.border': '#e1e4e8',
          'tab.unfocusedActiveBorderTop': '#e1e4e8',
          'tab.activeBorder': '#ffffff',
          'tab.unfocusedActiveBorder': '#ffffff',
          'tab.activeBorderTop': '#f9826c',
          'breadcrumb.foreground': '#6a737d',
          'breadcrumb.focusForeground': '#2f363d',
          'breadcrumb.activeSelectionForeground': '#586069',
          'breadcrumbPicker.background': '#fafbfc',
          'editor.foreground': '#24292e',
          'editor.background': '#ffffff',
          'editorWidget.background': '#f6f8fa',
          'editor.foldBackground': '#fafbfc',
          'editor.lineHighlightBackground': '#f6f8fa',
          'editorLineNumber.foreground': '#1b1f234d',
          'editorLineNumber.activeForeground': '#24292e',
          'editorIndentGuide.background': '#eff2f6',
          'editorIndentGuide.activeBackground': '#d7dbe0',
          'editorWhitespace.foreground': '#d1d5da',
          'editorCursor.foreground': '#044289',
          'editor.findMatchBackground': '#ffdf5d',
          'editor.findMatchHighlightBackground': '#ffdf5d66',
          'editor.inactiveSelectionBackground': '#0366d611',
          'editor.selectionBackground': '#0366d625',
          'editor.selectionHighlightBackground': '#34d05840',
          'editor.selectionHighlightBorder': '#34d05800',
          'editor.wordHighlightBackground': '#34d05800',
          'editor.wordHighlightStrongBackground': '#34d05800',
          'editor.wordHighlightBorder': '#24943e99',
          'editor.wordHighlightStrongBorder': '#24943e50',
          'editorBracketMatch.background': '#34d05840',
          'editorBracketMatch.border': '#34d05800',
          'editorGutter.modifiedBackground': '#2188ff',
          'editorGutter.addedBackground': '#28a745',
          'editorGutter.deletedBackground': '#d73a49',
          'diffEditor.insertedTextBackground': '#34d05822',
          'diffEditor.removedTextBackground': '#d73a4922',
          'scrollbar.shadow': '#6a737d33',
          'scrollbarSlider.background': '#959da533',
          'scrollbarSlider.hoverBackground': '#959da544',
          'scrollbarSlider.activeBackground': '#959da588',
          'editorOverviewRuler.border': '#ffffff',
          'panel.background': '#f6f8fa',
          'panel.border': '#e1e4e8',
          'panelTitle.activeBorder': '#f9826c',
          'panelTitle.activeForeground': '#2f363d',
          'panelTitle.inactiveForeground': '#6a737d',
          'panelInput.border': '#e1e4e8',
          'terminal.foreground': '#586069',
          'gitDecoration.addedResourceForeground': '#28a745',
          'gitDecoration.modifiedResourceForeground': '#005cc5',
          'gitDecoration.deletedResourceForeground': '#d73a49',
          'gitDecoration.untrackedResourceForeground': '#28a745',
          'gitDecoration.ignoredResourceForeground': '#959da5',
          'gitDecoration.conflictingResourceForeground': '#e36209',
          'gitDecoration.submoduleResourceForeground': '#959da5',
          'debugToolBar.background': '#ffffff',
          'editor.stackFrameHighlightBackground': '#ffffffbdd',
          'editor.focusedStackFrameHighlightBackground': '#ffffff5b1',
          'settings.headerForeground': '#2f363d',
          'settings.modifiedItemIndicator': '#2188ff',
          'welcomePage.buttonBackground': '#f6f8fa',
          'welcomePage.buttonHoverBackground': '#e1e4e8',
        },
        rules: [
          {
            foreground: '#6a737d',
            token: 'comment',
          },
          {
            foreground: '#6a737d',
            token: 'punctuation.definition.comment',
          },
          {
            foreground: '#6a737d',
            token: 'string.comment',
          },
          {
            foreground: '#005cc5',
            token: 'constant',
          },
          {
            foreground: '#005cc5',
            token: 'entity.name.constant',
          },
          {
            foreground: '#005cc5',
            token: 'variable.other.constant',
          },
          {
            foreground: '#005cc5',
            token: 'variable.language',
          },
          {
            foreground: '#6f42c1',
            token: 'entity',
          },
          {
            foreground: '#6f42c1',
            token: 'entity.name',
          },
          {
            foreground: '#24292e',
            token: 'variable.parameter.function',
          },
          {
            foreground: '#22863a',
            token: 'entity.name.tag',
          },
          {
            foreground: '#d73a49',
            token: 'keyword',
          },
          {
            foreground: '#d73a49',
            token: 'storage',
          },
          {
            foreground: '#d73a49',
            token: 'storage.type',
          },
          {
            foreground: '#24292e',
            token: 'storage.modifier.package',
          },
          {
            foreground: '#24292e',
            token: 'storage.modifier.import',
          },
          {
            foreground: '#24292e',
            token: 'storage.type.java',
          },
          {
            foreground: '#032f62',
            token: 'string',
          },
          {
            foreground: '#032f62',
            token: 'punctuation.definition.string',
          },
          {
            foreground: '#032f62',
            token: 'string punctuation.section.embedded source',
          },
          {
            foreground: '#005cc5',
            token: 'support',
          },
          {
            foreground: '#005cc5',
            token: 'meta.property-name',
          },
          {
            foreground: '#e36209',
            token: 'variable',
          },
          {
            foreground: '#24292e',
            token: 'variable.other',
          },
          {
            fontStyle: 'italic',
            foreground: '#b31d28',
            token: 'invalid.broken',
          },
          {
            fontStyle: 'italic',
            foreground: '#b31d28',
            token: 'invalid.deprecated',
          },
          {
            fontStyle: 'italic',
            foreground: '#b31d28',
            token: 'invalid.illegal',
          },
          {
            fontStyle: 'italic',
            foreground: '#b31d28',
            token: 'invalid.unimplemented',
          },
          {
            fontStyle: 'italic underline',
            background: '#d73a49',
            foreground: '#fafbfc',
            token: 'carriage-return',
          },
          {
            foreground: '#b31d28',
            token: 'message.error',
          },
          {
            foreground: '#24292e',
            token: 'string source',
          },
          {
            foreground: '#005cc5',
            token: 'string variable',
          },
          {
            foreground: '#032f62',
            token: 'source.regexp',
          },
          {
            foreground: '#032f62',
            token: 'string.regexp',
          },
          {
            foreground: '#032f62',
            token: 'string.regexp.character-class',
          },
          {
            foreground: '#032f62',
            token: 'string.regexp constant.character.escape',
          },
          {
            foreground: '#032f62',
            token: 'string.regexp source.ruby.embedded',
          },
          {
            foreground: '#032f62',
            token: 'string.regexp string.regexp.arbitrary-repitition',
          },
          {
            fontStyle: 'bold',
            foreground: '#22863a',
            token: 'string.regexp constant.character.escape',
          },
          {
            foreground: '#005cc5',
            token: 'support.constant',
          },
          {
            foreground: '#005cc5',
            token: 'support.variable',
          },
          {
            foreground: '#005cc5',
            token: 'meta.module-reference',
          },
          {
            foreground: '#e36209',
            token: 'punctuation.definition.list.begin.markdown',
          },
          {
            fontStyle: 'bold',
            foreground: '#005cc5',
            token: 'markup.heading',
          },
          {
            fontStyle: 'bold',
            foreground: '#005cc5',
            token: 'markup.heading entity.name',
          },
          {
            foreground: '#22863a',
            token: 'markup.quote',
          },
          {
            fontStyle: 'italic',
            foreground: '#24292e',
            token: 'markup.italic',
          },
          {
            fontStyle: 'bold',
            foreground: '#24292e',
            token: 'markup.bold',
          },
          {
            foreground: '#005cc5',
            token: 'markup.raw',
          },
          {
            background: '#ffeef0',
            foreground: '#b31d28',
            token: 'markup.deleted',
          },
          {
            background: '#ffeef0',
            foreground: '#b31d28',
            token: 'meta.diff.header.from-file',
          },
          {
            background: '#ffeef0',
            foreground: '#b31d28',
            token: 'punctuation.definition.deleted',
          },
          {
            background: '#f0fff4',
            foreground: '#22863a',
            token: 'markup.inserted',
          },
          {
            background: '#f0fff4',
            foreground: '#22863a',
            token: 'meta.diff.header.to-file',
          },
          {
            background: '#f0fff4',
            foreground: '#22863a',
            token: 'punctuation.definition.inserted',
          },
          {
            background: '#ffebda',
            foreground: '#e36209',
            token: 'markup.changed',
          },
          {
            background: '#ffebda',
            foreground: '#e36209',
            token: 'punctuation.definition.changed',
          },
          {
            foreground: '#f6f8fa',
            background: '#005cc5',
            token: 'markup.ignored',
          },
          {
            foreground: '#f6f8fa',
            background: '#005cc5',
            token: 'markup.untracked',
          },
          {
            foreground: '#6f42c1',
            fontStyle: 'bold',
            token: 'meta.diff.range',
          },
          {
            foreground: '#005cc5',
            token: 'meta.diff.header',
          },
          {
            fontStyle: 'bold',
            foreground: '#005cc5',
            token: 'meta.separator',
          },
          {
            foreground: '#005cc5',
            token: 'meta.output',
          },
          {
            foreground: '#586069',
            token: 'brackethighlighter.tag',
          },
          {
            foreground: '#586069',
            token: 'brackethighlighter.curly',
          },
          {
            foreground: '#586069',
            token: 'brackethighlighter.round',
          },
          {
            foreground: '#586069',
            token: 'brackethighlighter.square',
          },
          {
            foreground: '#586069',
            token: 'brackethighlighter.angle',
          },
          {
            foreground: '#586069',
            token: 'brackethighlighter.quote',
          },
          {
            foreground: '#b31d28',
            token: 'brackethighlighter.unmatched',
          },
          {
            foreground: '#032f62',
            fontStyle: 'underline',
            token: 'constant.other.reference.link',
          },
          {
            foreground: '#032f62',
            fontStyle: 'underline',
            token: 'string.other.link',
          },
        ],
        encodedTokensColors: [],
      });
      monaco.editor.defineTheme('mydarkTheme', {
        inherit: true,
        base: 'vs-dark',
        colors: {
          focusBorder: '#005cc5',
          foreground: '#d1d5da',
          descriptionForeground: '#959da5',
          errorForeground: '#f97583',
          'textLink.foreground': '#79b8ff',
          'textLink.activeForeground': '#c8e1ff',
          'textBlockQuote.background': '#24292e',
          'textBlockQuote.border': '#444d56',
          'textCodeBlock.background': '#2f363d',
          'textPreformat.foreground': '#d1d5da',
          'textSeparator.foreground': '#586069',
          'button.background': '#176f2c',
          'button.foreground': '#dcffe4',
          'button.hoverBackground': '#22863a',
          'checkbox.background': '#444d56',
          'checkbox.border': '#1b1f23',
          'dropdown.background': '#2f363d',
          'dropdown.border': '#1b1f23',
          'dropdown.foreground': '#e1e4e8',
          'dropdown.listBackground': '#24292e',
          'input.background': '#2f363d',
          'input.border': '#1b1f23',
          'input.foreground': '#e1e4e8',
          'input.placeholderForeground': '#959da5',
          'badge.foreground': '#c8e1ff',
          'badge.background': '#044289',
          'progressBar.background': '#0366d6',
          'titleBar.activeForeground': '#e1e4e8',
          'titleBar.activeBackground': '#24292e',
          'titleBar.inactiveForeground': '#959da5',
          'titleBar.inactiveBackground': '#1f2428',
          'titleBar.border': '#1b1f23',
          'activityBar.foreground': '#e1e4e8',
          'activityBar.inactiveForeground': '#6a737d',
          'activityBar.background': '#24292e',
          'activityBarBadge.foreground': '#ffffff',
          'activityBarBadge.background': '#0366d6',
          'activityBar.activeBorder': '#f9826c',
          'activityBar.border': '#1b1f23',
          'sideBar.foreground': '#d1d5da',
          'sideBar.background': '#1f2428',
          'sideBar.border': '#1b1f23',
          'sideBarTitle.foreground': '#e1e4e8',
          'sideBarSectionHeader.foreground': '#e1e4e8',
          'sideBarSectionHeader.background': '#1f2428',
          'sideBarSectionHeader.border': '#1b1f23',
          'list.hoverForeground': '#e1e4e8',
          'list.inactiveSelectionForeground': '#e1e4e8',
          'list.activeSelectionForeground': '#e1e4e8',
          'list.hoverBackground': '#282e34',
          'list.inactiveSelectionBackground': '#282e34',
          'list.activeSelectionBackground': '#39414a',
          'list.inactiveFocusBackground': '#1d2d3e',
          'list.focusBackground': '#044289',
          'tree.indentGuidesStroke': '#2f363d',
          'notificationCenterHeader.foreground': '#959da5',
          'notificationCenterHeader.background': '#24292e',
          'notifications.foreground': '#e1e4e8',
          'notifications.background': '#2f363d',
          'notifications.border': '#1b1f23',
          'notificationsErrorIcon.foreground': '#ea4a5a',
          'notificationsWarningIcon.foreground': '#ffab70',
          'notificationsInfoIcon.foreground': '#79b8ff',
          'pickerGroup.border': '#444d56',
          'pickerGroup.foreground': '#e1e4e8',
          'quickInput.background': '#24292e',
          'quickInput.foreground': '#e1e4e8',
          'statusBar.foreground': '#d1d5da',
          'statusBar.background': '#24292e',
          'statusBar.border': '#1b1f23',
          'statusBar.noFolderBackground': '#24292e',
          'statusBar.debuggingBackground': '#931c06',
          'statusBar.debuggingForeground': '#ffffff',
          'editorGroupHeader.tabsBackground': '#1f2428',
          'editorGroupHeader.tabsBorder': '#1b1f23',
          'editorGroup.border': '#1b1f23',
          'tab.activeForeground': '#e1e4e8',
          'tab.inactiveForeground': '#959da5',
          'tab.inactiveBackground': '#1f2428',
          'tab.activeBackground': '#24292e',
          'tab.hoverBackground': '#24292e',
          'tab.unfocusedHoverBackground': '#24292e',
          'tab.border': '#1b1f23',
          'tab.unfocusedActiveBorderTop': '#1b1f23',
          'tab.activeBorder': '#24292e',
          'tab.unfocusedActiveBorder': '#24292e',
          'tab.activeBorderTop': '#f9826c',
          'breadcrumb.foreground': '#959da5',
          'breadcrumb.focusForeground': '#e1e4e8',
          'breadcrumb.activeSelectionForeground': '#d1d5da',
          'breadcrumbPicker.background': '#2b3036',
          'editor.foreground': '#e1e4e8',
          'editor.background': '#24292e',
          'editorWidget.background': '#1f2428',
          'editor.foldBackground': '#282e33',
          'editor.lineHighlightBackground': '#2b3036',
          'editorLineNumber.foreground': '#444d56',
          'editorLineNumber.activeForeground': '#e1e4e8',
          'editorIndentGuide.background': '#2f363d',
          'editorIndentGuide.activeBackground': '#444d56',
          'editorWhitespace.foreground': '#444d56',
          'editorCursor.foreground': '#c8e1ff',
          'editor.findMatchBackground': '#ffd33d44',
          'editor.findMatchHighlightBackground': '#ffd33d22',
          'editor.inactiveSelectionBackground': '#3392FF22',
          'editor.selectionBackground': '#3392FF44',
          'editor.selectionHighlightBackground': '#17E5E633',
          'editor.selectionHighlightBorder': '#17E5E600',
          'editor.wordHighlightBackground': '#17E5E600',
          'editor.wordHighlightStrongBackground': '#17E5E600',
          'editor.wordHighlightBorder': '#17E5E699',
          'editor.wordHighlightStrongBorder': '#17E5E666',
          'editorBracketMatch.background': '#17E5E650',
          'editorBracketMatch.border': '#17E5E600',
          'editorGutter.modifiedBackground': '#2188ff',
          'editorGutter.addedBackground': '#28a745',
          'editorGutter.deletedBackground': '#ea4a5a',
          'diffEditor.insertedTextBackground': '#28a74530',
          'diffEditor.removedTextBackground': '#d73a4930',
          'scrollbar.shadow': '#0008',
          'scrollbarSlider.background': '#6a737d33',
          'scrollbarSlider.hoverBackground': '#6a737d44',
          'scrollbarSlider.activeBackground': '#6a737d88',
          'editorOverviewRuler.border': '#1b1f23',
          'panel.background': '#1f2428',
          'panel.border': '#1b1f23',
          'panelTitle.activeBorder': '#f9826c',
          'panelTitle.activeForeground': '#e1e4e8',
          'panelTitle.inactiveForeground': '#959da5',
          'panelInput.border': '#2f363d',
          'terminal.foreground': '#d1d5da',
          'gitDecoration.addedResourceForeground': '#34d058',
          'gitDecoration.modifiedResourceForeground': '#79b8ff',
          'gitDecoration.deletedResourceForeground': '#ea4a5a',
          'gitDecoration.untrackedResourceForeground': '#34d058',
          'gitDecoration.ignoredResourceForeground': '#6a737d',
          'gitDecoration.conflictingResourceForeground': '#ffab70',
          'gitDecoration.submoduleResourceForeground': '#6a737d',
          'debugToolBar.background': '#2b3036',
          'editor.stackFrameHighlightBackground': '#a707',
          'editor.focusedStackFrameHighlightBackground': '#b808',
          'peekViewEditor.matchHighlightBackground': '#ffd33d33',
          'peekViewResult.matchHighlightBackground': '#ffd33d33',
          'peekViewEditor.background': '#1f242888',
          'peekViewResult.background': '#1f2428',
          'settings.headerForeground': '#e1e4e8',
          'settings.modifiedItemIndicator': '#0366d6',
          'welcomePage.buttonBackground': '#2f363d',
          'welcomePage.buttonHoverBackground': '#444d56',
        },
        rules: [
          {
            foreground: '#6a737d',
            token: 'comment',
          },
          {
            foreground: '#6a737d',
            token: 'punctuation.definition.comment',
          },
          {
            foreground: '#6a737d',
            token: 'string.comment',
          },
          {
            foreground: '#79b8ff',
            token: 'constant',
          },
          {
            foreground: '#79b8ff',
            token: 'entity.name.constant',
          },
          {
            foreground: '#79b8ff',
            token: 'variable.other.constant',
          },
          {
            foreground: '#79b8ff',
            token: 'variable.language',
          },
          {
            foreground: '#b392f0',
            token: 'entity',
          },
          {
            foreground: '#b392f0',
            token: 'entity.name',
          },
          {
            foreground: '#e1e4e8',
            token: 'variable.parameter.function',
          },
          {
            foreground: '#85e89d',
            token: 'entity.name.tag',
          },
          {
            foreground: '#f97583',
            token: 'keyword',
          },
          {
            foreground: '#f97583',
            token: 'storage',
          },
          {
            foreground: '#f97583',
            token: 'storage.type',
          },
          {
            foreground: '#e1e4e8',
            token: 'storage.modifier.package',
          },
          {
            foreground: '#e1e4e8',
            token: 'storage.modifier.import',
          },
          {
            foreground: '#e1e4e8',
            token: 'storage.type.java',
          },
          {
            foreground: '#9ecbff',
            token: 'string',
          },
          {
            foreground: '#9ecbff',
            token: 'punctuation.definition.string',
          },
          {
            foreground: '#9ecbff',
            token: 'string punctuation.section.embedded source',
          },
          {
            foreground: '#79b8ff',
            token: 'support',
          },
          {
            foreground: '#79b8ff',
            token: 'meta.property-name',
          },
          {
            foreground: '#ffab70',
            token: 'variable',
          },
          {
            foreground: '#e1e4e8',
            token: 'variable.other',
          },
          {
            fontStyle: 'italic',
            foreground: '#fdaeb7',
            token: 'invalid.broken',
          },
          {
            fontStyle: 'italic',
            foreground: '#fdaeb7',
            token: 'invalid.deprecated',
          },
          {
            fontStyle: 'italic',
            foreground: '#fdaeb7',
            token: 'invalid.illegal',
          },
          {
            fontStyle: 'italic',
            foreground: '#fdaeb7',
            token: 'invalid.unimplemented',
          },
          {
            fontStyle: 'italic underline',
            background: '#f97583',
            foreground: '#24292e',
            token: 'carriage-return',
          },
          {
            foreground: '#fdaeb7',
            token: 'message.error',
          },
          {
            foreground: '#e1e4e8',
            token: 'string source',
          },
          {
            foreground: '#79b8ff',
            token: 'string variable',
          },
          {
            foreground: '#dbedff',
            token: 'source.regexp',
          },
          {
            foreground: '#dbedff',
            token: 'string.regexp',
          },
          {
            foreground: '#dbedff',
            token: 'string.regexp.character-class',
          },
          {
            foreground: '#dbedff',
            token: 'string.regexp constant.character.escape',
          },
          {
            foreground: '#dbedff',
            token: 'string.regexp source.ruby.embedded',
          },
          {
            foreground: '#dbedff',
            token: 'string.regexp string.regexp.arbitrary-repitition',
          },
          {
            fontStyle: 'bold',
            foreground: '#85e89d',
            token: 'string.regexp constant.character.escape',
          },
          {
            foreground: '#79b8ff',
            token: 'support.constant',
          },
          {
            foreground: '#79b8ff',
            token: 'support.variable',
          },
          {
            foreground: '#79b8ff',
            token: 'meta.module-reference',
          },
          {
            foreground: '#ffab70',
            token: 'punctuation.definition.list.begin.markdown',
          },
          {
            fontStyle: 'bold',
            foreground: '#79b8ff',
            token: 'markup.heading',
          },
          {
            fontStyle: 'bold',
            foreground: '#79b8ff',
            token: 'markup.heading entity.name',
          },
          {
            foreground: '#85e89d',
            token: 'markup.quote',
          },
          {
            fontStyle: 'italic',
            foreground: '#e1e4e8',
            token: 'markup.italic',
          },
          {
            fontStyle: 'bold',
            foreground: '#e1e4e8',
            token: 'markup.bold',
          },
          {
            foreground: '#79b8ff',
            token: 'markup.raw',
          },
          {
            background: '#86181d',
            foreground: '#fdaeb7',
            token: 'markup.deleted',
          },
          {
            background: '#86181d',
            foreground: '#fdaeb7',
            token: 'meta.diff.header.from-file',
          },
          {
            background: '#86181d',
            foreground: '#fdaeb7',
            token: 'punctuation.definition.deleted',
          },
          {
            background: '#144620',
            foreground: '#85e89d',
            token: 'markup.inserted',
          },
          {
            background: '#144620',
            foreground: '#85e89d',
            token: 'meta.diff.header.to-file',
          },
          {
            background: '#144620',
            foreground: '#85e89d',
            token: 'punctuation.definition.inserted',
          },
          {
            background: '#c24e00',
            foreground: '#ffab70',
            token: 'markup.changed',
          },
          {
            background: '#c24e00',
            foreground: '#ffab70',
            token: 'punctuation.definition.changed',
          },
          {
            foreground: '#2f363d',
            background: '#79b8ff',
            token: 'markup.ignored',
          },
          {
            foreground: '#2f363d',
            background: '#79b8ff',
            token: 'markup.untracked',
          },
          {
            foreground: '#b392f0',
            fontStyle: 'bold',
            token: 'meta.diff.range',
          },
          {
            foreground: '#79b8ff',
            token: 'meta.diff.header',
          },
          {
            fontStyle: 'bold',
            foreground: '#79b8ff',
            token: 'meta.separator',
          },
          {
            foreground: '#79b8ff',
            token: 'meta.output',
          },
          {
            foreground: '#d1d5da',
            token: 'brackethighlighter.tag',
          },
          {
            foreground: '#d1d5da',
            token: 'brackethighlighter.curly',
          },
          {
            foreground: '#d1d5da',
            token: 'brackethighlighter.round',
          },
          {
            foreground: '#d1d5da',
            token: 'brackethighlighter.square',
          },
          {
            foreground: '#d1d5da',
            token: 'brackethighlighter.angle',
          },
          {
            foreground: '#d1d5da',
            token: 'brackethighlighter.quote',
          },
          {
            foreground: '#fdaeb7',
            token: 'brackethighlighter.unmatched',
          },
          {
            foreground: '#dbedff',
            fontStyle: 'underline',
            token: 'constant.other.reference.link',
          },
          {
            foreground: '#dbedff',
            fontStyle: 'underline',
            token: 'string.other.link',
          },
        ],
        encodedTokensColors: [],
      });
    });
  }, [colorMode]);
  if (isLoading) {
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
  if (isError) {
    return (
      <Layout>
        <Alert className='tw-mx-auto' severity='error'>
          {error.message}
        </Alert>
      </Layout>
    );
  }

  const onClickHandler = () => {
    if (!isLogedIn) {
      navigate('/signin');
    }
  };

  const onSubmitHandler = () => {
    if (!isLogedIn) {
      navigate('/signin');
    }
  };

  return (
    <Layout showFooter={false}>
      <div className='tw-flex tw-gap-2 '>
        <div
          className={`tw-flex-1 tw-w-45 tw-p-2 tw-border-2 tw-border-[${colorMode === 'light' ? '#BEE3F8' : '#319795'}] tw-rounded-lg !tw-bg-${colorMode === 'light' ? 'white' : 'black'}`}
          style={{ backgroundColor: colorMode === 'light' ? 'white' : '#24292e' }}
        >
          <Stack spacing={8} className='tw-p-2'>
            <Box>
              <Typography variant='h5'>
                {problemname?.slice(problemname.length - 1)}. {data?.data.title}
              </Typography>
              <div className='tw-mt-2'>
                <Chip
                  label={data?.data.difficulty}
                  color={
                    data?.data.difficulty === 'easy' ? 'info' : data?.data.difficulty === 'hard' ? 'error' : 'warning'
                  }
                />
              </div>
              <div className='tw-mt-2'>
                <Typography variant='subtitle1'>{data?.data.description}</Typography>
              </div>
            </Box>
            <Box>
              <Typography variant='h5'>Examples</Typography>
              <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
                <Typography variant='h6'>Input :</Typography>
                <Typography variant='body2'>{data?.data.sampleInput}</Typography>
              </div>
              <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
                <Typography variant='h6'>Output:</Typography>
                <Typography variant='body2'>{data?.data.sampleOutput}</Typography>
              </div>
            </Box>
          </Stack>
        </div>
        <div
          className={`tw-flex-1 tw-w-45 tw-p-2 tw-border-2 tw-border-[${colorMode === 'light' ? '#CBD5E0' : '#4A5568'}] tw-rounded-lg`}
          style={{ backgroundColor: colorMode === 'light' ? 'white' : '#24292e' }}
        >
          <div className='tw-border-b-[1px] tw-p-2'>
            <LanguageDropDown language={langauge} handleChange={handleChange} />
          </div>
          <Editor
            theme={colorMode === 'light' ? 'mylightTheme' : 'mydarkTheme'}
            height='75dvh'
            language={supportedLanguages[langauge].toLowerCase()}
            value={data?.data.starterCode.find((s) => s.lang_id == langauge)?.code}
            className='tw-max-h-[75dvh] tw-overflow-x-auto'
          />
          <div className='tw-flex tw-justify-between tw-items-center'>
            <div>Saved</div>
            <div className='tw-flex tw-gap-2'>
              <Button
                variant='outlined'
                color='primary'
                className={`${colorMode === 'light' ? 'tw-bg-[#ECECEC]' : 'tw-bg-[#24292e] tw-text-white'}`}
                onClick={onClickHandler}
              >
                Run
              </Button>
              <Button variant='contained' color='success' onClick={onSubmitHandler}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
