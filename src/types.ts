export const events = {
  selectedNodeUpdated: 'selectedNodeUpdated',
  refreshUI: 'refreshUI',
  selectNode: 'selectNode'
};

export const pluginData = {
  bindingKey: 'bindingKey', 
  localizationKey: 'localizationKey',
  componentType: 'componentType',
  componentData: 'componentData',
  tags: 'tags',
  ignore: 'ignore'
};

export class Warning {
  public message: string;
  public node: SceneNode;
  public nodeId: string;
  public nodeName: string;

  constructor(message: string, node: SceneNode) {
    this.message = message;
    this.node = node;
    this.nodeId = node.id;
    this.nodeName = node.name;
  }
}

export class NodeMetadata {
  public id: string;
  public type: string;
  public name: string;
  public ignore:boolean;
  public bindingKey: string;
  public localizationKey: string;
  public componentType: string;
  public componentData: object | null;
  public tags: string;

  public warnings: Warning[];

  constructor() {
    this.id = '';
    this.type = '';
    this.name = '';
    this.ignore = false;
    this.bindingKey = '';
    this.localizationKey = '';
    this.componentType = '';
    this.componentData = null;
    this.tags = '';
    this.warnings = [];
  }
}

export function serializeMetadata(metadata: NodeMetadata | null) : string {
    return JSON.stringify(metadata);
}

export function deserializeMetadata(json: string): NodeMetadata | null {
  if (json != null && json.length > 0)
  {
    return <NodeMetadata> JSON.parse(json);
  }
  return null;
}