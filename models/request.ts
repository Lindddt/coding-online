/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorObject } from '~/types/errcode';

export const requestBackend = async ({
  path,
  body,
}: {
  path: string;
  body: any;
}): Promise<any> => {
  const res = await $fetch('/api/koaAPI', {
    method: 'POST',
    body: {
      path,
      ...body,
    }
  });
  if (res.data.errcode === 0) {
    return res.data.result || {};
  } else if (ErrorObject[res.data.errcode]) {
    throw Error(res.data.errMsg || ErrorObject[res.data.errcode].errMsg);
  } else {
    throw Error('未知错误');
  }
};

export const requestBackendT = async ({
  path,
  body,
}: {
  path: string;
  body: any;
}): Promise<any> => {
  const res = await $fetch(`/backend${path}`, {
    method: 'POST',
    body: {
      ...body,
    }
  });
  console.log(res,'res');
};
