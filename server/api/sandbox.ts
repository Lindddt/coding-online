import { NodeVM } from 'vm2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    code, input
  } = body;
  const gdata = {
    input,
    output: '',
  };
  const vm = new NodeVM({
    eval: false,
    wasm: false,
    timeout: 1000,
    sandbox: { gdata },
  });
  setTimeout(() => {
    console.log('timeout');
    throw Error('timeout');
  }, 3000);
  process.on('uncaughtException', (err) => {
    console.error('Asynchronous error caught.', err);
  });
  try {
    vm.run(`${code}`, 'vm.js');
  //   vm.run(`
  //   while(1)
  //   console.log('hello world');
  //   gdata["output"] = 'hello world';
  // `, 'vm.js');
    console.log(gdata.output);
    return {
      data: gdata.output,
    };
  } catch (error) {
    const err = error as any;
    // console.log(error.message, typeof error);
    return {
      error: {
        message: err.message,
        name: err.name,
        code: err.code,
        stack: err.stack,
      }
    };
  }


});
