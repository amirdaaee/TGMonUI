
export default defineEventHandler(async (event) => {
    const { path, headers, method } = event;
    const targetUrl = useRuntimeConfig(event).baseAuth + '/' + path.split("/")[3];
    let body = null
    if (method == "POST") {
        body = await readBody(event)
    }
    return $fetch(targetUrl, {
        body,
        headers,
        method
    })
})