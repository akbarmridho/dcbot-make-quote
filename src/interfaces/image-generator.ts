export interface ImageGenerator {
  (profilePicture: Buffer, text: string, author?:string) : Buffer
}
