import type { UseFetchOptions } from 'nuxt/app'
export function useAPI<T>(
    url: string | (() => string),
    options: Omit<UseFetchOptions<T>, 'default'>,
) {

    const {
        token,
    } = useAuth()

    return useFetch(url, {
        headers: {
            "Authorization": token.value ? token.value : ''
        },
        ...options,
    })
}