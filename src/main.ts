import { on, once, emit, showUI } from '@create-figma-plugin/utilities'

import { CloseHandler, SetBindingKeyHandler, SetLocalizationKeyHandler, SetComponentTypeHandler } from './types'

const PluginDataBindingKey = "bindingKey";
const PluginDataLocalizationKey = "localizationKey";
const PluginDataComponentTypeKey = "componentType";

function setSelectedNode(node: SceneNode | null) {
  var data = { nodeType: '', bindingKey: '', localizationKey: '', componentType: '' };
  if (node) {
    const bindingKey = node.getPluginData(PluginDataBindingKey);
    const localizationKey = node.getPluginData(PluginDataLocalizationKey);
    const componentType = node.getPluginData(PluginDataComponentTypeKey);

    data.nodeType = node.type;
    data.bindingKey = bindingKey;
    data.localizationKey = localizationKey;
    data.componentType = componentType;
  }

  //console.log('bindingKey:' + data.bindingKey + ' localizationKey:' + data.localizationKey + ' componentType:' + data.componentType);

  emit<SetBindingKeyHandler>('SET_BINDING_KEY', data.bindingKey, data.nodeType);
  emit<SetLocalizationKeyHandler>('SET_LOCALIZATION_KEY', data.localizationKey, data.nodeType);
  emit<SetComponentTypeHandler>('SET_COMPONENT_TYPE', data.componentType, data.nodeType);
}

export default function () {
  var node = figma.currentPage.selection[0];

  figma.on('selectionchange', function () {
    
    if (figma.currentPage.selection.length == 1) {
      node = figma.currentPage.selection[0];
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  });

  on<SetBindingKeyHandler>('SET_BINDING_KEY', function (bindingKey: string) {
    //console.log('Saving: ' + node.id +  ' bindingKey:' + bindingKey);
    node.setPluginData(PluginDataBindingKey, bindingKey ? bindingKey : '');
  })

  on<SetLocalizationKeyHandler>('SET_LOCALIZATION_KEY', function (localizationKey: string) {
    //console.log('Saving: ' + node.id +  ' localizationKey:' + localizationKey);
    node.setPluginData(PluginDataLocalizationKey, localizationKey ? localizationKey : '');
  })

  on<SetComponentTypeHandler>('SET_COMPONENT_TYPE', function (componentType: string) {
    //console.log('Saving: ' + node.id +  ' componentType:' + componentType);
    node.setPluginData(PluginDataComponentTypeKey, componentType ? componentType : '');
  })

  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin();
  })

  const options = { width: 240, height: 230 };
  showUI(options);
  setSelectedNode(node);
}
