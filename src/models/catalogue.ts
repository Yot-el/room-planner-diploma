export type CatalogueItem = {
  id: string
  type: string
  src: string
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