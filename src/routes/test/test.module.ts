import { Module } from '@nestjs/common';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [UserModule, QuestionModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
