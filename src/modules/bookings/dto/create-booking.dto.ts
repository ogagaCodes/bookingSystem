import {
  IsString,
  Length,
  Matches,
  IsEnum,
  IsISO8601,
  Validate,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ServiceType } from '../enums/service-type.enum';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom validator to ensure a booking starts at least 10 minutes in the future.
 */
@ValidatorConstraint({ name: 'leadTime', async: false })
export class LeadTimeValidator implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
    return date >= tenMinutesFromNow;
  }
  defaultMessage() {
    return 'startsAt must be an ISO date at least 10 minutes in the future';
  }
}

export class CreateBookingDto {
  @IsString()
  @Length(2, 80)
  clientName!: string;

  @Matches(/^\+[1-9]\d{1,14}$/)
  clientPhone!: string;

  @IsEnum(ServiceType)
  service!: ServiceType;

  @IsISO8601()
  @Validate(LeadTimeValidator)
  startsAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;
}