<template>
    <div style="height: 100vh; width: 100vw">
        <hint-overlay />
        <baklava-editor :plugin="viewPlugin" />
    </div>
</template>

<script>
import HintOverlay from "./HintOverlay.vue";
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { Engine } from "@baklavajs/plugin-engine";
import { MathNode } from "./MathNode";
import { InputNode } from "./InputNode";
import { RequestNode } from "./RequestNode";
import { DisplayNode } from "./DisplayNode";
import { textAreaOption } from "./textAreaOption.vue";

export default {
    components: { HintOverlay },
    data() {
        return {
            editor: new Editor(),
            viewPlugin: new ViewPlugin(),
            engine: new Engine(true)
        };
    },
    created() {
        // Register the plugins
        // The view plugin is used for rendering the nodes
        this.editor.use(this.viewPlugin);
        // The option plugin provides some default option UI elements
        this.editor.use(new OptionPlugin());
        // The engine plugin calculates the nodes in the graph in the
        // correct order using the "calculate" methods of the nodes
        this.editor.use(this.engine);

        // Show a minimap in the top right corner
        this.viewPlugin.enableMinimap = true;

        this.viewPlugin.registerOption("MyOption", textAreaOption);

        // register the nodes we have defined, so they can be
        // added by the user as well as saved & loaded.
        this.editor.registerNodeType("MathNode", MathNode);
        this.editor.registerNodeType("InputNode", InputNode);
        this.editor.registerNodeType("RequestNode", RequestNode);
        this.editor.registerNodeType("DisplayNode", DisplayNode);

        // add some nodes so the screen is not empty on startup
        const node1 = this.addNodeWithCoordinates(MathNode, 100, 140);
        const node2 = this.addNodeWithCoordinates(DisplayNode, 400, 140);
        const node3 = this.addNodeWithCoordinates(RequestNode, 100, 450);
        node3.getInterface("URL").value = "https://jsonplaceholder.typicode.com/todos/1";
        const node4 = this.addNodeWithCoordinates(DisplayNode, 400, 450);
        this.editor.addConnection(node1.getInterface("Result"), node2.getInterface("Value"));
        this.editor.addConnection(node3.getInterface("Result"), node4.getInterface("Value"));
        this.engine.calculate();
    },
    methods: {
        addNodeWithCoordinates(nodeType, x, y) {
            const n = new nodeType();
            this.editor.addNode(n);
            n.position.x = x;
            n.position.y = y;
            return n;
        }
    }
};
</script>