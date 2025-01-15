import { CanvasEditMode } from '@/models/canvas'
import { RootStore } from '@/stores/rootStore'
import { makeAutoObservable } from 'mobx'
import { Color, Object3D, Vector3 } from 'three'

export const DEFAULT_COLOR = 0xffffff

export class CanvasStore {
  rootStore: RootStore

  currentMode: CanvasEditMode = CanvasEditMode.Camera

  setCurrentMode(mode: CanvasEditMode) {
    this.currentMode = mode
  }

  selectedObject: Object3D | undefined = undefined

  setSelectedObject(object: Object3D) {
    this.selectedObject = object
  }

  /* light settings */
  lightColor = new Color(DEFAULT_COLOR)
  lightIntensity = 1

  directionalLightPosition = new Vector3(1, 1, 0)
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
  }
}