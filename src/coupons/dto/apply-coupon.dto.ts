import { IsNotEmpty } from 'class-validator';

export class ApplyCouponDto {
  @IsNotEmpty({ message: 'El nombre del cupon es obligatporio' })
  coupon_name: string;
}
