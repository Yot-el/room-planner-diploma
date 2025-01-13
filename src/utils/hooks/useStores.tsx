import { createContext, useContext, FC, PropsWithChildren } from 'react'
import { rootStore } from '@/stores/rootStore'

const RootContext = createContext(rootStore)

export const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  return <RootContext.Provider value={rootStore}>
    { children }
  </RootContext.Provider>
}

export const useStores = () => {
  return useContext(RootContext)
}