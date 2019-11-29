import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  @Input() DAT = {
    base_layer_name: null,
    Point_layers: {},
    WMS_layers: {},
    WMS_layers_dynamic: {},
    WMS_layers_zonal_stat: {},
    WMS_layers_zonal_stat_settings: {
      base: null,
      bases: [],
      admin_layer: null,
      admin_layers: [],
      basin_layer: null,
      basin_layers: [],

    },
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
