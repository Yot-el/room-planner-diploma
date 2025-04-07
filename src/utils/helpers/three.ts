import {  BufferGeometry, MathUtils, Vector3 } from 'three'
import { ModelType, Wall, Window } from '@/models/three'
import { loadModel } from '@/utils/helpers/loadModel'
import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { getDefaultWindowUrl } from '@/utils/helpers/api'

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

export const createWindow = async (wall: Wall, modelSrc?: string) => {
  const windowModel = await loadModel(ModelType.GLTF, modelSrc ?? getDefaultWindowUrl()) as Window

  // Дополнительная модель для другой стороны стены (нужна в силу особенности моделей окон и геометрии стены)
  const windowModelClone = windowModel.clone()
  const windowModelSize = getBufferGeometrySize(windowModel.geometry)

  // Невозможно построить окно, если длина стены меньше длины окна
  if (windowModelSize.x >= wall.geometry.parameters.depth) return

  wall.add(windowModel)

  windowModel.add(windowModelClone)
  windowModelClone.rotateY(MathUtils.degToRad(180))
  windowModelClone.position.set(0, 0, -WALL_WIDTH - windowModelSize.z)
  windowModelClone.userData.wallChildClone = true

  windowModel.rotateY(MathUtils.degToRad(90))

  windowModel.userData.wallId = wall.uuid

  return windowModel
}