import { CatalogueResponse } from '@/models/catalogue'

export const getBaseUrl = () => import.meta.env.APP_BASE_URL ? `http://${import.meta.env.APP_BASE_URL}` : `http://${location.hostname}:3000`

const PAGE_SIZE = 5
export const getPageItems = async (page: number) => {
  const url = `/furniture?page=${page}&pageSize=${PAGE_SIZE}`
  const pageResponse = await fetch(`${getBaseUrl()}${url}`)

  if (pageResponse.ok) {
    return await pageResponse.json() as CatalogueResponse
  }
}