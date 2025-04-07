import { CatalogueItem, CategoryItem } from '@/models/catalogue'
import { RootStore } from '@/stores/rootStore'
import { getCategoriesUrl, getCategoryItemsUrl, getPageItems } from '@/utils/helpers/api'
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

  async changePage(nextPage: number, categoryId?: string) {
    const items = await getPageItems<CatalogueItem>(!categoryId ? getCategoriesUrl(nextPage) : getCategoryItemsUrl(categoryId, nextPage))

    // TODO: Переделать при добавлении пагинации для отдельных категорий
    if (items && (items.result || categoryId)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.setItems(!categoryId ? items.result.items : (items as any).items)
      this.setPage(nextPage)
    }
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.rootStore = rootStore
  }
}