import { on, showUI } from '@create-figma-plugin/utilities'
import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata, Warning } from './types'

type NodeWithTransform = GroupNode | FrameNode | ComponentNode | InstanceNode | BooleanOperationNode | VectorNode | LineNode | RectangleNode

export default async function () {
  figma.on('selectionchange', async function () {
    await refreshUIAsync();
  });

  figma.on('currentpagechange', async function () {
    await refreshUIAsync();
  });

  figma.once('close', function () {
    removeWarningNodes();
  });

  on(events.selectedNodeUpdated, async function (metadataStr: string, repaint: boolean) {
    const node = getSelectedNode();
    const metadata = deserializeMetadata(metadataStr);
    updateNodeByMetadata(node, metadata);
    updateBindingKeyForVariants(node);

    if (repaint) {
      await refreshUIAsync();
    }
  });

  on(events.selectNode, function (nodeId: string) {
    const targetNode = figma.currentPage.findOne(node => node.id === nodeId);
    if (targetNode != null) {
      figma.currentPage.selection = [targetNode];
    } else {
      console.log('Specified node could not found: ' + nodeId);
    }
  });

  on(events.showWarnings, async function () {
    //console.log('showWarnings');
    const node = getSelectedNode();
    const metadata = await createMetadataFromNodeAsync(node);

    await checkWarningsForNodeAsync(node, metadata);

    removeWarningNodes();
    await drawWarningNodesAsync(metadata.warnings);
  });

  on(events.hideWarnings, function () {
    //console.log('hideWarnings');
    removeWarningNodes();
  });

  on(events.refreshUI, async function () {
    await refreshUIAsync();
  });

  /*on('RESIZE_WINDOW', function (windowSize: { width: number; height: number }) {
    const { width, height } = windowSize
    figma.ui.resize(width, height)
  })*/

  await refreshUIAsync();
}

async function refreshUIAsync(): Promise<void> {
  const node = getSelectedNode();

  var metadataJson: string = "";

  if (node != null && !isWarningNode(node)) {
    removeWarningNodes();
    const metadata = await createMetadataFromNodeAsync(node);
    await checkWarningsForNodeAsync(node, metadata);

    metadataJson = serializeMetadata(metadata);
  }

  // console.log('Selected node: ' + metadataJson);

  const options = { width: 240, height: 440 };
  showUI(options, { metadataJson: metadataJson });
}

function getSelectedNode() {
  var node: BaseNode = figma.currentPage.selection[0];

  if (!node) {
    node = figma.currentPage;
  }
  return node;
}

function supportsChildren(node: SceneNode | PageNode):
  node is FrameNode | ComponentNode | InstanceNode | BooleanOperationNode {
  return node.type === 'FRAME' || node.type === 'GROUP' ||
    node.type === 'COMPONENT' || node.type === 'INSTANCE' ||
    node.type === 'BOOLEAN_OPERATION' || node.type === 'PAGE';
}

type NodeWithChildren = GroupNode | FrameNode | ComponentNode | InstanceNode | BooleanOperationNode | PageNode | ComponentSetNode


const warningNodeName = '<<<WARNINGS>>>';

function isWarningNode(node: SceneNode | PageNode): boolean {
  if (node.type === 'FRAME' && node.name === warningNodeName) {
    return true;
  }

  var nodeChildren = node as NodeWithChildren;
  if (nodeChildren != null && nodeChildren.parent != null) {
    return nodeChildren.parent.type === 'FRAME' && nodeChildren.parent.name === warningNodeName
  }

  return false;
}

function removeWarningNodes() {
  var root = figma.currentPage.findOne(node => isWarningNode(node)) as FrameNode;
  if (root != null) {
    root.remove();
  }
}

