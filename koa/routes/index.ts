
import homeRouter from './home';
// import users from './users';
// import questionsListRouter from './questions-list-router';
// import questionRouter from './question-router';
// import roomRouter from './room';
// import messageboard from './messageboard';
import verificationcode from './verificationcode';
import * as Router from 'koa-router';
import testRouter from './test';
const koaRouter = new Router();

koaRouter.use('/test', testRouter.routes(), testRouter.allowedMethods());

koaRouter.use('/', homeRouter.routes(), homeRouter.allowedMethods());
koaRouter.use('/verificationcode', verificationcode.routes(), verificationcode.allowedMethods());
// koaRouter.use('/messageboard', messageboard);
// koaRouter.use('/users', users);

// koaRouter.use('/questions_list', questionsListRouter);
// koaRouter.use('/question', questionRouter);
// koaRouter.use('/room', roomRouter);

export default koaRouter;