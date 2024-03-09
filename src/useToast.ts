import { ref } from 'vue';

export default function useToast() {
  const toastMessage = ref('');
  const toastPosition = ref('bottom-right'); // Default position: bottom-right

  type ToastProps = {
    message: string;
    position: string;
    options?: {
      autohide: boolean;
      timeout: number
    }
  }
  const showToast = (message: ToastProps["message"], position: ToastProps["position"] = 'bottom-right', options: ToastProps["options"] = { autohide: true, timeout: 3000 }) => {
    toastMessage.value = message;

    const vPositionClasses: Record<string, string> = {
      'top-left': "top-0 start-0",
      'top-right':"top-0 end-0",
      'bottom-left':  "bottom-0 start-0",
      'bottom-right':  "bottom-0 end-0"
    }
    
    toastPosition.value = vPositionClasses[position];

    if (options.autohide) {
      setTimeout(() => {
        toastMessage.value = '';
      }, 3000); // Adjust the duration as needed
    }
  };

  return {
    toastMessage,
    toastPosition,
    showToast
  };
}
