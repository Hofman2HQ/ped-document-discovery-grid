
import { toast } from "react-toastify";

export { toast };

export const useToast = () => {
  // This is a compatibility layer to make the transition from shadcn to react-toastify easier
  return {
    toast: {
      // Map methods to react-toastify
      success: (content: string) => toast.success(content),
      error: (content: string) => toast.error(content),
      info: (content: string) => toast.info(content),
      warning: (content: string) => toast.warning(content),
    },
    // We need to overload the function to handle both object form and direct calls
    handleToast: (options: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      if (options.variant === "destructive") {
        return toast.error(options.description || options.title);
      }
      return toast.info(options.description || options.title);
    }
  };
};
