import {SceneObject} from './scene-object';

export interface Activity {
  id: string,
  title: string,
  description: string,
  dueDate: string,
  workspace: string,
  toolboxInfo: {
    BLOCK_LIMITS: { [key: string]: number },
    toolboxDefinition: string,
  },
  sceneObjects: SceneObject[],
  thumbnail?: string,
  background?: string
}
