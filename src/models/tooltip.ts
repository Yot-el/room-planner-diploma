import { Vector3 } from 'three'

export type WallTooltipProps = {
  width: number
  height: number
  length: number
}

export type RotationTooltipProps = {
  rotationDegree: number
}

export type ContextMenuTooltipProps = {
  objectId: string
}

export type TooltipData = WallTooltipProps | RotationTooltipProps | ContextMenuTooltipProps

export enum TooltipType {
  WALL = 'wall',
  ROTATE = 'rotate',
  CONTEXT_MENU = 'contextMenu'
}

export type Tooltip = { type: TooltipType, data: TooltipData, position: Vector3 }

