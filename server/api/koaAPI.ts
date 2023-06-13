

export default defineEventHandler(async (event): Promise<{
  asd: string;
  res: any;
  data: {
    errcode: number;
    [key: string]: any;
  }
}> => {
  const body = await readBody(event);
  console.log('21das', body, event.context.params);

  const res = await $fetch(`/backend/${body.path || ''}`, {
    method: 'POST',
    body: {
      ...body,
    }
  }) as {
    errcode: number;
    [key: string]: any;
  };
  console.log('res', res);
  return {
    asd: 'asd',
    res: res,
    data: res,
  };
});