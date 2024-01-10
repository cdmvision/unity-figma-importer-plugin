import {
  Container,
  Columns,
  render,
  Bold,
  Text,
  Textbox,
  VerticalSpace,
  TextboxAutocomplete,
  TextboxAutocompleteOption,
  TextboxColor,
  DropdownOption,
  Dropdown,
  Button,
  Toggle,
  Inline,
  IconButton,
  IconTarget32,
  IconSwap32,
  IconInfo32,
  Banner,
  Disclosure,
  IconWarning32,
  Divider
} from '@create-figma-plugin/ui'

import { emit } from '@create-figma-plugin/utilities'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata } from './types'


let metadata: NodeMetadata | null = null;

function emitNodeUpdated(repaint: boolean) {
  let metadataStr = serializeMetadata(metadata);
  emit(events.selectedNodeUpdated, metadataStr, repaint);
}

enum SliderDirection {
  LeftToRight = 'LeftToRight',
  RightToLeft = 'RightToLeft',
  BottomToTop = 'BottomToTop',
  TopToBottom = 'TopToBottom'
}

enum ProgressDirection {
  Horizontal = 'Horizontal',
  Vertical   = 'Vertical',
  Radial90   = 'Radial90',
  Radial180  = 'Radial180',
  Radial360  = 'Radial360'
}

enum ProgressBarOriginHorizontal {
  Left  = 'Left',
  Right = 'Right'
}

enum ProgressBarOriginVertical {
  Bottom = 'Bottom',
  Top    = 'Top'
}

enum ProgressBarOriginRadial90 {
  BottomLeft    = 'BottomLeft',
  TopLeft       = 'TopLeft',
  TopRight      = 'TopRight',
  BottomRight   = 'BottomRight'
}

enum ProgressBarOriginRadial180 {
  Bottom  = 'Bottom',
  Top     = 'Top',
  Left    = 'Left',
  Right   = 'Right'
}

enum ProgressBarOriginRadial360 {
  Bottom  = 'Bottom',
  Top     = 'Top',
  Left    = 'Left',
  Right   = 'Right'
}

export abstract class ComponentData {

  public updateData()
  {
    if (metadata != null) {
      if (metadata.componentData != null) {
        Object.assign(this, metadata.componentData);
      }
      
      metadata.componentData = this;
    }
  }

  abstract getType(): string;
  abstract getForm(): h.JSX.Element | null;
}

export class SelectableData extends ComponentData {
  getType(): string {
    return 'Selectable';
  }

  getForm(): h.JSX.Element | null {
    return null;
  }
}

export class ButtonData extends ComponentData {
  getType(): string {
    return 'Button';
  }

  getForm(): h.JSX.Element | null {
    return null;
  }
}

class ToggleData extends ComponentData {
  getType(): string {
    return 'Toggle';
  }

  getForm(): h.JSX.Element | null {
    return null;
  }
}

class ProgressBarData extends ComponentData {
  public direction: ProgressDirection = ProgressDirection.Horizontal;
  public originHorizontal: ProgressBarOriginHorizontal = ProgressBarOriginHorizontal.Left;
  public originVertical: ProgressBarOriginVertical = ProgressBarOriginVertical.Bottom;
  public originRadial90: ProgressBarOriginRadial90 = ProgressBarOriginRadial90.BottomLeft;
  public originRadial180: ProgressBarOriginRadial180 = ProgressBarOriginRadial180.Bottom;
  public originRadial360: ProgressBarOriginRadial360 = ProgressBarOriginRadial360.Bottom;
  public clockwise: boolean = false;

