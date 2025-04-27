import { ObjectType } from '@/models/three'
import { BoxGeometry, EulerTuple } from 'three'

export type Properties = {
  position: number[]
  rotation?: EulerTuple
  geometryParameters?: BoxGeometry['parameters']
  color?: number[]
  textureParameters?: {
    repeat: number[]
    imageBase64: string
  }
} & {
  [key: string]: any
}

export type ProjectItem = {
  id?: string,
  properties: Properties,
  children?: ProjectItem[],
  type: ObjectType
}

export type ProjectInfo = ProjectItem[]

export type Project = {
  id: string,
  name: string,
  data: ProjectInfo
}
