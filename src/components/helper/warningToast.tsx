import toast from "react-hot-toast";

export const warningToast = (message: string) => {
  toast(message, {
    icon: "⚠️",
    style: {
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #facc15",
    },
  });
};
