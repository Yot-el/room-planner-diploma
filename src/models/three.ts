import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three'

export enum ModelType {
  FBX = 'fbx',
  OBJ = 'obj'
}

export enum ObjectType {
  WALL = 'wall',
  WINDOW = 'window',
  MODEL = 'model'
}

export type Wall = Mesh<BoxGeometry, MeshPhongMaterial>

export type Window = Mesh<BoxGeometry, MeshPhongMaterial>

export const isObjectWall = (type: ObjectType, object: Object3D): object is Wall => type === ObjectType.WALL