import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBuffer(validationOptions?: ValidationOptions) {
  return function (obj: Object, propertyName: string) {
    registerDecorator({
      name: 'isBuffer',
      target: obj.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Buffer.isBuffer(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a Buffer`;
        },
      },
    });
  };
}
