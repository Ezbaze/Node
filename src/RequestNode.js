import { Node } from "@baklavajs/core";
import axios from "axios";

export class RequestNode extends Node {
    constructor() {
        super();
        this.type = "RequestNode";
        this.name = "Request";
        this.addInputInterface("URL", "InputOption");
        this.addOption("Operation", "SelectOption", "GET", undefined, {
            items: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        });
        this.addOutputInterface("Result");
    }

    calculate() {
        const URL = this.getInterface("URL").value;
        const operation = this.getOptionValue("Operation");
        var result;
        if (operation === "GET") {
            axios.get(URL).then(response => {
                result = response.data;
                this.getInterface("Result").value = result;
            });
            console.log(result);
        } else if (operation === "POST") {
            axios.post(URL).then(response => {
                result = response.data;
            });
        }
    }
}
