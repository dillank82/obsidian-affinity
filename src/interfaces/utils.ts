export type OptionalStrings<T> = {
  [K in keyof T]?: string
}