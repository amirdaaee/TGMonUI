export function useURL() {
    return {
        "thumbnail": function (thumbID: string) {
            return `${useRuntimeConfig().public.baseThumb}/${thumbID}`
        },
        "stream": function (mediaID: string) {
            return `${useRuntimeConfig().public.baseStream}/${mediaID}/`
        },
        "media": function (mediaID: string) {
            return useRuntimeConfig().public.baseApi + "/media/" + mediaID
        },
        "watch": function (mediaID: string) {
            return `/watch/?q=${mediaID}`
        },
    }
}