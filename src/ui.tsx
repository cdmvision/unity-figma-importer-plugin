import {
  Container,
  render,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'

import { on, emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'

import { events, pluginData } from './types'

function Plugin(data: { }) {

  on(events.bindingKeyChange, function (value: string, nodeType: string) {
    var field = document.getElementById(pluginData.bindingKey) as HTMLInputElement;
    if (field) {
      field.value = value;
      field.disabled = nodeType == '';
    }
  })

  on(events.localizationKeyChange, function (value: string, nodeType: string) {
    var field = document.getElementById(pluginData.localizationKey) as HTMLInputElement;
    if (field) {
      field.value = value;
      field.disabled = nodeType == '' || nodeType !== 'TEXT';
    }
  })

  on(events.componentTypeChange, function (value: string, nodeType: string) {
    var field = document.getElementById(pluginData.componentType) as HTMLInputElement;
    if (field) {
      field.value = value;
      field.disabled = nodeType == '' || (nodeType !== 'COMPONENT_SET' && nodeType !== 'COMPONENT');
    }
  })

  function setBindingKey(value: string) {
    emit(events.bindingKeyChange, value, '');
  }

  function setLocalizationTableEntryRef(value: string) {
    emit(events.localizationKeyChange, value, '');
  }

  function setComponentType(value: string) {
    emit(events.componentTypeChange, value, '');
  }

  return (
    <Container>
      <VerticalSpace space="large" />
      <Text>Binding Key</Text>
      <VerticalSpace space="small" />
      <Textbox id={pluginData.bindingKey} onValueInput={setBindingKey} value=''/>
      <VerticalSpace space="small" />

      <VerticalSpace space="small" />
      <Text>Localization Key</Text>
      <VerticalSpace space="small" />
      <Textbox id={pluginData.localizationKey} onValueInput={setLocalizationTableEntryRef} value=''/>
      <VerticalSpace space="small" />

      <VerticalSpace space="small" />
      <Text>Component Type</Text>
      <VerticalSpace space="small" />
      <Textbox id={pluginData.componentType} onValueInput={setComponentType} value=''/>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
