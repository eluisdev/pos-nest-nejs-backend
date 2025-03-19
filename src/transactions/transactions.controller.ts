import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
// import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express';
import { User, UserPeticion } from 'src/user/entities/user.entity';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @UserDecorator() user: UserPeticion,
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  findAll(@Query('transactionDate') transactionDate: string) {
    return this.transactionsService.findAll(transactionDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.transactionsService.remove(+id);
  }
}
