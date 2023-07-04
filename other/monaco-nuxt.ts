import { defineNuxtPlugin } from '#app';

import { useState } from '#app';
import type * as Monaco from 'monaco-editor';

export const _useMonacoState = () => useState<typeof Monaco | null>('MonacoEditorNamespace', () => null);
/**
 * Get `monaco` namespace
 * @returns `monaco` namespace: if unavailable (server-side), returns `null`
 */
export const useMonaco = (): typeof Monaco | null => _useMonacoState().value;

export default defineNuxtPlugin(async (nuxtApp) => {
  const getWorkerModule = (moduleUrl: string, label: string) => {
    return new Worker(new URL(`${nuxtApp.$config.app.baseURL}/_nuxt/nuxt-monaco-editor/vs/${moduleUrl}.js`.replace(/\/\//g, '/'), import.meta.url), {
      name: label,
      type: 'module'
    });
  };
  self.MonacoEnvironment = {
    getWorker(workerId: string, label: string) {
      switch (label) {
        case 'json':
          return getWorkerModule('language/json/json.worker', label);
        case 'css':
        case 'scss':
        case 'less':
          return getWorkerModule('language/css/css.worker', label);
        case 'html':
        case 'handlebars':
        case 'razor':
          return getWorkerModule('language/html/html.worker', label);
        case 'typescript':
        case 'javascript':
          return getWorkerModule('language/typescript/ts.worker', label);
        default:
          return getWorkerModule('editor/editor.worker', label);
      }
    }
  };

  const monacoState = _useMonacoState();
  monacoState.value = await import('monaco-editor');
});