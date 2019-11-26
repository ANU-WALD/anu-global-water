import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlotDataService} from '../../plot-data.service';
import admin_names from '../../../assets/names/admin_names.json';

declare let Plotly;


@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})


export class RightPanelComponent implements OnInit {

  public selected_point = {
    info: {
      country_name: null,
      state_name: null
    },
    point: {
      properties: {
        ID: null,
        admin_country: null,
        admin_province: null,
        hydro_basin: null,
        hydro_cat: null,
        Riv_Qmean: null,
        Riv_Qmax: null
      }
    }
  };

  @Input() DAT = {
    gui_controls: {nav_right: {opened: null}},
  };

  private subscription: Subscription;

  constructor(private plotDataService: PlotDataService) {

  }


  ngOnInit() {


    this.subscription = this.plotDataService.cmdObservable$.subscribe((res) => {
      console.log('res++++', res);

      this.selected_point = res.data;
      console.log(this.selected_point);
      console.log(admin_names);
      console.log();

      let admin_info = admin_names[this.selected_point.point.properties.admin_country];
      this.selected_point.info = {
        country_name: admin_info.NAME_0,
        state_name: admin_info.GID_1[this.selected_point.point.properties.admin_province]
      };

      let div_id = 'plotly_ts';

      let plot_data = [{
        x: res.data.dates,
        y: res.data.values,
      }];
      let min_date = res.data.dates[0];
      let max_date = res.data.dates[res.data.dates.length - 1];

      let layout = {

        title: {
          text: res.data.plot_config.plot_title,
          // font: {
          //   family: 'Courier New, monospace',
          //   size: 12
          // },
          xref: 'paper',
          x: 0.05,
        },
        xaxis: {
          autorange: true,
          // rangeselector: {
          //     buttons: [
          //         {
          //             count: 1,
          //             label: '1m',
          //             step: 'month',
          //             stepmode: 'forward'
          //         },
          //         {
          //             count: 6,
          //             label: '6m',
          //             step: 'month',
          //             stepmode: 'forward'
          //         },
          //         {
          //             count: 12,
          //             label: '1y',
          //             step: 'month',
          //             stepmode: 'forward'
          //         },
          //         {step: 'all'}
          //     ]
          // },
          rangeslider: {range: [min_date, max_date]},
          type: 'date'
        },
        yaxis: {
          autorange: true,
          // range: [0, 100],
          title: {
            text: res.data.plot_config.left_axis_title,
            // font: {
            //   family: 'Courier New, monospace',
            //   size: 10,
            //   color: '#7f7f7f'
            // }
          },
          type: 'linear'
        },
        margin: {
          t: 30, //top margin
          l: 50, //left margin
          r: 30, //right margin
          b: 30 //bottom margin
        }
      };


      Plotly.newPlot(div_id, plot_data, layout, {responsive: true});

      this.DAT.gui_controls.nav_right.opened = true;
    });


  }


}
