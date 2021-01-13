import * as Yup from 'yup';
import validation from 'lang/en/validation.json';

const { REQUIRED_FIELD, INVALID_EMAIL, INVALID_PASSWORD, PASSWORD_ERROR, PASSWORD_MATCH } = validation;

const passwordRegex = /(?=.*[A-Za-z])(?=.*\d+)(?=.*[~`!@#$%^&*()_+\-={[}\]|\\:;"'<,>.?/])[A-Za-z\d~`!@#$%^&*()_+\-={[}\]|\\:;"'<,>.?/]{8,}$/;
const emailRegex = /^[a-zA-Z0-9.+-_]+@[a-zA-Z0-9.+-_]+(?:\.[a-zA-Z0-9-]+)*$/;

export const loginValidationSchema = Yup.object({
  email: Yup.string().matches(emailRegex, INVALID_EMAIL),
  password: Yup.string().matches(passwordRegex, INVALID_PASSWORD),
});

export const registerValidationSchema = Yup.object({
  email: Yup.string().matches(emailRegex, INVALID_EMAIL),
  password: Yup.string().matches(passwordRegex, PASSWORD_ERROR),
});

export const forgotPasswordValidation = Yup.object({
  email: Yup.string().matches(emailRegex, INVALID_EMAIL).required(REQUIRED_FIELD),
});

export const resetPasswordValidation = Yup.object({
  password: Yup.string().matches(passwordRegex, PASSWORD_ERROR).required(REQUIRED_FIELD),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], PASSWORD_MATCH)
    .required(REQUIRED_FIELD),
});