async function drawWarningNodesAsync(warnings: Warning[]): Promise<void> {
  var root = figma.createFrame();
  root.name = warningNodeName;
  root.clipsContent = false;
  root.fills = [];
  root.strokes = [];
  root.locked = true;
  root.expanded = false;
  root.resize(1, 1);

  const rootMetadata = await createMetadataFromNodeAsync(root);
  rootMetadata.ignored = true;
  updateNodeByMetadata(root, rootMetadata);

  figma.currentPage.appendChild(root);

  warnings.forEach(warning => {
    var rect = figma.createFrame();
    root.appendChild(rect);

    rect.name = warning.node.name;

    var width: number = 0;
    var height: number = 0;

    var layout = warning.node as LayoutMixin;
    if (layout != null) {
      rect.x = layout.absoluteRenderBounds?.x ?? warning.node.x;
      rect.y = layout.absoluteRenderBounds?.y ?? warning.node.y;

      width = layout.absoluteRenderBounds?.width ?? warning.node.width;
      height = layout.absoluteRenderBounds?.height ?? warning.node.height;

    } else {
      rect.x = warning.node.x;
      rect.y = warning.node.y;
      width = warning.node.width;
      height = warning.node.height;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    rect.resize(width, height);

    rect.clipsContent = false;
    rect.fills = [];
    rect.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 1 } }];
    rect.strokeAlign = 'OUTSIDE';
    rect.strokeWeight = 2;
  });
}

async function checkWarningsForNodeAsync(node: SceneNode | PageNode, metadata: NodeMetadata): Promise<void> {
  if (isWarningNode(node)) {
    return;
  }

  var currentMetadata = await createMetadataFromNodeAsync(node);
  if (currentMetadata.ignored) {
    return;
  }

  if (node.type !== 'PAGE') {
    await checkWarningsAllAsync(node, metadata);
  } else {
    var children = (node as NodeWithChildren).children;

    for (const child of children) {
      await checkWarningsForNodeRecurseAsync(child, metadata);
    }
  }
}

async function checkWarningsForNodeRecurseAsync(node: SceneNode, metadata: NodeMetadata): Promise<void> {
  if (isWarningNode(node)) {
    return;
  }

  var currentMetadata = await createMetadataFromNodeAsync(node);
  if (currentMetadata.ignored) {
    return;
  }

  await checkWarningsAllAsync(node, metadata);

  if (supportsChildren(node)) {
    var children = (node as NodeWithChildren).children;

    for (const child of children) {
      await checkWarningsForNodeRecurseAsync(child, metadata);
    }
  }
}

async function checkWarningsAllAsync(node: SceneNode, metadata: NodeMetadata): Promise<void> {
  await checkWarningIfMissingComponentReferenceAsync(node, metadata);
  checkWarningIfHasRotation(node, metadata);
  checkWarningIfMask(node, metadata);
  checkWarningIfLine(node, metadata);
}

async function checkWarningIfMissingComponentReferenceAsync(node: SceneNode, metadata: NodeMetadata): Promise<void> {
  if (node.type === 'INSTANCE') {
    var instanceNode = node as InstanceNode;

    var mainComponent = await instanceNode.getMainComponentAsync();
    if (mainComponent == null || mainComponent.removed || (!mainComponent.remote && mainComponent.parent == null)) {
      metadata.warnings.push(new Warning("Missing component.", node));
    }
  }
}

function checkWarningIfLine(node: SceneNode, metadata: NodeMetadata) {
  if (node.type === 'LINE') {
    metadata.warnings.push(new Warning("Line does not supported; use 'Outline stroke'.", node));
  }
}

function checkWarningIfMask(node: SceneNode, metadata: NodeMetadata) {
  type NodeWithMask = GroupNode | FrameNode | ComponentNode | InstanceNode | BooleanOperationNode | VectorNode | LineNode | RectangleNode

  const n = node as NodeWithMask;
  if (n != null && n.isMask) {
    metadata.warnings.push(new Warning("Mask does not supported.", node));
  }
}

function checkWarningIfHasRotation(node: SceneNode, metadata: NodeMetadata) {
  const n = node as NodeWithTransform;
  if (n != null && n.rotation > 0.001 || n.rotation < -0.001) {
    metadata.warnings.push(new Warning("Rotation does not supported.", node));
  }
}

