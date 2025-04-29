import { CatalogueResponse, FurnitureItem } from '@/models/catalogue'
import { Project, ProjectListResponse, ProjectResponse } from '@/models/project'
import axios from 'axios'

export const getBaseUrl = () => import.meta.env.APP_BASE_URL ? `http://${import.meta.env.APP_BASE_URL}` : `http://${location.hostname}:3000`

export const getFurniture = async (id: string) => {
  const url = `${getBaseUrl()}/furniture/${id}`

  const furnitureResponse = await axios.get<{ item: FurnitureItem }>(url)
  return furnitureResponse.data.item
}

export const getDefaultWindow = async () => {
  const defaultWindowId = '6807c0a0c1bbf417699e2ad0'

  const window = await getFurniture(defaultWindowId)
  return window
}

export const getDefaultDoor = async () => {
  const defaultDoorId = '6807c77dc1bbf417699e2ad4'

  const door = await getFurniture(defaultDoorId)
  return door
}

const PAGE_SIZE = 5
export const getPageItems = async <T,>(url: string) => {
  const pageResponse = await axios.get<CatalogueResponse<T>>(`${getBaseUrl()}${url}`)
  return pageResponse.data
}

export const getCategoriesUrl = (page: number) => `/furnitureCategory?page=${page}&pageSize=${PAGE_SIZE}`

export const getCategoryItemsUrl = (id: string, page: number) => `/furniture/category/${id}`

export const saveProject = async (project: Project) => {
  const res = await axios.post<ProjectResponse>(`${getBaseUrl()}/project/save`, project, {
    withCredentials: true
  })

  return res.data.project
}

export const getProjectList = async () => {
  const res = await axios.get<ProjectListResponse>(`${getBaseUrl()}/project`, {
    withCredentials: true
  })

  return res.data.projects
}

export const getProjectById = async (id: string) => {
  const res = await axios.get<ProjectResponse>(`${getBaseUrl()}/project/${id}`, {
    withCredentials: true
  })

  return res.data.project
}