export type CatalogueItem = {
  imageSrc: string | undefined
  id: string
  type: string
  src: string
  srcImage: string
  properties: {
    category: string
    name: string
    scale?: number
  }
}

export type CatalogueResponse = {
  result: {
    page: number
    pageSize: number
    items: CatalogueItem[]
  }
}