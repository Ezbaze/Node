import { Node } from "@baklavajs/core";

export class InputNode extends Node {
    constructor() {
        super();
        this.type = "InputNode";
        this.name = "Input";
        this.addInputInterface("Integer", "NumberOption", 1);
        this.addOutputInterface("Result");
    }

    calculate() {
        const n1 = this.getInterface("Integer").value;

        this.getInterface("Result").value = n1;
    }
}
