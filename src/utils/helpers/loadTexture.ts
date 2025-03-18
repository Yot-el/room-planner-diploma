import { Texture, TextureLoader } from 'three'

export const loadTexture = (url: string): Promise<Texture> => new Promise((resolve, reject) => {
  const textureLoader = new TextureLoader()

  textureLoader.load(url, (texture) => {
    resolve(texture)
  }, () => {},
  (err) => reject(new Error())
  )
})