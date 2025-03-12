import { Vector3 } from 'three'

export type WallTooltip = {
  width: number
  height: number
  length: number
}

export type RotationTooltip = {
  rotation: number
}

export type TooltipData = WallTooltip | RotationTooltip

export enum TooltipType {
  WALL = 'wall'
}

export type Tooltip = { type: TooltipType, data: TooltipData, position: Vector3 }

