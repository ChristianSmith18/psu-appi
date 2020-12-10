import { AnswerModule } from './answer/answer.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { TestModule } from './test/test.module';
import { UserModule } from './user/user.module';

const routes = [
  AuthModule,
  UserModule,
  QuestionModule,
  AnswerModule,
  TestModule,
];

export default routes;
