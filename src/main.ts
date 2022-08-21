import { on, once, emit, showUI } from '@create-figma-plugin/utilities'

import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata} from './types'

export default function () {
  figma.on('selectionchange', function () {
    refreshUI();
  });

  figma.on('currentpagechange', function () {
    refreshUI();
  });

  on(events.selectedNodeUpdated, function (metadataStr: string, repaint: boolean) {
    var node = figma.currentPage.selection[0];
    const metadata = deserializeMetadata(metadataStr);
    updateNodeByMetadata(node, metadata);

    if (repaint)
    {
      refreshUI();
    }
  });

  on(events.refreshUI, function () {
    refreshUI();
  });

  once(events.close, function () {
    figma.closePlugin();
  })

  /*on('RESIZE_WINDOW', function (windowSize: { width: number; height: number }) {
    const { width, height } = windowSize
    figma.ui.resize(width, height)
  })*/

  refreshUI();
}

function refreshUI()
{
  var node:BaseNode = figma.currentPage.selection[0];
  if (!node)
  {
    node = figma.currentPage;
  }

  const metadataJson = serializeMetadata(createMetadataFromNode(node));

  console.log('Selected node: ' + metadataJson);

  const options = { width: 240, height: 440 };
  showUI(options, {metadataJson: metadataJson});
}

function createMetadataFromNode(node:BaseNode | null): NodeMetadata | null {
  if (node != null)
  {
    let metadata =  new NodeMetadata();
    metadata.id = node.id;
    metadata.type = node.type;
    metadata.name = node.name;
    metadata.bindingKey = node.getPluginData(pluginData.bindingKey);
    metadata.localizationKey = node.getPluginData(pluginData.localizationKey);
    metadata.componentType = node.getPluginData(pluginData.componentType);

    if (node.type == 'INSTANCE' && node.mainComponent != null)
    {
      if (node.mainComponent.parent != null && node.mainComponent.parent.type == 'COMPONENT_SET')
      {
        metadata.componentType = node.mainComponent.parent.getPluginData(pluginData.componentType);
      }
      else
      {
        metadata.componentType = node.mainComponent.getPluginData(pluginData.componentType);
      }
    }

    try {
      var componentData = JSON.parse(node.getPluginData(pluginData.componentData));
      metadata.componentData = componentData;
    } catch(e) {}
  
    return metadata;
  }

  return null;
}

function updateNodeByMetadata(node: BaseNode, metadata: NodeMetadata | null)
{
  if (metadata != null)
  {
    node.setPluginData(pluginData.bindingKey, metadata.bindingKey ? metadata.bindingKey : '');
    node.setPluginData(pluginData.localizationKey, metadata.localizationKey ? metadata.localizationKey : '');
    node.setPluginData(pluginData.componentData, metadata.componentData ? JSON.stringify(metadata.componentData) : '');

    if (node.type == 'COMPONENT_SET' || node.type == 'COMPONENT')
    {
      node.setPluginData(pluginData.componentType, metadata.componentType ? metadata.componentType : '');
    }

    console.log('Selected node updated: ' + serializeMetadata(metadata));
  }
}
