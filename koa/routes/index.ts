
import homeRouter from './home';
// import users from './users';
import questionsListRouter from './questions-list-router';
// import questionRouter from './question-router';
// import roomRouter from './room';
// import messageboard from './messageboard';
import verificationcode from './verificationcode';
import Router from 'koa-router';
import testRouter from './test';
import questionRouter from './question-router';
const koaRouter = new Router();

koaRouter.use('/test', testRouter.routes(), testRouter.allowedMethods());

koaRouter.use('/account', homeRouter.routes(), homeRouter.allowedMethods());
koaRouter.use('/verificationcode', verificationcode.routes(), verificationcode.allowedMethods());
// koaRouter.use('/messageboard', messageboard);
// koaRouter.use('/users', users);

koaRouter.use('/questions_list', questionsListRouter.routes(), questionsListRouter.allowedMethods());
koaRouter.use('/question', questionRouter.routes(), questionRouter.allowedMethods());
// koaRouter.use('/room', roomRouter);

export default koaRouter;