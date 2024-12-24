import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La categoria debe ser un numero' })
  category_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La cantidad debe ser un numero' })
  take?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La cantidad debe ser un numero' })
  skip?: number;
}
