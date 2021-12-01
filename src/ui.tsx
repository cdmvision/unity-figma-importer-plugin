import {
  Container,
  render,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'

import { on, emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'

import { SetBindingKeyHandler, SetLocalizationKeyHandler, SetComponentTypeHandler } from './types'

function Plugin(data: { }) {
  on<SetBindingKeyHandler>('SET_BINDING_KEY', function (bindingKey: string, nodeType: string) {
    var bindingKeyField = document.getElementById("bindingKeyField") as HTMLInputElement;
    if (bindingKeyField) {
      bindingKeyField.value = bindingKey;
      bindingKeyField.disabled = nodeType == '';
    }
  })

  on<SetLocalizationKeyHandler>('SET_LOCALIZATION_KEY', function (localizationKey: string, nodeType: string) {
    var localizationKeyField = document.getElementById("localizationKeyField") as HTMLInputElement;
    if (localizationKeyField) {
      localizationKeyField.value = localizationKey;
      localizationKeyField.disabled = nodeType == '' || nodeType !== 'TEXT';
    }
  })

  on<SetComponentTypeHandler>('SET_COMPONENT_TYPE', function (componentType: string, nodeType: string) {
    var componentTypeField = document.getElementById("componentTypeField") as HTMLInputElement;
    if (componentTypeField) {
      componentTypeField.value = componentType;
      componentTypeField.disabled = nodeType == '' || (nodeType !== 'COMPONENT_SET' && nodeType !== 'COMPONENT');
    }
  })

  function setBindingKey(value: string) {
    emit<SetBindingKeyHandler>('SET_BINDING_KEY', value, '');
  }

  function setLocalizationKey(value: string) {
    emit<SetLocalizationKeyHandler>('SET_LOCALIZATION_KEY', value, '');
  }

  function setComponentType(value: string) {
    emit<SetComponentTypeHandler>('SET_COMPONENT_TYPE', value, '');
  }

  return (
    <Container>
      <VerticalSpace space="large" />
      <Text>Binding Key</Text>
      <VerticalSpace space="small" />
      <Textbox id="bindingKeyField" onValueInput={setBindingKey} value=''/>
      <VerticalSpace space="small" />

      <VerticalSpace space="small" />
      <Text>Localization Key</Text>
      <VerticalSpace space="small" />
      <Textbox id="localizationKeyField" onValueInput={setLocalizationKey} value=''/>
      <VerticalSpace space="small" />

      <VerticalSpace space="small" />
      <Text>Component Type</Text>
      <VerticalSpace space="small" />
      <Textbox id="componentTypeField" onValueInput={setComponentType} value=''/>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
