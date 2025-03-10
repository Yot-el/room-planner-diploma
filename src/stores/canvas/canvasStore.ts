import { CanvasEditMode } from '@/models/canvas'
import { ObjectType } from '@/models/three'
import { RootStore } from '@/stores/rootStore'
import { makeAutoObservable, reaction } from 'mobx'
import { Color, Object3D, Vector3 } from 'three'

export const DEFAULT_COLOR = 0xffffff

export class CanvasStore {
  rootStore: RootStore

  currentMode: CanvasEditMode = CanvasEditMode.Camera

  setCurrentMode(mode: CanvasEditMode) {
    this.currentMode = mode
  }

  sceneObjects: Record<string, {
    object: Object3D
    type: ObjectType
  }> = {}

  setSceneObject(id: string, object: Object3D, type: ObjectType) {
    this.sceneObjects[id] = { object,
      type }
  }

  clearSceneObjects() {
    this.sceneObjects = {}
    this.setSelectedObject()
  }

  deleteSceneObject(id: string) {
    // Если удаляемый объект выбран, то убираем его
    if (this.sceneObjects[id].object === this.selectedObject) {
      this.setSelectedObject()
    }
    delete this.sceneObjects[id]
  }

  selectedObject: Object3D | undefined = undefined

  setSelectedObject(id?: string) {
    if (!id) {
      this.selectedObject = undefined
      return
    }
    this.selectedObject = this.sceneObjects[id].object
  }

  /* light settings */
  lightColor = new Color(DEFAULT_COLOR)
  lightIntensity = 10

  directionalLightPosition = new Vector3(3, 10, 10)
  directionalLightTarget = new Object3D()

  setDirectionalLightTargetPosition(x: number, y: number, z: number) {
    this.directionalLightTarget.position.set(x, y, z)
  }

  /* scene fog */
  fogColor = new Color(DEFAULT_COLOR)

  /* scene ground */
  groundColor = new Color(DEFAULT_COLOR)

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.rootStore = rootStore

    this.directionalLightTarget.position.set(0, 0, 0)

    reaction(() => this.selectedObject,
      () => {
        if (!this.selectedObject && this.currentMode === CanvasEditMode.Selection) {
          this.setCurrentMode(CanvasEditMode.Camera)
        }
      })
  }
}