  getType(): string {
    return 'ProgressBar';
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(ProgressDirection).map(v => ({ value: v }));
    const [direction, setDirection] = useState<ProgressDirection>(this.direction);

    const originHorizontalOptions: Array<DropdownOption> = Object.values(ProgressBarOriginHorizontal).map(v => ({ value : v}));
    const [originHorizontal, setHorizontalOrigin] = useState<ProgressBarOriginHorizontal>(this.originHorizontal);

    const originVerticalOptions: Array<DropdownOption> = Object.values(ProgressBarOriginVertical).map(v => ({ value : v}));
    const [originVertical, setVerticalOrigin] = useState<ProgressBarOriginVertical>(this.originVertical);

    const originRadial90Options: Array<DropdownOption> = Object.values(ProgressBarOriginRadial90).map(v => ({ value : v}));
    const [originRadial90, setRadial90Origin] = useState<ProgressBarOriginRadial90>(this.originRadial90);

    const originRadial180Options: Array<DropdownOption> = Object.values(ProgressBarOriginRadial180).map(v => ({ value : v}));
    const [originRadial180, setRadial180Origin] = useState<ProgressBarOriginRadial180>(this.originRadial180);

    const originRadial360Options: Array<DropdownOption> = Object.values(ProgressBarOriginRadial360).map(v => ({ value : v}));
    const [originRadial360, setRadial360Origin] = useState<ProgressBarOriginRadial360>(this.originRadial360);

    const [clockwise, setClockwise] = useState<boolean>(this.clockwise);

    function getProgressBar() {
      return metadata?.componentData as ProgressBarData;
    }

    function handleDirectionInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ProgressDirection;
      setDirection(value);
      getProgressBar().direction = value;
      emitNodeUpdated(true);
    }

    function handleClockwise(event: JSX.TargetedEvent<HTMLInputElement>) {
      const checked = event.currentTarget.checked;
      setClockwise(checked);
      getProgressBar().clockwise = checked;
      emitNodeUpdated(false);
    }

    function handleOriginHorizontalInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ProgressBarOriginHorizontal;
      setHorizontalOrigin(value);
      getProgressBar().originHorizontal = value;
      emitNodeUpdated(false);
    }

    function handleOriginVerticalInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ProgressBarOriginVertical;
      setVerticalOrigin(value);
      getProgressBar().originVertical = value;
      emitNodeUpdated(false);
    }

    function handleOriginRadial90Input(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ProgressBarOriginRadial90;
      setRadial90Origin(value);
      getProgressBar().originRadial90 = value;
      emitNodeUpdated(false);
    }

    function handleOriginRadial180Input(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ProgressBarOriginRadial180;
      setRadial180Origin(value);
      getProgressBar().originRadial180 = value;
      emitNodeUpdated(false);
    }

    function handleOriginRadial360Input(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ProgressBarOriginRadial360;
      setRadial360Origin(value);
      getProgressBar().originRadial360 = value;
      emitNodeUpdated(false);
    }

    const layout: Array<JSX.Element> = [];

    layout.push(
      <Container space='extraSmall'>
        <VerticalSpace space='small' />
        <Text>Direction</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={handleDirectionInput} options={options} value={direction} />
        <VerticalSpace space="small" />
      </Container>
    );

    if (direction == ProgressDirection.Horizontal) {
      layout.push(
        <Container space='extraSmall'>
          <VerticalSpace space='small' />
          <Text>Origin</Text>
          <VerticalSpace space="small" />
          <Dropdown onChange={handleOriginHorizontalInput} options={originHorizontalOptions} value={originHorizontal} />
          <VerticalSpace space="small" />
        </Container>
      );
    } else if (direction == ProgressDirection.Vertical) {
      layout.push(
        <Container space='extraSmall'>
          <VerticalSpace space='small' />
          <Text>Origin</Text>
          <VerticalSpace space="small" />
          <Dropdown onChange={handleOriginVerticalInput} options={originVerticalOptions} value={originVertical} />
          <VerticalSpace space="small" />
        </Container>
      );
    } else if (direction == ProgressDirection.Radial90) {
      layout.push(
        <Container space='extraSmall'>
          <VerticalSpace space='small' />
          <Text>Origin</Text>
          <VerticalSpace space="small" />
          <Dropdown onChange={handleOriginRadial90Input} options={originRadial90Options} value={originRadial90} />
          <VerticalSpace space="small" />
        </Container>
      );
    } else if (direction == ProgressDirection.Radial180) {
      layout.push(
        <Container space='extraSmall'>
          <VerticalSpace space='small' />
          <Text>Origin</Text>
          <VerticalSpace space="small" />
          <Dropdown onChange={handleOriginRadial180Input} options={originRadial180Options} value={originRadial180} />
          <VerticalSpace space="small" />
        </Container>
      );
    } else if (direction == ProgressDirection.Radial360) {
      layout.push(
        <Container space='extraSmall'>
          <VerticalSpace space='small' />
          <Text>Origin</Text>
          <VerticalSpace space="small" />
          <Dropdown onChange={handleOriginRadial360Input} options={originRadial360Options} value={originRadial360} />
          <VerticalSpace space="small" />
        </Container>
      );
    }

    if (direction == ProgressDirection.Radial90 ||
        direction == ProgressDirection.Radial180 ||
        direction == ProgressDirection.Radial360) {
      layout.push(
        <Container space='extraSmall'>
          <VerticalSpace space="small" />
          <Toggle onChange={handleClockwise} value={clockwise}>
            <Text>Clockwise</Text>
          </Toggle>
          <VerticalSpace space="small" />
        </Container>
      );
    }

    return (<Container space='extraSmall'>{layout}</Container>);
  }
}