async function createMetadataFromNodeAsync(node: BaseNode): Promise<NodeMetadata> {
  let metadata = new NodeMetadata();
  metadata.id = node.id;
  metadata.type = node.type;
  metadata.name = node.name;
  metadata.ignored = node.getPluginData(pluginData.ignored).toLowerCase() === 'true';
  metadata.bindingKey = node.getPluginData(pluginData.bindingKey);
  metadata.localizationKey = node.getPluginData(pluginData.localizationKey);
  metadata.componentType = node.getPluginData(pluginData.componentType);
  metadata.tags = node.getPluginData(pluginData.tags);

  if (node.type == 'INSTANCE') {
    const instanceNode = node as InstanceNode;
    const mainComponent = await instanceNode.getMainComponentAsync();

    if (mainComponent != null) {
      const isComponentSet = mainComponent.parent != null && mainComponent.parent.type == 'COMPONENT_SET';

      metadata.componentType = isComponentSet ?
        mainComponent.parent.getPluginData(pluginData.componentType) :
        mainComponent.getPluginData(pluginData.componentType);
    }
  }

  try {
    var componentData = JSON.parse(node.getPluginData(pluginData.componentData));
    metadata.componentData = componentData;
  } catch (e) { }

  return metadata;
}

function updateNodeByMetadata(node: BaseNode, metadata: NodeMetadata | null) {
  if (metadata != null) {
    node.setPluginData(pluginData.ignored, metadata.ignored ? 'true' : 'false');
    node.setPluginData(pluginData.bindingKey, metadata.bindingKey ? metadata.bindingKey : '');
    node.setPluginData(pluginData.localizationKey, metadata.localizationKey ? metadata.localizationKey : '');
    node.setPluginData(pluginData.tags, metadata.tags ? metadata.tags : '');
    node.setPluginData(pluginData.componentData, metadata.componentData ? JSON.stringify(metadata.componentData) : '');

    if (node.type == 'COMPONENT_SET' || node.type == 'COMPONENT') {
      node.setPluginData(pluginData.componentType, metadata.componentType ? metadata.componentType : '');
    }


    console.log('Selected node updated: ' + serializeMetadata(metadata));
  }
}

function updateBindingKeyForVariants(node: BaseNode) {

  updateDataForVariants(node, variant => {
    var bindingKey = node.getPluginData(pluginData.bindingKey);
    bindingKey = bindingKey ? bindingKey : '';
    variant.setPluginData(pluginData.bindingKey, bindingKey);

    console.log("Component set node binding key updated for: (" + variant.id + "," + variant.name + ")");
  })
}

function updateLocalizationKeyForVariants(node: BaseNode) {
  if (node.type !== 'TEXT')
    return;

  updateDataForVariants(node, variant => {
    var localizationKey = node.getPluginData(pluginData.localizationKey);
    localizationKey = localizationKey ? localizationKey : '';
    variant.setPluginData(pluginData.localizationKey, localizationKey);

    console.log("Component set node binding key updated for: (" + variant.id + "," + variant.name + ")");
  })
}

function updateDataForVariants(node: BaseNode, updateNode: (v: SceneNode) => void) {
  const path: number[] = [];
  const componentSet = findAttachedComponentSet(node, path);

  if (componentSet != null) {
    //console.log("Component set: " + componentSet?.name + " path: " + path);
    const variants = componentSet.children;


    for (let j = 0; j < variants.length; j++) {
      let target: NodeWithChildren = variants[j] as NodeWithChildren;

      for (let i = 2; i < path.length; i++) {
        if (i == path.length - 1) {
          const variant = target.children[path[i]];
          if (variant && variant.type === node.type) {
            updateNode(variant);
          }
        } else {
          target = target.children[path[i]] as NodeWithChildren;
        }
      }
    }
  }
}

function findAttachedComponentSet(node: BaseNode, path: number[]): ComponentSetNode | null {
  path.push(getSiblingIndex(node));

  for (let current = node.parent; current != null; current = current.parent) {

    path.push(getSiblingIndex(current));

    if (current.type === 'COMPONENT_SET') {
      path = path.reverse();
      return current;
    }
  }

  path = [];
  return null;
}

function getSiblingIndex(node: BaseNode): number {
  if (node.parent == null)
    return -1;

  var parent = node.parent as NodeWithChildren;
  if (parent != null) {
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i] == node) {
        return i;
      }
    }
  }

  return -1;
}
