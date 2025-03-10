import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { BufferGeometry, Mesh, MeshPhongMaterial, NormalBufferAttributes, Object3D } from 'three'
import { ModelType } from '@/models/three'

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
  default: {
    reject(new Error('Unsupported model type'))
  }
  }
})