class SliderData extends ComponentData {
  public direction: SliderDirection = SliderDirection.LeftToRight;

  getType(): string {
    return 'Slider';
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(SliderDirection).map(v => ({ value: v }));
    const [direction, setDirection] = useState<SliderDirection>(this.direction);

    function getSlider() {
      return metadata?.componentData as SliderData;
    }

    function handleDirectionInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as SliderDirection;
      setDirection(value);
      getSlider().direction = value;
      emitNodeUpdated(false);
    }

    return (
      <Container space='extraSmall'>
        <VerticalSpace space='small' />
        <Text>Direction</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={handleDirectionInput} options={options} value={direction} />
        <VerticalSpace space="small" />
      </Container>
    )
  }
}

class ScrollbarData extends ComponentData {
  public direction: SliderDirection = SliderDirection.LeftToRight;

  getType(): string {
    return 'Scrollbar';
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(SliderDirection).map(v => ({ value: v }));
    const [direction, setDirection] = useState<SliderDirection>(this.direction);

    function getScrollbar() {
      return metadata?.componentData as ScrollbarData;
    }

    function handleDirectionInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as SliderDirection;
      setDirection(value);
      getScrollbar().direction = value;
      emitNodeUpdated(false);
    }

    return (
      <Container space='extraSmall'>
        <VerticalSpace space="small" />
        <Text>Direction</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={handleDirectionInput} options={options} value={direction} />
        <VerticalSpace space="small" />
      </Container>
    )
  }
}

enum ScrollViewVisibility {
  Permanent = 'Permanent',
  AutoHide = 'AutoHide',
  AutoHideAndExpandViewport = 'AutoHideAndExpandViewport'
}

class ScrollViewData extends ComponentData {
  public horizontalVisibility: ScrollViewVisibility = ScrollViewVisibility.AutoHideAndExpandViewport;
  public verticalVisibility: ScrollViewVisibility = ScrollViewVisibility.AutoHideAndExpandViewport;

  getType(): string {
    return 'ScrollView';
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(ScrollViewVisibility).map(v => ({ value: v }));
    const [horizontalVisibility, setHorizontalVisibility] = useState<ScrollViewVisibility>(this.horizontalVisibility);
    const [verticalVisibility, setVerticalVisibility] = useState<ScrollViewVisibility>(this.verticalVisibility);

    function getScrollView() {
      return metadata?.componentData as ScrollViewData;
    }

    function handleHorizontalVisibilityInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ScrollViewVisibility;
      setHorizontalVisibility(value);
      getScrollView().horizontalVisibility = value;
      emitNodeUpdated(false);
    }

    function handleVerticalVisibilityInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const value = event.currentTarget.value as ScrollViewVisibility;
      setVerticalVisibility(value);
      getScrollView().verticalVisibility = value;
      emitNodeUpdated(false);
    }

    return (
      <Container space='extraSmall'>
        <VerticalSpace space="small" />
        <Text>Horizontal Scrollbar Visibility</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={handleHorizontalVisibilityInput} options={options} value={horizontalVisibility} />
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Vertical Scrollbar Visibility</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={handleVerticalVisibilityInput} options={options} value={verticalVisibility} />
        <VerticalSpace space="small" />
      </Container>
    )
  }
}

