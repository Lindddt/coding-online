

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('event', body.path);
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
  const dataReturn = {
    data: res,
    toJSON() {
      return {
        data: {
          ...res,
        },
      };
    },
  };
  return dataReturn;
});