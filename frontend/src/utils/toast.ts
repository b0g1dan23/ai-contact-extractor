import { useToast } from "primevue/usetoast";

const toastLifetime = 3000;

/**
 * Toast composable that provides toast notification functions
 * Must be called within a Vue component's setup function
 */
export const useToastNotifications = () => {
    const toast = useToast();

    const showSuccessToast = (message: string, title = 'Success') => {
        toast.add({
            severity: 'success',
            summary: title,
            detail: message,
            life: toastLifetime,
        })
    }

    const showErrorToast = (message: string, title = 'Error') => {
        toast.add({
            severity: 'error',
            summary: title,
            detail: message,
            life: toastLifetime,
        })
    }

    const showInfoToast = (message: string, title = 'Info') => {
        toast.add({
            severity: 'info',
            summary: title,
            detail: message,
            life: toastLifetime,
        })
    }

    const showWarningToast = (message: string, title = 'Warning') => {
        toast.add({
            severity: 'warn',
            summary: title,
            detail: message,
            life: toastLifetime,
        })
    }

    return {
        showSuccessToast,
        showErrorToast,
        showInfoToast,
        showWarningToast
    }
}