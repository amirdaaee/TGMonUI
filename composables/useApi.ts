import type { UseFetchOptions } from 'nuxt/app'
export function useAPI<T>(
    url: string | (() => string),
    options: Omit<UseFetchOptions<T>, 'default'>,
) {

    const {
        token,
    } = useAuth()
    let head = options.headers ? options.headers : {}


    return useFetch(url, {
        headers: {
            "Authorization": token.value ? token.value : ''
        },
        ...options,
    })
}