export type FurnitureItem = {
  imageSrc?: string
  id: string
  type: string
  src: string
  properties: {
    category: string
    name: string
    scale?: number
  }
}

export type CategoryItem = {
  id: string
  category: string
  imageSrc: string
}

export type CatalogueResponse<T> = {
  result: {
    page: number
    pageSize: number
    items: T[]
  }
}

export type CatalogueItem = CategoryItem | FurnitureItem