import { toast } from "react-toastify";

export const handleErrors = (errors) => {
  if (!errors) return;

  Object.keys(errors).forEach((field) => {
    errors[field].forEach((message) => {
      toast.error(message);
    });
  });
};