class DropdownData extends ComponentData {
  getType(): string {
    return 'Dropdown';
  }

  getForm(): h.JSX.Element | null {
    return null;
  }
}

class InputFieldData extends ComponentData {
  public selectionColor: string = 'A8CEFF';
  public selectionColorOpacity: string = '75';
  public caretColor: string = '323232';
  public caretColorOpacity: string = '100';
  public caretWidth: number = 1;
  
  getType(): string {
    return 'InputField';
  }

  getForm(): h.JSX.Element | null {
    const [selectionColor, setSelectionColor] = useState<string>(this.selectionColor);
    const [selectionColorOpacity, setSelectionColorOpacity] = useState<string>(this.selectionColorOpacity);
    
    const [caretColor, setCaretColor] = useState<string>(this.caretColor);
    const [caretColorOpacity, setCaretColorOpacity] = useState<string>(this.caretColorOpacity);
    const [caretWidth, setCaretWidth] = useState<number>(this.caretWidth);

    const caretWidths: Array<DropdownOption> = [
      {value: '1'},
      {value: '2'},
      {value: '3'},
      {value: '4'},
      {value: '5'}
    ];

    function getInputField() {
      return metadata?.componentData as InputFieldData;
    }

    function handleSelectionColorInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      setSelectionColor(event.currentTarget.value);
      getInputField().selectionColor = event.currentTarget.value;
      emitNodeUpdated(false);
    }

    function handleSelectionColorOpacityInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      setSelectionColorOpacity(event.currentTarget.value);
      getInputField().selectionColorOpacity = event.currentTarget.value;
      emitNodeUpdated(false);
    }

    function handleCaretColorInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      setCaretColor(event.currentTarget.value);
      getInputField().caretColor = event.currentTarget.value;
      emitNodeUpdated(false);
    }

    function handleCaretColorOpacityInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      setCaretColorOpacity(event.currentTarget.value);
      getInputField().caretColorOpacity = event.currentTarget.value;
      emitNodeUpdated(false);
    }

    function handleCaretWidthInput(value: string) {
      var intValue = parseInt(value);

      setCaretWidth(intValue);
      getInputField().caretWidth = intValue;
      emitNodeUpdated(false);
    }

    return (
      <Container space='extraSmall'>
        <VerticalSpace space="small" />
        <Text>Selection Color</Text>
        <VerticalSpace space="small" />
        <TextboxColor hexColor={selectionColor} onHexColorInput={handleSelectionColorInput} onOpacityInput={handleSelectionColorOpacityInput} opacity={selectionColorOpacity} revertOnEscapeKeyDown/>
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Caret Color</Text>
        <VerticalSpace space="small" />
        <TextboxColor hexColor={caretColor} onHexColorInput={handleCaretColorInput} onOpacityInput={handleCaretColorOpacityInput} opacity={caretColorOpacity} revertOnEscapeKeyDown/>
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Caret Width</Text>
        <VerticalSpace space="small" />
        <Dropdown options={caretWidths} onValueChange={handleCaretWidthInput} value={caretWidth.toString()} />
      </Container>
    )
  }
}

function drawTitleField(): h.JSX.Element | null {
  if (metadata != null)
  {
    return (
      <Container space='small'>
      <VerticalSpace space="large" />
        <Text align="left"><Bold>{metadata.name} ({metadata.type})</Bold></Text>
        <VerticalSpace space="small" />
      </Container>
    )
  }

  return null;
}

function drawIgnoredField(): h.JSX.Element | null {
  const [ignored, setIgnored] = useState<boolean>(metadata != null ? metadata.ignored : false);

  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata != null)
    {
      metadata.ignored = event.currentTarget.checked;
      setIgnored(metadata.ignored);
      emitNodeUpdated(true);
    }
  }

  return (
    <Container space='small'>
      <VerticalSpace space="small" />
      <Toggle onChange={handleChange} value={ignored}>
        <Text>Ignored</Text>
      </Toggle>
      <VerticalSpace space="small" />
    </Container>
  )
}

