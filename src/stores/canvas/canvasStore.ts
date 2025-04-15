import { CanvasEditMode } from '@/models/canvas'
import { Door, isObjectDoor, isObjectWindow, ObjectType, Wall, Window} from '@/models/three'
import { Tooltip, TooltipData, TooltipType } from '@/models/tooltip'
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

  get sceneObjectsByType() {
    const types = {
      [ObjectType.MODEL]: {} as Record<string, Object3D>,
      [ObjectType.WALL]: {} as Record<string, Wall>,
      [ObjectType.WINDOW]: {} as Record<string, Window>,
      [ObjectType.DOOR]: {} as Record<string, Door>
    }

    Object.entries(this.sceneObjects).forEach(([id, sceneObject]) => {
      const group = types[sceneObject.type]
      group[id] = sceneObject.object
    })

    return types
  }

  get walls() {
    return this.sceneObjectsByType[ObjectType.WALL]
  }

  setWallColor(id: string, color: string) {
    const wall = this.walls[id]

    if (!wall) return
    wall.material.color.setStyle(color)
    // mobx не реагирует на изменение только цвета стены
    this.setSceneObject(id, wall, ObjectType.WALL)
  }

  get wallColor() {
    return (id: string) => {
      const wall = this.walls[id]

      if (!wall) return
      return wall.material.color.getHexString()
    }
  }

  get models() {
    return this.sceneObjectsByType[ObjectType.MODEL]
  }

  get windows() {
    return this.sceneObjectsByType[ObjectType.WINDOW]
  }

  get doors() {
    return this.sceneObjectsByType[ObjectType.DOOR]
  }

  get windowsByWallId() {
    return (id: string) => {
      return Object.values(this.windows).filter((window) => window.userData.wallId === id)
    }
  }

  get doorsByWallId() {
    return (id: string) => {
      return Object.values(this.doors).filter((door) => door.userData.wallId === id)
    }
  }

  setSceneObject(id: string, object: Object3D, type: ObjectType) {
    this.sceneObjects[id] = { object,
      type }
  }

  clearSceneObjects() {
    this.sceneObjects = {}
    this.setSelectedObject()
  }

  deleteSceneObject(id: string) {
    const objectToDelete = this.sceneObjects[id]
    // Если удаляемый объект выбран, то убираем его
    if (objectToDelete.object === this.selectedObject?.object) {
      this.setSelectedObject()
    }

    // Убираем three элемент вручную, если это окно
    if (isObjectWindow(objectToDelete.type, objectToDelete.object) || isObjectDoor(objectToDelete.type, objectToDelete.object)) {
      objectToDelete.object.removeFromParent()
    }

    // Удаляем окна у удаляемой стены
    if (objectToDelete.type === ObjectType.WALL) {
      objectToDelete.object.children.forEach((child) => {
        this.deleteSceneObject(child.uuid)
      })
    }

    delete this.sceneObjects[id]
  }

  selectedObject: {
    object: Object3D
    type: ObjectType
  } | undefined = undefined

  setSelectedObject(id?: string) {
    if (!id) {
      this.selectedObject = undefined
      return
    }
    this.selectedObject = this.sceneObjects[id]
  }

  /* tooltip */
  tooltip: Tooltip | null = null

  setTooltip(value: Tooltip | null) {
    this.tooltip = value
  }

  /* light settings */
  lightColor = new Color(DEFAULT_COLOR)
  lightIntensity = 2

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
        if (!this.selectedObject && [CanvasEditMode.Rotate, CanvasEditMode.Translate].includes(this.currentMode)) {
          this.setCurrentMode(CanvasEditMode.Camera)
        }
      })

    reaction(() => this.currentMode,
      (current) => {
        if (![CanvasEditMode.Rotate, CanvasEditMode.Translate].includes(current)) {
          this.setSelectedObject()
        }

        if (this.tooltip?.type === TooltipType.CONTEXT_MENU) {
          this.setTooltip(null)
        }
      })
  }
}