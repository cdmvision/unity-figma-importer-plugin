import { on, once, emit, showUI } from '@create-figma-plugin/utilities'

import { events, pluginData} from './types'

function setSelectedNode(node: SceneNode | null) {
  var data = { 
    nodeType: '', 
    bindingKey: '', 
    locTableEntryRef: '',
    componentType: '' 
  };

  if (node) {
    data.nodeType = node.type;
    data.bindingKey = node.getPluginData(pluginData.bindingKey);
    data.locTableEntryRef = node.getPluginData(pluginData.localizationKey);
    data.componentType = node.getPluginData(pluginData.componentType);
  }

  //console.log('bindingKey:' + data.bindingKey + ' locTableEntryRef:' + data.locTableEntryRef + ' componentType:' + data.componentType);

  emit(events.bindingKeyChange, data.bindingKey, data.nodeType);
  emit(events.localizationKeyChange, data.locTableEntryRef, data.nodeType);
  emit(events.componentTypeChange, data.componentType, data.nodeType);
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

  on(events.bindingKeyChange, function (value: string) {
    node.setPluginData(pluginData.bindingKey, value ? value : '');
  })

  on(events.localizationKeyChange, function (value: string) {
    node.setPluginData(pluginData.localizationKey, value ? value : '');
  })

  on(events.componentTypeChange, function (value: string) {
    node.setPluginData(pluginData.componentType, value ? value : '');
  })

  once(events.close, function () {
    figma.closePlugin();
  })

  const options = { width: 240, height: 230 };
  showUI(options);
  setSelectedNode(node);
}
