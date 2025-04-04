import { Euler, MathUtils, Quaternion } from 'three'

export const quaternionToDegree = (quaternion: Quaternion) => {
  const euler = new Euler()
  const radians = euler.setFromQuaternion(quaternion, 'YXZ')

  const r_x = radians.x > 0 ? radians.x : (2 * Math.PI) + radians.x
  const r_y = radians.y > 0 ? radians.y : (2 * Math.PI) + radians.y
  const r_z = radians.z > 0 ? radians.z : (2 * Math.PI) + radians.z

  return {
    x: +MathUtils.radToDeg(r_x).toFixed(2),
    y: +MathUtils.radToDeg(r_y).toFixed(2),
    z: +MathUtils.radToDeg(r_z).toFixed(2)
  }
}

export const getWallShortName = (uuid: string) => `Стена ${uuid.toString().slice(0, 5)}`

export const getWindowShortName = (uuid: string) => `Окно ${uuid.toString().slice(0, 5)}`

export const getModelShortName = (uuid: string, name: string) => `${name} ${uuid.toString().slice(0, 5)}`