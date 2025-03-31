import { CanvasStore } from '@/stores/canvas/canvasStore'
import { CatalogueStore } from '@/stores/ui/catalogueStore'
import { makeAutoObservable } from 'mobx'

export class RootStore {
  canvasStore: CanvasStore
  catalogueStore: CatalogueStore

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.canvasStore = new CanvasStore(this)
    this.catalogueStore = new CatalogueStore(this)
  }
}

export const rootStore = new RootStore()