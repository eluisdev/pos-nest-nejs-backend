import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
// import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepositoy: Repository<User>,
    private readonly couponRepository: CouponsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        //TODO: Revisar codigo
        const transaction = new Transaction();
        const user = await this.userRepositoy.findOne({
          where: { id: +createTransactionDto.userId },
        });
        transaction.user = user;
        const total = createTransactionDto.contents.reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        );
        transaction.total = total;
        if (createTransactionDto.coupon) {
          const coupon = await this.couponRepository.applyCoupon(
            createTransactionDto.coupon,
          );
          const discount = (coupon.percentage / 100) * total;
          transaction.discount = discount;
          transaction.total -= discount;
        }

        for (const contents of createTransactionDto.contents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: contents.productId,
          });

          const errors = [];
          if (!product) {
            errors.push(
              `El producto con el Id: ${contents.productId} no existe`,
            );
            throw new NotFoundException(errors);
          }
          if (contents.quantity > product.inventory) {
            errors.push(
              `El articulo ${product.name} excede la cantidad disponible`,
            );
            throw new BadRequestException(errors);
          }
          product.inventory -= contents.quantity;

          //Create transactionContents instance
          const transactionContents = new TransactionContents();
          transactionContents.price = contents.price;
          transactionContents.product = product;
          transactionContents.quantity = contents.quantity;
          transactionContents.transaction = transaction;
          await transactionEntityManager.save(transaction);
          await transactionEntityManager.save(transactionContents);
        }
      },
    );
    return { message: 'Venta almacenada correctamente' };
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true,
      },
    };

    if (transactionDate) {
      const date = parseISO(transactionDate);
      if (!isValid(date)) {
        throw new BadRequestException('Fecha no valida');
      }

      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        transactionDate: Between(start, end),
      };
    }
    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        contents: true,
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Venta no encontrada');
    }

    return transaction;
  }

  // update(id: number, updateTransactionDto: UpdateTransactionDto) {
  //   return `This action updates a #${id} transaction`;
  // }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    for (const contents of transaction.contents) {
      const product = await this.productRepository.findOneBy({
        id: contents.product.id,
      });
      product.inventory += contents.quantity;
      await this.productRepository.save(product);
      const transactionContents =
        await this.transactionContentsRepository.findOneBy({
          id: contents.id,
        });
      await this.transactionContentsRepository.remove(transactionContents);
    }
    await this.transactionRepository.remove(transaction);
    return `Venta eliminada`;
  }
}
