
import { useToast as originalUseToast, toast } from "react-toastify";

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
    // For compatibility with any code that uses the object form
    toast: (options: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      if (options.variant === "destructive") {
        return toast.error(options.description || options.title);
      }
      return toast.info(options.description || options.title);
    }
  };
};
