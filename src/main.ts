import { on, once, emit, showUI } from '@create-figma-plugin/utilities'

import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata, Warning} from './types'

export default function () {
  figma.on('selectionchange', function () {
    refreshUI();
  });

  figma.on('currentpagechange', function () {
    refreshUI();
  });

  on(events.selectedNodeUpdated, function (metadataStr: string, repaint: boolean) {
    const node = getSelectedNode();
    const metadata = deserializeMetadata(metadataStr);
    updateNodeByMetadata(node, metadata);

    if (repaint)
    {
      refreshUI();
    }
  });

  
  on(events.selectNode, function (nodeId: string) {
    const targetNode = figma.currentPage.findOne(node => node.id === nodeId);
    if (targetNode != null) {
      figma.currentPage.selection = [ targetNode ];
    } else {
      console.log('Specified node could not found: ' + nodeId);
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
  const node = getSelectedNode();
  var metadataJson:string = "";

  if (node != null)
  {
    const metadata = createMetadataFromNode(node);
    checkWarningsForNode(node, metadata);

    metadataJson = serializeMetadata(metadata);
  }

  console.log('Selected node: ' + metadataJson);

  const options = { width: 240, height: 440 };
  showUI(options, {metadataJson: metadataJson});
}

function getSelectedNode()
{
  var node:BaseNode = figma.currentPage.selection[0];
  
  if (!node)
  {
    node = figma.currentPage;
  }
  return node;
}

function supportsChildren(node: SceneNode | PageNode):
  node is FrameNode | ComponentNode | InstanceNode | BooleanOperationNode
{
  return node.type === 'FRAME' || node.type === 'GROUP' ||
         node.type === 'COMPONENT' || node.type === 'INSTANCE' ||
         node.type === 'BOOLEAN_OPERATION' || node.type === 'PAGE';
}

type NodeWithChildren = GroupNode | FrameNode | ComponentNode | InstanceNode | BooleanOperationNode | PageNode

function checkWarningsForNode(node:SceneNode | PageNode, metadata: NodeMetadata) {
  if (node.type !== 'PAGE') {
    checkWarningsAll(node, metadata);
  } else {
    var children = (node as NodeWithChildren).children;
    children.forEach(child => {
      checkWarningsForNodeRecurse(child, metadata);
    });
  }
}

function checkWarningsForNodeRecurse(node:SceneNode, metadata: NodeMetadata) {
  checkWarningsAll(node, metadata);
  
  if (supportsChildren(node))
  {
    var children = (node as NodeWithChildren).children;

    children.forEach(child => {
      checkWarningsForNodeRecurse(child, metadata);
    });
  }
}

function checkWarningsAll(node:SceneNode, metadata: NodeMetadata) {
  checkWarningIfHasRotation(node, metadata);
  checkWarningIfMask(node, metadata);
  checkWarningIfLine(node, metadata);
}

function checkWarningIfLine(node:SceneNode, metadata: NodeMetadata) {
  if (node.type === 'LINE') {
    metadata.warnings.push(new Warning("Line does not supported; use 'Outline stroke'.", node.id, node.name));
  }
}

function checkWarningIfMask(node:SceneNode, metadata: NodeMetadata) {
  type NodeWithMask = GroupNode | FrameNode | ComponentNode | InstanceNode | BooleanOperationNode | VectorNode | LineNode | RectangleNode

  const n = node as NodeWithMask;
  if (n != null && n.isMask) {
    metadata.warnings.push(new Warning("Mask does not supported.", node.id, node.name));
  }
}

function checkWarningIfHasRotation(node:SceneNode, metadata: NodeMetadata) {
  type NodeWithTransform = GroupNode | FrameNode | ComponentNode | InstanceNode | BooleanOperationNode | VectorNode | LineNode | RectangleNode

  const n = node as NodeWithTransform;
  if (n != null && n.rotation > 0.001 || n.rotation < -0.001) {
    metadata.warnings.push(new Warning("Rotation does not supported.", node.id, node.name));
  }
}

function createMetadataFromNode(node:BaseNode): NodeMetadata {
    let metadata =  new NodeMetadata();
    metadata.id = node.id;
    metadata.type = node.type;
    metadata.name = node.name;
    metadata.bindingKey = node.getPluginData(pluginData.bindingKey);
    metadata.localizationKey = node.getPluginData(pluginData.localizationKey);
    metadata.componentType = node.getPluginData(pluginData.componentType);
    metadata.tags = node.getPluginData(pluginData.tags);

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

function updateNodeByMetadata(node: BaseNode, metadata: NodeMetadata | null)
{
  if (metadata != null)
  {
    node.setPluginData(pluginData.bindingKey, metadata.bindingKey ? metadata.bindingKey : '');
    node.setPluginData(pluginData.localizationKey, metadata.localizationKey ? metadata.localizationKey : '');
    node.setPluginData(pluginData.tags, metadata.tags ? metadata.tags : '');
    node.setPluginData(pluginData.componentData, metadata.componentData ? JSON.stringify(metadata.componentData) : '');

    if (node.type == 'COMPONENT_SET' || node.type == 'COMPONENT')
    {
      node.setPluginData(pluginData.componentType, metadata.componentType ? metadata.componentType : '');
    }


    console.log('Selected node updated: ' + serializeMetadata(metadata));
  }
}
