export default function (s?:Number) {
  figma.parameters.on(
    'input',
    ({ parameters, key, query, result }: ParameterInputEvent) => {
      switch (key) {
        case 'size':
          const icons = [
            '24',
            '32',
            '48',
            '64',
            '96',
            '128',
            '256',
            '512',
          ]
          result.setSuggestions(icons.filter(s => s.includes(query)));
          break;

        default:
          return;
      }
    }
  )

  figma.on('run', ({ command, parameters }: RunEvent) => {
    if (!parameters || !parameters.size)
    {
      parameters = { size: "24" };
    }
    
    convertToIcon(parseFloat(parameters.size));
    figma.closePlugin();
  });
}

function convertToIcon(iconSize:number)
{
  const nodes = figma.currentPage.selection;
    
    if (nodes.length == 0) {
      figma.notify("There is no node selected.");
      return;
    }
      
    const position = { x:Number.MAX_VALUE, y:Number.MAX_VALUE};

    for (const node of nodes) {
    
      if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
        
        figma.notify("'"+ node.type + "' node is not supported.");
        return;
      }

      if (node.x < position.x) {
        position.x = node.x;
      }

      if (node.y < position.y) {
        position.y = node.y;
      }
    }

    const componentNode = figma.createComponent();
    componentNode.name = nodes[0].name;
    componentNode.fills = [];
    componentNode.clipsContent = false;
    componentNode.constrainProportions = true;
    
    componentNode.x = position.x;
    componentNode.y = position.y;
    
    componentNode.resize(iconSize, iconSize);

    const vectorNode = figma.flatten(nodes, componentNode);
    vectorNode.name = "Vector";
    vectorNode.constraints = { horizontal:"SCALE", vertical:"SCALE" };
    vectorNode.fills = [ figma.util.solidPaint('#FFFFFFFF') ];

    const ratio = 0.64;
    const size = iconSize * ratio;

    const max = Math.max(vectorNode.width, vectorNode.height);
    const vectorSizeRatio = size / max;
    const vectorWidth = vectorNode.width * vectorSizeRatio;
    const vectorHeight = vectorNode.height * vectorSizeRatio;

    vectorNode.resizeWithoutConstraints(vectorWidth, vectorHeight);
    vectorNode.x = (iconSize - vectorWidth) * 0.5;
    vectorNode.y = (iconSize - vectorHeight) * 0.5;

    figma.currentPage.selection = [ componentNode ];
}