function drawBindingKeyField(): h.JSX.Element | null {
  const [bindingKey, setBindingKey] = useState<string>(metadata != null ? metadata.bindingKey : '');
  
  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata != null)
    {
      metadata.bindingKey = event.currentTarget.value;
      setBindingKey(metadata.bindingKey);
      emitNodeUpdated(false);
    }
  }

  return (
    <Container space='small'>
      <VerticalSpace space="small" />
      <Text>Binding Key</Text>
      <VerticalSpace space="small" />
      <Textbox variant="border" onChange={handleInput} value={bindingKey}/>
      <VerticalSpace space="small" />
    </Container>
  )
}

function drawLocalizationKeyField(): h.JSX.Element | null {
  const [localizationKey, setLocalizationKey] = useState<string>(metadata != null ? metadata.localizationKey : '');
  
  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata != null)
    {
      metadata.localizationKey = event.currentTarget.value;
      setLocalizationKey(metadata.localizationKey);
      emitNodeUpdated(false);
    }
  }

  const isText: boolean = metadata == null ? false : metadata.type == 'TEXT';
  if (isText)
  {
    return (
      <Container space='small'>
        <VerticalSpace space="small" />
        <Text>Localization Key</Text>
        <VerticalSpace space="small" />
        <Textbox variant="border" onChange={handleInput} value={localizationKey}/>
        <VerticalSpace space="small" />
      </Container>
    )
  }
  
  return null;
}

function drawTagsField(): h.JSX.Element | null {
  const [tags, setTags] = useState<string>(metadata != null ? metadata.tags : '');
  
  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata != null)
    {
      metadata.tags = event.currentTarget.value;
      setTags(metadata.tags);
      emitNodeUpdated(false);
    }
  }

  return (
    <Container space='small'>
      <VerticalSpace space="small" />
      <Text>Tags</Text>
      <VerticalSpace space="small" />
      <Textbox variant="border" onChange={handleInput} value={tags}/>
      <VerticalSpace space="small" />
    </Container>
  );
}

function drawCreateIcon(): h.JSX.Element | null {
  function handleClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    emit(events.convertIcon);
  }

  const isNotSupported: boolean = 
    metadata == null || 
    metadata.type == 'PAGE' || 
    metadata.type == 'TEXT' || 
    metadata.type == 'COMPONENT_SET';
  
  if (isNotSupported) {
    return null;
  }

  return (
    <Button onClick={handleClick} secondary>
      Convert to Icon
    </Button>
  );
}

function drawExtraControls(): h.JSX.Element | null {
  
  return drawCreateIcon();
}


function drawWarningsField(): h.JSX.Element | null {
  const [expand, setExpand] = useState<boolean>(false);

  function handleClick(event: JSX.TargetedMouseEvent<HTMLInputElement>) {
    if (!(expand === true)) {
      setExpand(true);
      emit(events.showWarnings);
    } else {
      setExpand(false);
      emit(events.hideWarnings);
    }
  }

  function goToNode(nodeId: string) {
    emit(events.selectNode, nodeId);
  }

  if (metadata != null && metadata.warnings.length > 0)
  {
    const layout: Array<JSX.Element> = [];

    if (metadata.type === 'PAGE') {
      metadata.warnings.forEach(warning => {
        layout.push(<Inline space='extraSmall'><IconButton onClick={() => goToNode(warning.nodeId)} title="Select element"><IconTarget32/></IconButton><Text height={32}>{warning.nodeName}</Text></Inline>);
      });

      const style = { height: '64px' }
      return (
        <div style={style}>
          <Disclosure onClick={handleClick} open={expand} title={'Warnings (' + metadata.warnings.length + ')'}>
            {layout}
          </Disclosure>
        </div>
      )
    }
    
    metadata.warnings.forEach(warning => {
      layout.push(<div>{warning.message}</div>);
    });

    return (<Banner icon={<IconWarning32 />} variant="warning">{layout}</Banner>)
  }

  return null;
}

