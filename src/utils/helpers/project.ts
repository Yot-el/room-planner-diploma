import { ProjectInfo } from '@/models/project'
import { Door, ObjectType, Wall, Window } from '@/models/three'
import { toDataURL } from '@/utils/helpers/loadTexture'
import { Object3D } from 'three'

export const getProjectStructure = async (sceneObjects: {
    model: Record<string, Object3D>;
    wall: Record<string, Wall>;
    window: Record<string, Window>;
    door: Record<string, Door>;
  }) => {
  const objectList: ProjectInfo = []

  Object.values(sceneObjects[ObjectType.MODEL]).forEach((model) => {
    const modelInfo = {
      id: model.userData.id as string,
      type: ObjectType.MODEL,
      properties: {
        position: model.position.toArray(),
        rotation: model.rotation.toArray()
      }
    }

    objectList.push(modelInfo)
  })

  for (const wall of Object.values(sceneObjects[ObjectType.WALL])) {
    const info = {
      type: ObjectType.WALL,
      properties: {
        position: wall.position.toArray(),
        rotation: wall.rotation.toArray(),
        geometryParameters: wall.geometry.parameters,
        color: wall.material.color.toArray(),
        ...(
          wall.material.map && {
            textureParameters: {
              repeat: wall.material.map?.repeat.toArray(),
              imageBase64: await toDataURL(wall.material.map.userData.src as string)
            }
          }
        )
      },
      children: wall.children.map((child) => {
        const childModelId = child.userData.id as string
        const childType = sceneObjects[ObjectType.WINDOW][child.uuid] ? ObjectType.WINDOW : ObjectType.DOOR

        const childInfo = {
          id: childModelId,
          type: childType,
          properties: {
            position: child.position.toArray()
          }
        }

        return childInfo
      })
    }

    objectList.push(info)
  }

  console.log(objectList)
  return objectList
}