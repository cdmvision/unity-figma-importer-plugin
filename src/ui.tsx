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
} from '@create-figma-plugin/ui'

import { on, emit } from '@create-figma-plugin/utilities'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata } from './types'


let metadata: NodeMetadata | null = null;

function emitNodeUpdated() {
  let metadataStr = serializeMetadata(metadata);
  console.log('Selected node updated, metadata: ' + metadataStr);
  emit(events.selectedNodeUpdated, metadataStr);
}

enum SliderDirection {
  LeftToRight = 'Left To Right',
  RightToLeft = 'Right To Left',
  BottomToTop = 'Bottom To Top',
  TopToBottom = 'Top To Bottom'
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

  private setDirection(event: JSX.TargetedEvent<HTMLInputElement>) {
    var slider = metadata?.componentData as SliderData;
    slider.direction = event.currentTarget.value as SliderDirection;
    emitNodeUpdated();
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(SliderDirection).map(v => ({ value: v }));

    return (
      <Container>
        <VerticalSpace space="small" />
        <Text>Direction</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={this.setDirection} options={options} value={this.direction} />
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

    function setDirection(event: JSX.TargetedEvent<HTMLInputElement>) {
      var scrollbar = metadata?.componentData as ScrollbarData;
      scrollbar.direction = event.currentTarget.value as SliderDirection;
      emitNodeUpdated();
    }

    return (
      <Container>
        <VerticalSpace space="small" />
        <Text>Direction</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={setDirection} options={options} value={this.direction} />
        <VerticalSpace space="small" />
      </Container>
    )
  }
}

enum ScrollViewVisibility {
  Permanent = 'Permanent',
  AutoHide = 'Auto Hide',
  AutoHideAndExpandViewport = 'Auto Hide and Expand Viewport'
}

class ScrollViewData extends ComponentData {
  public horizontalVisibility: ScrollViewVisibility = ScrollViewVisibility.AutoHideAndExpandViewport;
  public verticalVisibility: ScrollViewVisibility = ScrollViewVisibility.AutoHideAndExpandViewport;

  getType(): string {
    return 'ScrollView';
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(ScrollViewVisibility).map(v => ({ value: v }));

    function setHorizontalVisibility(event: JSX.TargetedEvent<HTMLInputElement>) {
      var scrollView = metadata?.componentData as ScrollViewData;
      scrollView.horizontalVisibility = event.currentTarget.value as ScrollViewVisibility;
      emitNodeUpdated();
    }

    function setVerticalVisibility(event: JSX.TargetedEvent<HTMLInputElement>) {
      var scrollView = metadata?.componentData as ScrollViewData;
      scrollView.verticalVisibility = event.currentTarget.value as ScrollViewVisibility;
      emitNodeUpdated();
    }

    return (
      <Container>
        <VerticalSpace space="small" />
        <Text>Horizontal Scrollbar Visibility</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={setHorizontalVisibility} options={options} value={this.horizontalVisibility} />
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Vertical Scrollbar Visibility</Text>
        <VerticalSpace space="small" />
        <Dropdown onChange={setVerticalVisibility} options={options} value={this.verticalVisibility} />
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

  private setSelectionColor(event: JSX.TargetedEvent<HTMLInputElement>) {
    var inputField = metadata?.componentData as InputFieldData;
    inputField.selectionColor = event.currentTarget.value;
    emitNodeUpdated();
  }

  private setSelectionColorOpacity(event: JSX.TargetedEvent<HTMLInputElement>) {
    var inputField = metadata?.componentData as InputFieldData;
    inputField.selectionColorOpacity = event.currentTarget.value;
    emitNodeUpdated();
  }

  private setCaretColor(event: JSX.TargetedEvent<HTMLInputElement>) {
    var inputField = metadata?.componentData as InputFieldData;
    inputField.caretColor = event.currentTarget.value;
    emitNodeUpdated();
  }

  private setCaretColorOpacity(event: JSX.TargetedEvent<HTMLInputElement>) {
    var inputField = metadata?.componentData as InputFieldData;
    inputField.caretColorOpacity = event.currentTarget.value;
    emitNodeUpdated();
  }

  private setCaretWidth(event: JSX.TargetedEvent<HTMLInputElement>) {

    var inputField = metadata?.componentData as InputFieldData;
    inputField.caretWidth = parseInt(event.currentTarget.value);
    emitNodeUpdated();
  }

  getType(): string {
    return 'InputField';
  }

  getForm(): h.JSX.Element | null {
    const caretWidths: Array<DropdownOption<number>> = [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
      {value: 5}
    ];

    function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value
      console.log(newValue)
    }

    return (
      <Container>
        <VerticalSpace space="small" />
        <Text>Selection Color</Text>
        <VerticalSpace space="small" />
        <TextboxColor hexColor={this.selectionColor} onHexColorInput={this.setSelectionColor} onOpacityInput={this.setSelectionColorOpacity} opacity={this.selectionColorOpacity} revertOnEscapeKeyDown/>
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Caret Color</Text>
        <VerticalSpace space="small" />
        <TextboxColor hexColor={this.caretColor} onHexColorInput={this.setCaretColor} onOpacityInput={this.setCaretColorOpacity} opacity={this.caretColorOpacity} revertOnEscapeKeyDown/>
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Caret Width</Text>
        <VerticalSpace space="small" />
        <Dropdown options={caretWidths} onChange={this.setCaretWidth} value={this.caretWidth} />
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
    var component = components.find(x => x.getType() == metadata?.componentType);
    if (component)
    {
      component.updateData();
      componentForm = component.getForm();
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
  
    if (metadata.type == 'TEXT')
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
  
    if (metadata.type == 'COMPONENT_SET' || metadata.type == 'COMPONENT' || metadata.type == 'INSTANCE')
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
        <TextboxAutocomplete id={pluginData.componentType} onInput={setComponentType} value={metadata != null ? metadata.componentType : ''} options={options}/>
        <VerticalSpace space="small" />
      </Container>
      );
    }

    if (componentForm != null)
    {
      layout.push(componentForm);
    }

    layout.push(
      <Container>
        <VerticalSpace space="small" />
        <Button onClick={clearComponentData}>Revert to Default</Button>
        <VerticalSpace space="small" />
      </Container>
    );
  } else {
    layout.push(
      <Container>
      <VerticalSpace space="small" />
      <Text>Select a node.</Text>
      <VerticalSpace space="small" />
    </Container>
    );
  }

  function clearComponentData(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    if (metadata)
    {
      metadata.componentData = null;
      emitNodeUpdated();
    }
  }

  function setBindingKey(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata)
    {
      metadata.bindingKey = event.currentTarget.value;
      emitNodeUpdated();
    }
  }

  function setLocalizationKey(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata)
    {
      metadata.localizationKey = event.currentTarget.value;
      emitNodeUpdated();
    }
  }

  function setComponentType(event: JSX.TargetedEvent<HTMLInputElement>) {
    if (metadata)
    {
      metadata.componentType = event.currentTarget.value;
      emitNodeUpdated();
    }
  }

  function onWindowResize(windowSize: { width: number; height: number }) {
    emit('RESIZE_WINDOW', windowSize)
  }

  useWindowResize(onWindowResize, {
    minWidth: 240,
    minHeight: 240,
    maxWidth: 320,
    maxHeight: 500
  })

  return (<Container>{layout}</Container>)
}

export default render(Plugin);

