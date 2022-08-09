import { on, once, emit, showUI } from '@create-figma-plugin/utilities'

import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata} from './types'

export default function () {
  figma.on('selectionchange', function () {
    refreshUI();
  });

  on(events.selectedNodeUpdated, function (metadataStr: string) {
    var node = figma.currentPage.selection[0];
    const metadata = deserializeMetadata(metadataStr);
    updateNodeByMetadata(node, metadata);
    refreshUI();
  });

  on(events.refreshUI, function () {
    refreshUI();
  });

  once(events.close, function () {
    figma.closePlugin();
  })


  on('RESIZE_WINDOW', function (windowSize: { width: number; height: number }) {
    const { width, height } = windowSize
    figma.ui.resize(width, height)
  })

  refreshUI();
  //setSelectedNode(node);
}

function refreshUI()
{
  console.log('refreh UI');
  var node = figma.currentPage.selection[0];
  const metadataJson = serializeMetadata(createMetadataFromNode(node));
  const options = { width: 240, height: 500 };
  showUI(options, {metadataJson: metadataJson});
}


function createMetadataFromNode(node:SceneNode | null): NodeMetadata | null {
  if (node != null)
  {
    let metadata =  new NodeMetadata();
    metadata.id = node.id;
    metadata.type = node.type;
    metadata.bindingKey = node.getPluginData(pluginData.bindingKey);
    metadata.localizationKey = node.getPluginData(pluginData.localizationKey);
    metadata.componentType = node.getPluginData(pluginData.componentType);
    metadata.componentData = node.getPluginData(pluginData.componentData);


    return metadata;
  }

  return null;
}

function updateNodeByMetadata(node: SceneNode, metadata: NodeMetadata | null)
{
  if (metadata != null)
  {
    node.setPluginData(pluginData.bindingKey, metadata.bindingKey ? metadata.bindingKey : '');
    node.setPluginData(pluginData.localizationKey, metadata.localizationKey ? metadata.localizationKey : '');
    node.setPluginData(pluginData.componentType, metadata.componentType ? metadata.componentType : '');
    node.setPluginData(pluginData.componentData, metadata.componentData ? metadata.componentData : '');
  }
}