function drawComponentTypeField() : h.JSX.Element | null {
  const [componentType, setComponentType] = useState<string>(metadata != null ? metadata.componentType : '');
  
  const options: Array<TextboxAutocompleteOption> = [];

  const components: Array<ComponentData> = [
    new SelectableData(),
    new ButtonData(),
    new ToggleData(),
    new InputFieldData(),
    new DropdownData(),
    new SliderData(),
    new ProgressBarData(),
    new ScrollViewData(),
    new ScrollbarData(),
  ];

  components.forEach(component => {
    options.push({ value: component.getType() });
  });


  const isComponent: boolean = metadata == null ? false : metadata.type == 'COMPONENT';
  const isComponentSet: boolean = metadata == null ? false : metadata.type == 'COMPONENT_SET';
  const isInstance: boolean = metadata == null ? false : metadata.type == 'INSTANCE';

  let componentForm: JSX.Element | null = null;

  if (isComponent || isComponentSet)
  {
    var component = components.find(x => x.getType() == metadata?.componentType);
    if (component)
    {
      component.updateData();
      componentForm = component.getForm();
    }
  }

  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata != null)
    {
      metadata.componentType = event.currentTarget.value;
      setComponentType(metadata.componentType);

      const isRepaintNeeded = components.findIndex(x => x.getType() == metadata?.componentType) >= 0;
      emitNodeUpdated(isRepaintNeeded); 
    }
  }

  function clearComponentData(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    if (metadata != null) {
      metadata.componentData = null;
      emitNodeUpdated(true);
    }
  }

  if (isComponentSet || isComponent)
  {
    return (
      <Container space='small'>
        <VerticalSpace space="small" />
        <Text>Component Type</Text>
        <VerticalSpace space="small" />

        <Columns space="extraSmall">
          <TextboxAutocomplete variant="border" onInput={handleInput} value={componentType} options={options} />
          <IconButton onClick={clearComponentData} title="Reset Component"><IconSwap32/></IconButton>
        </Columns>
        
        <VerticalSpace space="medium" />
        {componentForm != null ? componentForm: null}
      </Container>
    )
  }
  else if (isInstance)
  {
    return (
      <Container space="small">
        <VerticalSpace space="small" />
        <Text>Component Type</Text>
        <VerticalSpace space="small" />
        <Textbox variant="border" value={componentType} disabled />
        <VerticalSpace space="small" />
      </Container>
    );
  }

  return null;
}

function Plugin(data: { metadataJson: string} ) {

  const layout: Array<JSX.Element> = [];
  metadata = deserializeMetadata(data.metadataJson);

  //console.log('Node: ' + data.metadataJson);

  if (metadata != null)
  {
    var titleField = drawTitleField();
    if (titleField != null) {
      layout.push(titleField);
    }

    var bindingKeyField = drawBindingKeyField();
    if (bindingKeyField != null) {
      layout.push(bindingKeyField);
    }
    
    var localizationKeyField = drawLocalizationKeyField();
    if (localizationKeyField != null) {
      layout.push(localizationKeyField);
    }

    var componenTypeField = drawComponentTypeField();
    if (componenTypeField != null) {
      layout.push(componenTypeField);
    }

    var tagsField = drawTagsField();
    if (tagsField != null) {
      layout.push(tagsField);
    }

    var ignoredField = drawIgnoredField();
    if (ignoredField != null) {
      layout.push(ignoredField);
    }

    var warningsField = drawWarningsField();
    if (warningsField != null) {
      layout.push(warningsField);
    }
  } else {
    layout.push(
      <Container space='small'>
      <VerticalSpace space="small" />
      <Banner icon={<IconInfo32 />}>Select a node.</Banner>
      <VerticalSpace space="small" />
    </Container>
    );
  }

  /*function onWindowResize(windowSize: { width: number; height: number }) {
    emit('RESIZE_WINDOW', windowSize)
  }

  useWindowResize(onWindowResize, {
    minWidth: 240,
    minHeight: 240,
    maxWidth: 320,
    maxHeight: 500
  })*/

  var extraControls = drawExtraControls();
  if (extraControls != null) {
    layout.push(<Divider />);
    layout.push(<VerticalSpace space="extraSmall" />);
    layout.push(extraControls);
  }

  return (<Container space='extraSmall'>{layout}</Container>)
}

export default render(Plugin);

