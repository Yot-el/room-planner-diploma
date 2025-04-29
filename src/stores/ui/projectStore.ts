/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { WALL_WIDTH } from '@/components/ThreeCanvas/SceneGround/SceneGround'
import { FurnitureItem } from '@/models/catalogue'
import { Project, ProjectInfo, ProjectItem, Properties } from '@/models/project'
import { ModelType, ObjectType } from '@/models/three'
import { RootStore } from '@/stores/rootStore'
import { getFurniture, getProjectById, saveProject } from '@/utils/helpers/api'
import { loadModel } from '@/utils/helpers/loadModel'
import { loadTexture } from '@/utils/helpers/loadTexture'
import { getProjectStructure } from '@/utils/helpers/project'
import { createWallChild, getBufferGeometrySize } from '@/utils/helpers/three'
import { makeAutoObservable } from 'mobx'
import { BoxGeometry, Color, Euler, EulerTuple, MathUtils, Mesh, MeshStandardMaterial, RepeatWrapping } from 'three'

export class ProjectStore {
  rootStore: RootStore

  project: Project | null = null


  async saveProject(name: string, id?: string) {
    const structure = await getProjectStructure(this.rootStore.canvasStore.sceneObjectsByType)
    const project = {
      id: id,
      name,
      data: structure
    }

    const savedProject = await saveProject(project)
    this.project = savedProject
  }

  async loadModel(model: ProjectItem) {
    const {
      canvasStore: {
        setSceneObject
      }
    } = this.rootStore
    if (!model.id) return

    const furnitureInfo = await getFurniture(model.id)
    const furnitureModel = await loadModel(furnitureInfo.type as ModelType, furnitureInfo.src)

    furnitureModel.userData.name = furnitureInfo.properties.name
    furnitureModel.userData.id = model.id

    const [x, y, z] = model.properties.position
    furnitureModel.position.set(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4))
    const rotation = new Euler().fromArray(model.properties.rotation!)
    furnitureModel.setRotationFromEuler(rotation)

    if (!furnitureModel) return

    setSceneObject(furnitureModel.uuid, furnitureModel, ObjectType.MODEL)
    return furnitureModel
  }

  async getTexture(parameters: Required<Properties>['textureParameters']) {
    const texture = await loadTexture(parameters.imageBase64)
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.fromArray(parameters.repeat)
    texture.userData.src = parameters.imageBase64
    texture.needsUpdate = true

    return texture
  }

  async loadWall(wall: ProjectItem) {
    const {
      canvasStore: {
        setSceneObject
      }
    } = this.rootStore

    const { width, height, depth } = wall.properties.geometryParameters as BoxGeometry['parameters']

    const materialParameters = {
      ...(
        wall.properties.color && {
          color:  new Color().fromArray(wall.properties.color)
        }
      ),
      ...(
        wall.properties.textureParameters && {
          map: await this.getTexture(wall.properties.textureParameters)
        }
      )
    }
    const threeWall = new Mesh(new BoxGeometry(width, height, depth), new MeshStandardMaterial(materialParameters))

    const [x, y, z] = wall.properties.position
    threeWall.position.set(+x.toFixed(4), +y.toFixed(4), +z.toFixed(4))
    const rotation = new Euler().fromArray(wall.properties.rotation!)
    threeWall.setRotationFromEuler(rotation)
    threeWall.geometry.translate(0, height / 2, depth / 2)

    setSceneObject(threeWall.uuid, threeWall, ObjectType.WALL)

    wall.children?.forEach(async (child) => {
      if (!child.id) return
      const childInfo = await getFurniture(child.id)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const childModel = await createWallChild(threeWall, childInfo.src, child.type as any)
      const [x, y, z] = child.properties.position

      if (!childModel) return
      childModel.userData.id = child.id
      const modelSize = getBufferGeometrySize(childModel.geometry)

      childModel.position.set(WALL_WIDTH / 2 + modelSize.z / 2, y, z)
      setSceneObject(childModel.uuid, childModel, child.type)
    })

    return threeWall
  }

  async loadProject(id: string) {
    const {
      canvasStore: {
        clearSceneObjects
      }
    } = this.rootStore

    clearSceneObjects()
    const project = await getProjectById(id)
    const data = JSON.parse(project.data as unknown as string) as ProjectInfo

    this.project = {
      ...project,
      data
    }
    data.forEach(async (item) => {
      if (item.type === ObjectType.MODEL) {
        await this.loadModel(item)
      }

      if (item.type === ObjectType.WALL) {
        await this.loadWall(item)
      }
    })
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.rootStore = rootStore
  }
}