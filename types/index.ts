export interface MediaType {
    FileName: string
    FileSize: number
    Thumbnail: string
    ID: string,
    Duration: number
}
export interface MediaListType {
    Total: number
    Media: MediaType[]
}
export interface MediaInfoType {
    Media: MediaType
    Next: MediaType
    Back: MediaType

}