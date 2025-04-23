import { CatalogueResponse } from '@/models/catalogue'
import axios from 'axios'

export const getBaseUrl = () => import.meta.env.APP_BASE_URL ? `http://${import.meta.env.APP_BASE_URL}` : `http://${location.hostname}:3000`

export const getDefaultWindowUrl = () => `${getBaseUrl()}/models/windows/window021.glb`

export const getDefaultDoorUrl = () => `${getBaseUrl()}/models/doors/door006.glb`

const PAGE_SIZE = 5
export const getPageItems = async <T,>(url: string) => {
  const pageResponse = await axios.get<CatalogueResponse<T>>(`${getBaseUrl()}${url}`)
  return pageResponse.data
}

export const getCategoriesUrl = (page: number) => `/furnitureCategory?page=${page}&pageSize=${PAGE_SIZE}`

export const getCategoryItemsUrl = (id: string, page: number) => `/furniture/category/${id}`