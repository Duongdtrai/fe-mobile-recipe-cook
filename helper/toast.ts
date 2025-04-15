export const showSuccessToast = (toast: any, message: string) => {
    toast.show(message, {
        type: "success",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
        successColor:"green"
    })
}

export const showErrorToast = (toast: any, message: string) => {
    toast.show(message, {
        type: "danger",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
    });
}