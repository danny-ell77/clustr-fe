import { ref } from 'vue'

const isVisible = ref(false)
const modalData = ref({
  title: '',
  message: '',
  okText: 'OK'
})

export const useSuccessModal = () => {
  const showSuccess = (options = {}) => {
    modalData.value = {
      title: options.title || 'Success!',
      message: options.message || '',
      okText: options.okText || 'OK'
    }
    isVisible.value = true
  }

  const hideSuccess = () => {
    isVisible.value = false
  }

  // Predefined success messages for common actions
  const showIncomeAdded = () => {
    showSuccess({
      title: 'Income added successfully',
      message: ''
    })
  }

  const showExpenseAdded = () => {
    showSuccess({
      title: 'Expense added successfully',
      message: ''
    })
  }

  const showInvoiceExported = () => {
    showSuccess({
      title: 'Invoice exported successfully',
      message: ''
    })
  }

  const showFileUploaded = (fileName = '') => {
    showSuccess({
      title: 'File uploaded successfully',
      message: fileName ? `${fileName} has been uploaded` : ''
    })
  }

  const showDataSaved = () => {
    showSuccess({
      title: 'Data saved successfully',
      message: ''
    })
  }

  return {
    isVisible,
    modalData,
    showSuccess,
    hideSuccess,
    showIncomeAdded,
    showExpenseAdded,
    showInvoiceExported,
    showFileUploaded,
    showDataSaved
  }
}