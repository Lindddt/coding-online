import questionsListRouter from '~/koa/routes/questions-list-router';
import { requestBackend, requestBackendT, requestVm } from './request';
import { Problem } from '~/types/problem';

export interface question {
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
export const getProblemFilterList = async ({
  startNum,
  endNum,
  difficulty,
  title,
}: {
  startNum: number,
  endNum: number
  difficulty?: string[],
  title?: string,
}): Promise<{
  questionsList: question[],
  totalNum: number,

}> => {
  const res = await requestBackend({
    path: 'questions_list/get_questions_filter_list',
    body: {
      startNum,
      endNum,
      filter:{
        difficulty,
        title,
      }
    }
  });
  return res;

};


export const getProblemDetail = async ({
  id,
}: {
  id: number,
}): Promise<Problem> => {
  const res = await requestBackend({
    path: 'question/get_question_detail',
    body: {
      id,
    }
  });
  return res;

};

export const runCode = async ({
  input,
  code,
}: {
  input: any;
  code: string;
}): Promise<Problem> => {
  const res = await requestVm({
    input,
    code,
  });
  return res;

};


export const newQuestion = async ({
  title,
  difficulty,
  content,
  remark,
  inputFormat,
  inputData,
  outputData
}: {
  title: string;
  difficulty: string;
  content: string;
  remark: string;
  inputFormat: string;
  inputData: string;
  outputData: string;
}): Promise<string> => {
  const res = await requestBackend({
    path: 'question/new_question',
    body: {
      title,
      difficulty,
      content,
      remark,
      inputFormat,
      inputExample: inputData,
      outputExample: outputData,
    }
  });
  return res.QID;

};