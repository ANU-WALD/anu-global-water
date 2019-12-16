import {Component, Input, OnInit} from '@angular/core';
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

  public gui_flags = {
    point_plot: false,
    zonal_stat_plot: false,
  };

  @Input() DAT = {
    gui_controls: {nav_right: {opened: null}},
  };

  private subscription: Subscription;

  constructor(private plotDataService: PlotDataService) {

  }


  ngOnInit() {

    this.subscription = this.plotDataService.cmdObservable$.subscribe((res) => {

      const plot_app = res.plot_app;
      console.log(plot_app);

      switch (plot_app) {

        case 'point_plot':
          this.gui_flags.point_plot = true;
          this.gui_flags.zonal_stat_plot = false;
          this.plotPointData(res.data);
          break;
        case 'zonal_stat_ts_plot':
          this.gui_flags.point_plot = false;
          this.gui_flags.zonal_stat_plot = true;
          this.plotZonalStatTs(res.data);
          break;
        default:
          this.gui_flags.point_plot = false;
          this.gui_flags.zonal_stat_plot = false;
          break;

      }

    });

  }

  plotPointData(point_data) {
    this.selected_point = point_data;

    const admin_info = admin_names[this.selected_point.point.properties.admin_country];
    this.selected_point.info = {
      country_name: admin_info.NAME_0,
      state_name: admin_info.GID_1[this.selected_point.point.properties.admin_province]
    };

    const div_id = 'plotly_ts';

    const plot_data = [{
      x: point_data.dates,
      y: point_data.values,
    }];
    const min_date = point_data.dates[0];
    const max_date = point_data.dates[point_data.dates.length - 1];

    const layout = {

      title: {
        text: point_data.plot_config.plot_title,
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
          text: point_data.plot_config.left_axis_title,
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
  }

  plotZonalStatTs(point_data) {

    const div_id = 'plotly_zst_ts';

    const plot_data = [{
      x: point_data.dates,
      y: point_data.values,
    }];
    const min_date = point_data.dates[0];
    const max_date = point_data.dates[point_data.dates.length - 1];

    const layout = {

      // title: {
      //   text: point_data.plot_config.plot_title,
      //   // font: {
      //   //   family: 'Courier New, monospace',
      //   //   size: 12
      //   // },
      //   xref: 'paper',
      //   x: 0.05,
      // },
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
        // title: {
        //   text: point_data.plot_config.left_axis_title,
        //   // font: {
        //   //   family: 'Courier New, monospace',
        //   //   size: 10,
        //   //   color: '#7f7f7f'
        //   // }
        // },
        type: 'linear'
      },
      margin: {
        t: 30, //top margin
        l: 50, //left margin
        r: 30, //right margin
        b: 30 //bottom margin
      }
    };

    Plotly.purge(div_id);
    Plotly.newPlot(div_id, plot_data, layout, {responsive: true});

    this.DAT.gui_controls.nav_right.opened = true;
  }

}
