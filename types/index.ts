export interface MediaType {
    FileName: string
    FileSize: number
    Thumbnail: string
    ID: string,
    Duration: number
    Vtt: string,
    Sprite: string,
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
export interface JobType {
    ID: string,
    mediaID: string,
    type: string
}
export interface JobListType {
    Job: JobType[]
}
