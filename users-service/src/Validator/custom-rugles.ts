import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

const prisma: any = new PrismaClient();

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [entity, field] = args.constraints;
    const result = await prisma[entity].findFirst({
      where: {
        [field]: value,
      },
    });
    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    const [entity, field] = args.constraints;
    return `${field} est déjà utilisé par un autre ${entity}.`;
  }
}

export function IsUnique(
  entity: string,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsAvailableConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [entity, field] = args.constraints;
    let isArray = Array.isArray(value);
    if (isArray) {
      const distinctIds = [...new Set(value)];
      const dataToCheck = await prisma[entity].findMany({
        where: {
          AND: [
            {
              [field]: {
                in: distinctIds,
              },
            },
          ],
        },
        select: {
          [field]: true,
        },
      });
      const existingFields = dataToCheck.map((data: any) => data.id);
      return existingFields.length === distinctIds.length;
    } else {
      const result = await prisma[entity].findFirst({
        where: {
          [field]: value,
        },
      });
      return result;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [entity, field] = args.constraints;
    return `${field} est déjà utilisé par un autre ${entity}.`;
  }
}

export function IsAvailable(
  entity: string,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsAvailableConstraint,
    });
  };
}
