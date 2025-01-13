import { CanvasStore } from '@/stores/canvas/canvasStore'
import { makeAutoObservable } from 'mobx'

export class RootStore {
  canvasStore: CanvasStore

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.canvasStore = new CanvasStore(this)
  }
}

export const rootStore = new RootStore()