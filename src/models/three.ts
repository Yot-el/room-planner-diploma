import { BoxGeometry, BufferGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three'

export enum ModelType {
  FBX = 'fbx',
  OBJ = 'obj',
  GLTF = 'gltf'
}

export enum ObjectType {
  WALL = 'wall',
  WINDOW = 'window',
  MODEL = 'model'
}

export type Wall = Mesh<BoxGeometry, MeshStandardMaterial>

export type Window = Mesh<BufferGeometry, MeshStandardMaterial>

export const isObjectWall = (type: ObjectType, object: Object3D): object is Wall => type === ObjectType.WALL

export const isObjectWindow = (type: ObjectType, object: Object3D): object is Window => type === ObjectType.WINDOW