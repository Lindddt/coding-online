import { requestBackend } from './request';
import { Identity } from '~/types';

export const getVerificationCode = async ({ email, }: {
  email: string;
}) => {
  return await $fetch('/api/koaAPI', {
    method: 'POST',
    body: {
      path: '/verificationcode',
      email,
    }
  });
};

export const register = async ({ email, password, verificationCode, identity, username }: {
  email: string;
  password: string;
  verificationCode: string;
  identity: string;
  username: string;
}): Promise<{
  identity: Identity;
  nickname: string;
  errcode: number;
  email: string;
}> => {
  const res = await requestBackend({
    path: '/account/register',
    body: {
      email,
      password,
      verificationcode: verificationCode,
      identity,
      username,
    }
  });
  return res;

};


export const login = async ({ email, password }: {
  email: string;
  password: string;
}): Promise<{
  identity: Identity;
  nickname: string;
  errcode: number;
}> => {
  const res = await requestBackend({
    path: 'account/login',
    body: {
      email,
      password,
    }
  });
  return res;

};

export const logout = async () => {
  const res = await requestBackend({
    path: 'account/logout',
    body: {
    },
  });
  return res;

};

export const checkLogin = async (): Promise<{
  login: false;
} | {
  login: true;
  username: string;
  identity: Identity
}> => {
  const res = await requestBackend({
    path: 'account/login_check',
    body: {
    },
  });
  return res;

};

export const checkAccount = async ({
  email
}: {
  email: string;
}): Promise<boolean> => {
  const res = await requestBackend({
    path: 'account/check',
    body: {
      email,
    },
  });
  return res;

};