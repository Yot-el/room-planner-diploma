import { CatalogueItem } from '@/models/catalogue'
import { RootStore } from '@/stores/rootStore'
import { getPageItems } from '@/utils/helpers/api'
import { makeAutoObservable } from 'mobx'

export class CatalogueStore {
  rootStore: RootStore

  page = 1
  pageCount = 10
  items: CatalogueItem[] = []

  setPage(value: number) {
    this.page = value
  }

  setPageCount(value: number) {
    this.pageCount = value
  }

  setItems(value: CatalogueItem[]) {
    this.items = value
  }

  async changePage(nextPage: number) {
    const items = await getPageItems(nextPage)

    if (items?.result) {
      this.setItems(items.result.items)
      this.setPage(nextPage)
    }
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.rootStore = rootStore
  }
}