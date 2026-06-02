export type String<T> = {
  [K in keyof T]: string
}