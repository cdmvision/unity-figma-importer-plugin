import {
  useWindowResize,
  Container,
  render,
  Text,
  Textbox,
  VerticalSpace,
  TextboxAutocomplete,
  TextboxAutocompleteOption,
  TextboxColor,
  TextboxNumeric,
  DropdownOption,
  Dropdown,
  Button,
  IconInfo32,
  Banner,
  Divider,
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
      <Container>
        <VerticalSpace space="small" />
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
      <Container>
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
      <Container>
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

    const caretWidths: Array<DropdownOption<number>> = [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
      {value: 5}
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

    function handleCaretWidthInput(value: number) {
      setCaretWidth(value);
      getInputField().caretWidth = value;
      emitNodeUpdated(false);
    }

    return (
      <Container>
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
        <Dropdown options={caretWidths} onValueChange={handleCaretWidthInput} value={caretWidth} />
      </Container>
    )
  }
}

function Plugin(data: { metadataJson: string} ) {

  const layout: Array<JSX.Element> = [];
  metadata = deserializeMetadata(data.metadataJson);

  //console.log('Node: ' + data.metadataJson);

  if (metadata != null)
  {
    // Initialize components.
    const components: Array<ComponentData> = [
      new ButtonData(),
      new ToggleData(),
      new InputFieldData(),
      new DropdownData(),
      new SliderData(),
      new ScrollViewData(),
      new ScrollbarData(),
    ];

    let componentForm: JSX.Element | null = null;

    const isComponent: boolean = metadata.type == 'COMPONENT';
    const isComponentSet: boolean = metadata.type == 'COMPONENT_SET';
    const isInstance: boolean = metadata.type == 'INSTANCE';

    if (isComponent || isComponentSet)
    {
      var component = components.find(x => x.getType() == metadata?.componentType);
      if (component)
      {
        component.updateData();
        componentForm = component.getForm();
      }
    }

    layout.push(
      <Container>
          <VerticalSpace space="large" />
          <Text>Binding Key</Text>
          <VerticalSpace space="small" />
          <Textbox id={pluginData.bindingKey} onChange={setBindingKey} value={metadata != null ? metadata.bindingKey : ''}/>
          <VerticalSpace space="small" />
        </Container>
    );
  
    const isText: boolean = metadata.type == 'TEXT';
    if (isText)
    {
      layout.push(
        <Container>
        <VerticalSpace space="small" />
        <Text>Localization Key</Text>
        <VerticalSpace space="small" />
        <Textbox id={pluginData.localizationKey} onChange={setLocalizationKey} value={metadata != null ? metadata.localizationKey : ''}/>
        <VerticalSpace space="small" />
      </Container>
      );
    }


    if (isComponentSet || isComponent)
    {
      const options: Array<TextboxAutocompleteOption> = [];
      components.forEach(component => {
        options.push({ value: component.getType() });
      });


      layout.push(
        <Container>
        <VerticalSpace space="small" />
        <Text>Component Type</Text>
        <VerticalSpace space="small" />
        <TextboxAutocomplete id={pluginData.componentType} onInput={setComponentType} value={metadata != null ? metadata.componentType : ''} options={options} />
        <VerticalSpace space="small" />
      </Container>
      );
    }

    if (isInstance)
    {
      layout.push(
        <Container>
        <VerticalSpace space="small" />
        <Text>Component Type</Text>
        <VerticalSpace space="small" />
        <Textbox id={pluginData.componentType} onInput={setComponentType} value={metadata != null ? metadata.componentType : ''} disabled />
        <VerticalSpace space="small" />
      </Container>
      );
    }

    if (componentForm != null)
    {
      layout.push(
        <Container>
          <VerticalSpace space="small" />
          <Divider />
          <VerticalSpace space="small" />
        </Container>
        );
      layout.push(componentForm);
    }

    layout.push(
      <Container>
        <VerticalSpace space="small" />
        <Button fullWidth onClick={clearComponentData}>Revert to Default</Button>
        <VerticalSpace space="small" />
      </Container>
    );
  } else {
    layout.push(
      <Container>
      <VerticalSpace space="small" />
      <Banner icon={<IconInfo32 />}>Select a node.</Banner>
      <VerticalSpace space="small" />
    </Container>
    );
  }

  function clearComponentData(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    if (metadata)
    {
      metadata.componentData = null;
      emitNodeUpdated(true);
    }
  }

  function setBindingKey(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata)
    {
      metadata.bindingKey = event.currentTarget.value;
      emitNodeUpdated(false);
    }
  }

  function setLocalizationKey(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata)
    {
      metadata.localizationKey = event.currentTarget.value;
      emitNodeUpdated(false);
    }
  }

  function setComponentType(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata)
    {
      metadata.componentType = event.currentTarget.value;
      emitNodeUpdated(true);
    }
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

  return (<Container>{layout}</Container>)
}

export default render(Plugin);

