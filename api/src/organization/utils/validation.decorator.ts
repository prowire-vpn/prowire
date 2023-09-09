import {IsEmail as IsEmailValidator} from 'class-validator';

export const IsEmail = () => {
  // use decorator factory way
  return (target: object, key: string) => {
    // return a property decorator function
    IsEmailValidator()(target, key); // call IsDecimal decorator
  };
};
