import { Component, OnInit } from "@angular/core";
import * as fs from "tns-core-modules/file-system";


@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    htmlString: string = "~/chart.html";
public webViewSRC: string = encodeURI(`${fs.knownFolders.currentApp().path}/chart.html`);


    constructor() {
    }

    ngOnInit(): void {
    }
}
