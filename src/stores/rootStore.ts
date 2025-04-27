import { CanvasStore } from '@/stores/canvas/canvasStore'
import { CatalogueStore } from '@/stores/ui/catalogueStore'
import { ProjectStore } from '@/stores/ui/projectStore'
import { makeAutoObservable } from 'mobx'

export class RootStore {
  projectStore: ProjectStore
  canvasStore: CanvasStore
  catalogueStore: CatalogueStore

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.projectStore = new ProjectStore(this)
    this.canvasStore = new CanvasStore(this)
    this.catalogueStore = new CatalogueStore(this)
  }
}

export const rootStore = new RootStore()