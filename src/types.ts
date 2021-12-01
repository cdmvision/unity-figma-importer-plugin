import { EventHandler } from '@create-figma-plugin/utilities'

export interface SetBindingKeyHandler extends EventHandler {
  name: 'SET_BINDING_KEY'
  handler: (bindingKey: string, nodeType: string) => void
}

export interface SetLocalizationKeyHandler extends EventHandler {
  name: 'SET_LOCALIZATION_KEY'
  handler: (localizationKey: string, nodeType: string) => void
}

export interface SetComponentTypeHandler extends EventHandler {
  name: 'SET_COMPONENT_TYPE'
  handler: (componentType: string, nodeType: string) => void
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}
