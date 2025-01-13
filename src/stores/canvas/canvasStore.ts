import { RootStore } from '@/stores/rootStore'
import { makeAutoObservable } from 'mobx'

export class CanvasStore {
  rootStore: RootStore

  /* camera settings */
  fov = 75
  near = 0.1
  far = 100
  aspect = 0

  updateAspect(width: number, height: number) {
    this.aspect = width / height
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })

    this.rootStore = rootStore
  }
}