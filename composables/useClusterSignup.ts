import { ref } from "vue";

export interface ClusterSignupState {
  estateInfo: {
    name: string;
    type: string;
    admin: {
      email_address: string;
      password: string;
      name: string;
      phone_number: string;
    };
  } | null;
  domainConfig: {
    subdomain: string;
  } | null;
}

export const useClusterSignup = () => {
  const signupState = ref<ClusterSignupState>({
    estateInfo: null,
    domainConfig: null,
  });

  // Convert estate name to valid subdomain
  const slugifyDomain = (estateName: string): string => {
    return estateName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // Save estate information
  const saveEstateInfo = (data: ClusterSignupState["estateInfo"]) => {
    signupState.value.estateInfo = data;
  };

  // Save domain configuration
  const saveDomainConfig = (data: ClusterSignupState["domainConfig"]) => {
    signupState.value.domainConfig = data;
  };

  // Submit cluster signup
  const submitClusterSignup = async () => {
    if (!signupState.value.estateInfo) {
      throw new Error("Estate information is required");
    }

    const { $api } = useNuxtApp();
    const subdomain =
      signupState.value.domainConfig?.subdomain ||
      slugifyDomain(signupState.value.estateInfo.name);

    try {
      const response = await $api("/auth/cluster-signup/", {
        method: "POST",
        body: {
          ...signupState.value.estateInfo,
          subdomain,
        },
      });

      // Clear signup state after successful submission
      signupState.value = {
        estateInfo: null,
        domainConfig: null,
      };

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    signupState: readonly(signupState),
    saveEstateInfo,
    saveDomainConfig,
    submitClusterSignup,
    slugifyDomain,
  };
};
