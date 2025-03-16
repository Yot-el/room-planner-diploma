import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { Object3D } from 'three'
import { ModelType } from '@/models/three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export const loadModel = (type: ModelType, url: string): Promise<Object3D> => new Promise((resolve, reject) => {
  switch (type) {
  case ModelType.FBX: {
    const fbxLoader = new FBXLoader()

    fbxLoader.load(url, (object) => {
      console.log(object)
      object.scale.set(0.1, 0.1, 0.1)
      resolve(object)
    })
    break
  }
  case ModelType.OBJ: {
    reject(new Error('Unsupported model type'))
    break
  }
  case ModelType.GLTF: {
    const loader = new GLTFLoader()
    loader.load(url, (gltf) => {
      resolve(gltf.scene.children[0])
    })
    break
  }
  default: {
    reject(new Error('Unsupported model type'))
  }
  }
})