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
} from '@create-figma-plugin/ui'

import { on, emit } from '@create-figma-plugin/utilities'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import { deserializeMetadata, events, NodeMetadata, pluginData, serializeMetadata } from './types'

enum SliderDirection {
  LeftToRight = 'Left To Right',
  RightToLeft = 'Right To Left',
  BottomToTop = 'Bottom To Top',
  TopToBottom = 'Top To Bottom'
}

export abstract class ComponentData {
  public metadata: NodeMetadata | null = null;

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

    function setDirection(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value as SliderDirection;
      console.log(newValue)
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

class ScrollbarData extends ComponentData {
  public direction: SliderDirection = SliderDirection.LeftToRight;

  getType(): string {
    return 'Scrollbar';
  }

  getForm(): h.JSX.Element | null {
    const options: Array<DropdownOption> = Object.values(SliderDirection).map(v => ({ value: v }));

    function setDirection(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value  as SliderDirection;
      console.log(newValue)
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
      const newValue = event.currentTarget.value  as ScrollViewVisibility;
      console.log(newValue)
    }

    
    function setVerticalVisibility(event: JSX.TargetedEvent<HTMLInputElement>) {
      const newValue = event.currentTarget.value  as ScrollViewVisibility;
      console.log(newValue)
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

  private handleHexColorInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newHexColor = event.currentTarget.value;
    console.log(newHexColor);
    this.selectionColor = newHexColor;
  }
  private handleOpacityInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newOpacity = event.currentTarget.value;
    console.log(newOpacity);
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
        <TextboxColor hexColor={this.selectionColor} onHexColorInput={this.handleHexColorInput} onOpacityInput={this.handleOpacityInput} opacity={this.selectionColorOpacity} revertOnEscapeKeyDown/>
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Caret Color</Text>
        <VerticalSpace space="small" />
        <TextboxColor hexColor={this.caretColor} opacity={this.caretColorOpacity} revertOnEscapeKeyDown/>
        <VerticalSpace space="small" />

        <VerticalSpace space="small" />
        <Text>Caret Width</Text>
        <VerticalSpace space="small" />
        <Dropdown options={caretWidths} value={this.caretWidth} />
      </Container>
    )
  }
}

const components: Array<ComponentData> = [
  new ButtonData(),
  new ToggleData(),
  new InputFieldData(),
  new DropdownData(),
  new SliderData(),
  new ScrollViewData(),
  new ScrollbarData(),
];

function Plugin(data: { metadataJson: string} ) {

  const layout: Array<JSX.Element> = [];
  const metadata: NodeMetadata | null = deserializeMetadata(data.metadataJson);

  console.log('Initial node: ' + data.metadataJson);

  if (metadata != null)
  {
    let componentForm: JSX.Element | null = null;
    var component = components.find(x => x.getType() == metadata?.componentType);
    if (component)
    {
      componentForm = component.getForm();
      if (componentForm)
      {
        console.log("Component form: " + component.getType());
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

  } else {
    layout.push(
      <Container>
      <VerticalSpace space="small" />
      <Text>Select a node.</Text>
      <VerticalSpace space="small" />
    </Container>
    );
  }

  function emitNodeUpdated() {
    let metadataStr = serializeMetadata(metadata);
    console.log('Selected node updated, metadata: ' + metadataStr);
    emit(events.selectedNodeUpdated, metadataStr);
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

