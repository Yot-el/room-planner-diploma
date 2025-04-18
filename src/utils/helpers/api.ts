import { CatalogueResponse } from '@/models/catalogue'

export const getBaseUrl = () => import.meta.env.APP_BASE_URL ? `http://${import.meta.env.APP_BASE_URL}` : `http://${location.hostname}:3000`

export const getDefaultWindowUrl = () => `${window.location.origin}/models/windows/window021.glb`

export const getDefaultDoorUrl = () => `${window.location.origin}/models/doors/door006.glb`

const PAGE_SIZE = 5
export const getPageItems = async <T,>(url: string): Promise<CatalogueResponse<T> | null> => {
  // const url = `/furniture?page=${page}&pageSize=${PAGE_SIZE}`
  const pageResponse = await fetch(`${getBaseUrl()}${url}`)

  if (pageResponse.ok) {
    return await pageResponse.json() as CatalogueResponse<T>
  }

  return new Promise((resolve) => resolve(null))
}

export const getCategoriesUrl = (page: number) => `/furnitureCategory?page=${page}&pageSize=${PAGE_SIZE}`

export const getCategoryItemsUrl = (id: string, page: number) => `/furniture/category/${id}`