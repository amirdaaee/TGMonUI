import { Configuration } from '@/gen/client/runtime';

export function useClientConfig() {
    const { token } = useAuth()

    const baseApi = useRuntimeConfig().public.baseApi
    // Always build configuration with the latest token

    const config = new Configuration({
        basePath: baseApi,
        apiKey: token.value ?? '',
    })
    return config
}