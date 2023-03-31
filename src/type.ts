export type ZipIndex = string[]
export type ZipData = {
  zip: string
  prefectures: string
  city: string
  other: string
}
export type ZipAllData = {
  [key: string]: ZipData[]
}
