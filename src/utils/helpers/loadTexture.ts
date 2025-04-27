import { Texture, TextureLoader } from 'three'

export const loadTexture = (url: string): Promise<Texture> => new Promise((resolve, reject) => {
  const textureLoader = new TextureLoader()

  textureLoader.load(url, (texture) => {
    resolve(texture)
  }, () => {},
  (err) => reject(new Error())
  )
})


export const toDataURL = (url: string): Promise<string> => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))