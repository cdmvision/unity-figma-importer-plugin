export const events = {
  selectedNodeChanged: 'selectedNodeChanged',
  selectedNodeUpdated: 'selectedNodeUpdated',
  refreshUI: 'refreshUI',

  bindingKeyChange : 'bindingKeyChange',
  localizationKeyChange : 'localizationKeyChange',
  componentTypeChange : 'componentTypeChange',
  close: 'close'
};

export const pluginData = {
  bindingKey: 'bindingKey', 
  localizationKey: 'localizationKey',
  componentType: 'componentType',
  componentData: 'componentData'
};

export class NodeMetadata {
  public id: string;
  public type: string;
  public bindingKey: string;
  public localizationKey: string;
  public componentType: string;
  public componentData: object | null;

  constructor() {
    this.id = '';
    this.type = '';
    this.bindingKey = '';
    this.localizationKey = '';
    this.componentType = '';
    this.componentData = null;
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