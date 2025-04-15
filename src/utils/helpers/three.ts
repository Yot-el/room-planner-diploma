import {  BufferGeometry, MathUtils, Vector3 } from 'three'
import { Door, ModelType, ObjectType, Wall, Window } from '@/models/three'
import { loadModel } from '@/utils/helpers/loadModel'
import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'

export const getBufferGeometrySize = (geometry: BufferGeometry) => {
  const size = new Vector3()
  geometry.boundingBox?.getSize(size)

  return size
}

export const clampWallChildPosition = (wall: Wall, child: Window) => {
  const childSize = getBufferGeometrySize(child.geometry)
  const maxPosition = new Vector3(WALL_WIDTH / 2 + childSize.z / 2, wall.geometry.parameters.height - childSize.y / 2, wall.geometry.parameters.depth - childSize.x / 2 - 0.1)
  child.position.clamp(new Vector3(0, childSize.y / 2, childSize.x / 2 + 0.1), maxPosition)
}

export const createWallChild = async <T extends Window | Door>(wall: Wall, modelSrc: string, type?: ObjectType.WINDOW | ObjectType.DOOR): Promise<T | undefined> => {
  const model = await loadModel(ModelType.GLTF, modelSrc) as T

  // Дополнительная модель для другой стороны стены (нужна в силу особенности моделей окон и геометрии стены)
  const modelClone = model.clone()
  const modelSize = getBufferGeometrySize(model.geometry)

  // Невозможно построить окно, если длина стены меньше длины окна
  if (modelSize.x >= wall.geometry.parameters.depth) return

  wall.add(model)

  model.add(modelClone)
  if (type === ObjectType.WINDOW) modelClone.rotateY(MathUtils.degToRad(180))
  modelClone.position.set(0, 0, -WALL_WIDTH - modelSize.z)
  modelClone.userData.wallChildClone = true

  model.rotateY(MathUtils.degToRad(90))

  model.userData.wallId = wall.uuid

  return model
}