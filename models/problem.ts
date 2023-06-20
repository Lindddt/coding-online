import questionsListRouter from '~/koa/routes/questions-list-router';
import { requestBackend, requestBackendT } from './request';

export interface question{
  QID: number,
  Title: string,
  Time: string,
  Difficulty: string,
}

export const getProblemList = async ({
  startNum,
  endNum
}: {
  startNum: number,
  endNum: number
}): Promise<{
  questionsList: question[],
  totalNum: number,
}> => {
  const res = await requestBackend({
    path: 'questions_list/get_questions_list',
    body: {
      startNum,
      endNum,
    }
  });
  return res;

};