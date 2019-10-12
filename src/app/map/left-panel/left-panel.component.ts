import {Component, Output, Input, EventEmitter, OnInit} from '@angular/core';

@Component({
    selector: 'app-left-panel',
    templateUrl: './left-panel.component.html',
    styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

    @Input() DAT = {
        base_layer_name: null,
        WMS_layers: {},
        WMS_layers_dynamic: {}
    };
    @Output() map_left_panel_event = new EventEmitter<object>();

    map_left_panel_emit_out(emit_obj) {
        this.map_left_panel_event.emit(emit_obj);
    }

    constructor() {
    }

    ngOnInit() {
    }


}
