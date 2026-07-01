import Swal from 'sweetalert2'

interface ConfirmOptions {
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
  /** Use a red confirm button for destructive actions (delete). */
  danger?: boolean
}

/** Show a SweetAlert2 confirmation dialog. Resolves true when confirmed. */
export async function confirmDialog({
  title,
  text,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
}: ConfirmOptions): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: danger ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? '#dc2626' : '#7c2431',
    cancelButtonColor: '#9ca3af',
    reverseButtons: true,
    focusCancel: danger,
  })
  return result.isConfirmed
}
