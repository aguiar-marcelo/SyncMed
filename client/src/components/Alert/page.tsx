import { enqueueSnackbar, closeSnackbar } from "notistack";
import { Alert } from "@mui/material";

export const showAlert = (
  message: string,
  variant: "success" | "error" | "warning" | "info",
) => {
  enqueueSnackbar(message, {
    content: (key) => (
      <Alert onClose={() => closeSnackbar(key)} severity={variant} className="!font-inter !font-medium">
        {message}
      </Alert>
    ),
  });
};
