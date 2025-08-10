import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleErrorMessage = (error: AxiosError | Error) => {
  if (error instanceof AxiosError) {
    toast.error(error?.response?.data?.message ?? "Something went wrong.");
    return;
  } else
    toast.error(error?.message ?? "Something went wrong. Please try again.");
};
