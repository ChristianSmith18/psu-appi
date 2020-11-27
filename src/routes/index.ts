import { AnswerModule } from './answer/answer.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';

const routes = [AuthModule, UserModule, QuestionModule, AnswerModule];

export default routes;
