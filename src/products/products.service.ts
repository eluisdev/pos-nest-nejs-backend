import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { TransactionContents } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });

    if (!category) {
      const errors: string[] = [];
      errors.push('La categoria no existe');
      throw new NotFoundException(errors);
    }

    return this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(categoryId: number, take: number, skip: number) {
    const options: FindManyOptions<Product> = {
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
      take,
      skip,
    };

    if (categoryId) {
      options.where = {
        category: {
          id: categoryId,
        },
      };
    }

    const [products, total] =
      await this.productRepository.findAndCount(options);
    return {
      products,
      total,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('El producto no existe');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        const errors: string[] = [];
        errors.push('La categoria no existe');
        throw new NotFoundException(errors);
      }
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    await this.productRepository.manager.transaction(
      async (productEntityManager) => {
        const product = await this.findOne(id);
        const transactionContents = await productEntityManager.find(
          TransactionContents,
          {
            where: {
              product: {
                id: product.id,
              },
            },
          },
        );
        for (const tc of transactionContents) {
          await productEntityManager.remove(tc);
        }
        await productEntityManager.remove(product);
      },
    );
    return { message: 'Producto eliminado' };
  }
}
