import { ref } from "vue";
import type {
  StaffAccount,
  SubuserAccount,
  ResidentImportedData,
} from "~/types/auth";

export const useUserManagement = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const addStaff = async (staffData: StaffAccount) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { $api } = useNuxtApp();
      const response = await $api("/accounts/add-staff/", {
        method: "POST",
        body: staffData,
      });
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to add staff";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addUser = async (userData: SubuserAccount) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { $api } = useNuxtApp();
      const response = await $api("/accounts/add-user/", {
        method: "POST",
        body: userData,
      });
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to add user";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const importResidents = async (importData: ResidentImportedData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { $api } = useNuxtApp();
      const response = await $api("/accounts/import-members/", {
        method: "POST",
        body: importData,
      });
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to import residents";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getImportTemplate = async (format: "CSV" | "XLSX" | "XLS" = "CSV") => {
    try {
      const { $api } = useNuxtApp();
      const response = await $api("/accounts/resident-import-template/", {
        method: "GET",
        query: { format },
      });
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to get import template";
      throw err;
    }
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    addStaff,
    addUser,
    importResidents,
    getImportTemplate,
  };
};
