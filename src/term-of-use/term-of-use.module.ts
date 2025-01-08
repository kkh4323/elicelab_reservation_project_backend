import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermOfUse } from '@root/term-of-use/entities/term-of-use.entity';
import { UserModule } from '@user/user.module';
import { TermOfUseController } from '@term-of-use/term-of-use.controller';
import { TermOfUseService } from '@term-of-use/term-of-use.service';

@Module({
  imports: [TypeOrmModule.forFeature([TermOfUse]), UserModule],
  controllers: [TermOfUseController],
  providers: [TermOfUseService],
})
export class TermOfUseModule {}
