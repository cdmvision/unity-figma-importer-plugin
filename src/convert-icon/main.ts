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

function convertToIcon(finalSize:number)
{
  const nodes = figma.currentPage.selection;
    
    if (nodes.length == 0) {
      figma.notify("There is no node selected.");
      return; 
    }
      
    const bounds = { xMin:Number.MAX_VALUE, yMin:Number.MAX_VALUE, xMax:Number.MIN_VALUE, yMax:Number.MIN_VALUE };

    for (const node of nodes) {
    
      if (node.x < bounds.xMin) {
        bounds.xMin = node.x;
      }

      if (node.y < bounds.yMin) {
        bounds.yMin = node.y;
      }

      const xMax = node.x + node.width;
      if (xMax > bounds.xMax) {
        bounds.xMax = xMax;
      }

      const yMax = node.y + node.height;
      if (yMax > bounds.yMax) {
        bounds.yMax = yMax;
      }
    }

    const width = bounds.xMax - bounds.xMin;
    const height = bounds.yMax - bounds.yMin;

    var size = Math.max(width, height);
    
    const ratio = 0.64;
    const iconSize = size / ratio;

    const componentNode = figma.createComponent();
    componentNode.name = nodes[0].name;
    componentNode.fills = [];
    componentNode.clipsContent = false;
    componentNode.constrainProportions = true;
    
    componentNode.x = bounds.xMin - (iconSize - width) * 0.5;
    componentNode.y = bounds.yMin - (iconSize - height) * 0.5;
    
    componentNode.resize(iconSize, iconSize);

    const vectorNode = figma.flatten(nodes, componentNode);
    vectorNode.name = "Vector";
    vectorNode.constraints = { horizontal:"SCALE", vertical:"SCALE" };
    vectorNode.fills = [ figma.util.solidPaint('#FFFFFFFF') ];

    componentNode.resize(finalSize, finalSize);

    figma.currentPage.selection = [ componentNode ];
}