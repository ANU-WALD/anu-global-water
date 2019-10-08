import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';

@Component({
    selector: 'app-left-panel',
    templateUrl: './left-panel.component.html',
    styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {

    @Input() DAT = {
        base_layer_name: null,
        WMS_layers: {}};
    @Output() cmdEvent = new EventEmitter<object>();

    pass_cmd(cmdObj) {
        this.cmdEvent.emit(cmdObj);
    }

    constructor() {
    }

    ngOnInit() {
    }


}
