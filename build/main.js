(() => {
  var __defProp = Object.defineProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@create-figma-plugin/utilities/lib/events.js
  function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function() {
      delete eventHandlers[id];
    };
  }
  function once(name, handler) {
    let done = false;
    return on(name, function(...args) {
      if (done === true) {
        return;
      }
      done = true;
      handler(...args);
    });
  }
  function invokeEventHandler(name, args) {
    for (const id in eventHandlers) {
      if (eventHandlers[id].name === name) {
        eventHandlers[id].handler.apply(null, args);
      }
    }
  }
  var eventHandlers, currentId, emit;
  var init_events = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
      eventHandlers = {};
      currentId = 0;
      emit = typeof window === "undefined" ? function(name, ...args) {
        figma.ui.postMessage([name, ...args]);
      } : function(name, ...args) {
        window.parent.postMessage({
          pluginMessage: [name, ...args]
        }, "*");
      };
      if (typeof window === "undefined") {
        figma.ui.onmessage = function([name, ...args]) {
          invokeEventHandler(name, args);
        };
      } else {
        window.onmessage = function(event) {
          const [name, ...args] = event.data.pluginMessage;
          invokeEventHandler(name, args);
        };
      }
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/ui.js
  function showUI(options, data) {
    if (typeof __html__ === "undefined") {
      throw new Error("No UI defined");
    }
    const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}<\/script>`;
    figma.showUI(html, options);
  }
  var init_ui = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
    }
  });

  // node_modules/@create-figma-plugin/utilities/lib/index.js
  var init_lib = __esm({
    "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
      init_events();
      init_ui();
    }
  });

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });
  function setSelectedNode(node) {
    var data = { nodeType: "", bindingKey: "", localizationKey: "", componentType: "" };
    if (node) {
      const bindingKey = node.getPluginData(PluginDataBindingKey);
      const localizationKey = node.getPluginData(PluginDataLocalizationKey);
      const componentType = node.getPluginData(PluginDataComponentTypeKey);
      data.nodeType = node.type;
      data.bindingKey = bindingKey;
      data.localizationKey = localizationKey;
      data.componentType = componentType;
    }
    const options = { width: 240, height: 230 };
    showUI(options, data);
    emit("SET_BINDING_KEY", data.bindingKey, data.nodeType);
    emit("SET_LOCALIZATION_KEY", data.localizationKey, data.nodeType);
    emit("SET_COMPONENT_TYPE", data.componentType, data.nodeType);
  }
  function main_default() {
    var node = figma.currentPage.selection[0];
    figma.on("selectionchange", function() {
      if (figma.currentPage.selection.length > 0) {
        node = figma.currentPage.selection[0];
        const nodeType = node.type;
        const bindingKey = node.getPluginData(PluginDataBindingKey);
        const localizationKey = node.getPluginData(PluginDataLocalizationKey);
        const componentType = node.getPluginData(PluginDataComponentTypeKey);
        emit("SET_BINDING_KEY", bindingKey, nodeType);
        emit("SET_LOCALIZATION_KEY", localizationKey, nodeType);
        emit("SET_COMPONENT_TYPE", componentType, nodeType);
      } else {
        emit("SET_BINDING_KEY", "", "");
        emit("SET_LOCALIZATION_KEY", "", "");
        emit("SET_COMPONENT_TYPE", "", "");
      }
    });
    on("SET_BINDING_KEY", function(bindingKey) {
      node.setPluginData(PluginDataBindingKey, bindingKey ? bindingKey : "");
    });
    on("SET_LOCALIZATION_KEY", function(localizationKey) {
      node.setPluginData(PluginDataLocalizationKey, localizationKey ? localizationKey : "");
    });
    on("SET_COMPONENT_TYPE", function(componentType) {
      node.setPluginData(PluginDataComponentTypeKey, componentType ? componentType : "");
    });
    once("CLOSE", function() {
      figma.closePlugin();
    });
    setSelectedNode(node);
  }
  var PluginDataBindingKey, PluginDataLocalizationKey, PluginDataComponentTypeKey;
  var init_main = __esm({
    "src/main.ts"() {
      init_lib();
      PluginDataBindingKey = "bindingKey";
      PluginDataLocalizationKey = "localizationKey";
      PluginDataComponentTypeKey = "componentType";
    }
  });

  // <stdin>
  var modules = { "src/main.ts--default": (init_main(), main_exports)["default"] };
  var commandId = true ? "src/main.ts--default" : figma.command;
  modules[commandId]();
})();
