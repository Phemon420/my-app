import * as yup from "yup";

const transactionSchema = yup.object().shape({
  // id: yup.string().required(),
  amount: yup.number().positive().required(),
  date: yup.date().required(),
  description: yup.string().required(),
});

export const validateTransaction = async (data) => {
  try {
    await transactionSchema.validate(data, { abortEarly: false });
    return { valid: true, errors: null };
  } catch (err) {
    return { valid: false, errors: err.errors };
  }
};
