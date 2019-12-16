import {Component, OnInit} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import * as L from 'leaflet';
import {Feature} from 'geojson';

import {MetadataService, InterpolationService, PaletteService} from 'map-wald';
import {PointDataService} from '../point-data.service';
import {PlotDataService} from '../plot-data.service';
import {ZonalDataService} from '../zonal-data.service';
import name_dict from '../../assets/names/name_dict.json';
import row_id_dict from '../../assets/names/row_id_dict.json';
import { VectorLayerService } from '../vector-layer.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private metadata: MetadataService,
              private pointData: PointDataService,
              private zonalData: ZonalDataService,
              private plotData: PlotDataService,
              private palettes: PaletteService,
              private vectorData: VectorLayerService) {
    // this.pointData.getLayers().subscribe(layers => console.log(layers));

    this.zonalData.getVectorLayers().subscribe(layers => console.log(layers));
    this.zonalData.getDataLayers().subscribe(layers => console.log(layers));

    // this.zonalData.getTimeSeries('Admin Boundaries', 'API', {
    //     type: 'Feature',
    //     geometry: null,
    //     properties: {
    //       plg_id: 5.0
    //     },
    //   },
    //   { // New parameter
    //     region: 'AUS'
    //   }).subscribe(ts => {
    //   console.log('Time series from zonal stats');
    //   console.log(ts);
    // });


    // this.pointData.getTimes('Major streams').pipe(
    //   map(dates => dates[dates.length - 1]),
    //   map(date => this.pointData.getValues('Major streams', null, date)),
    //   switchAll()
    // ).subscribe(d => {
    //   console.log('this is d');
    //   console.log(d);
    // });

    this.palettes.getPalette('RdYlBu', false, 7).subscribe(pal => {
      console.log(pal);
    });
  }

  public DAT = {
    mapbox_token: 'pk.eyJ1IjoiZmFybWluZ2RzcyIsImEiOiJhNDVhOWY2MGIxMjgwYjI5OTdiOGRhMTM1NGE1YTFkYyJ9.cDFYFuz0wEbd0rxM-6djsw',
    mapbox_baseLayers: {},
    base_layer_name: 'Light',
    map_style: {
      'z-index': 10,
      'cursor': 'hand'
    },
    map_init_zoom: 5,
    map_init_lat: -26,
    map_init_lon: 132,

    WMS_layers: { // WMS_layers.AUS_NSW_Cadastre_Lots.is_selected
      // base maps

      AUS_GA_L8: {
        group_name: 'base_maps',
        group_display_name: 'Base Maps',
        layer_name: 'AUS_GA_L8',
        layer_display_name: 'Landsat 8',
        // wms_url: 'https://ows.services.dea.ga.gov.au/',
        wms_url: 'https://ows.dev.dea.ga.gov.au/',
        wms_options: {
          layers: 'ls8_nbart_geomedian_annual',
          version: '1.3.0',
          transparent: false,
          format: 'image/png',
        },
        crs: 'EPSG4326',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        info: {
          title: 'Surface Reflectance 25m Annual Geomedian (Landsat 8)',
          text: 'The surface reflectance geometric median (geomedian) is a pixel composite mosaic of a time series of earth observations. The value of a pixel in a an annual geomedian image is the statistical median of all observations for that pixel from a calendar year. Annual mosaics are available for the following years: Landsat 8: 2013 to 2017; For more information, see http://pid.geoscience.gov.au/dataset/ga/120374'
        }
      },

      AUS_CLUM: {
        group_name: 'base_maps',
        group_display_name: 'Base Maps',
        layer_name: 'AUS_CLUM',
        layer_display_name: 'Land Use',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/au/LandUse/clum_0917_reclass_50m.nc',
        wms_options: {
          layers: 'LandUse',
          transparent: true,
          format: 'image/png',
          version: '1.1.1',
          styles: 'boxfill/anu_wald_landuse',
          numcolorbands: '20',
          colorscalerange: '1,20',
          belowmincolor: 'transparent',
          abovemaxcolor: 'transparent'
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        has_legend: true,
        legend_url: 'images/legend_clum.png',
        info: {
          title: 'Catchment Scale Land Use of Australia',
          text: 'This dataset is the most current national compilation of catchment scale land use data for Australia (CLUM), as at September 2017. It replaces the Catchment Scale Land Use of Australia - Update May 2016 released in June 2016. It is a seamless raster dataset that combines land use data for all state and territory jurisdictions, compiled at a resolution of 50 metres by 50 metres. It has been compiled from vector land use datasets collected as part of state and territory mapping programs through the Australian Collaborative Land Use and Management Program (ACLUMP). Catchment scale land use data was produced by combining land tenure and other types of land use information, fine-scale satellite data and information collected in the field. The date of mapping (2003 to 2017) and scale of mapping (1:5 000 to 1:250 000) vary, reflecting the source data, capture date and scale. This information is provided in a supporting polygon dataset.'
        }
      },

    },

    WMS_layers_dynamic: {
      GRAFS_API_analysis: {
        group_name: 'dynamic_layers',
        group_display_name: 'Dynamic Layers',
        layer_name: 'GRAFS_API_analysis',
        layer_display_name: 'API analysis',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/API_analysis_window_{{year}}.nc',
        wms_options: {
          layers: 'API',
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          styles: 'boxfill/anu_fmc_rdylbu_9',
          colorscalerange: '0,100',
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        date_dict: {
          selected_date: null,
          min_year: 2014,
          min_date: null,
          max_date: null,
        },
        has_legend: false,
        legend_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/API_analysis_window_2019.nc?REQUEST=GetLegendGraphic&LAYER=API&PALETTE=anu_fmc_rdylbu_9&colorscalerange=0,100',
        info: {
          title: '',
          text: ''
        }
      },
      GRAFS_SWI_1m_analysis: {
        group_name: 'dynamic_layers',
        group_display_name: 'Dynamic Layers',
        layer_name: 'GRAFS_SWI_1m_analysis',
        layer_display_name: 'SWI 1m analysis',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/SWI_1m_analysis_window_{{year}}.nc',
        wms_options: {
          layers: 'wetness',
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          styles: 'boxfill/anu_fmc_rdylbu_9',
          colorscalerange: '0,1',
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        date_dict: {
          selected_date: null,
          min_year: 2014,
          min_date: null,
          max_date: null,
        },
        has_legend: false,
        legend_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/SWI_1m_analysis_window_2019.nc?REQUEST=GetLegendGraphic&LAYER=wetness&PALETTE=anu_fmc_rdylbu_9&colorscalerange=0,1',
        info: {
          title: '',
          text: ''
        }
      },
      Surface_Wetness_from_API_analysis: {
        group_name: 'dynamic_layers',
        group_display_name: 'Dynamic Layers',
        layer_name: 'Surface_Wetness_from_API_analysis',
        layer_display_name: 'Wetness from API analysis',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/Surface_Wetness_from_API_analysis_window_{{year}}.nc',
        wms_options: {
          layers: 'wetness',
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          styles: 'boxfill/anu_fmc_rdylbu_9',
          colorscalerange: '0,1',
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        date_dict: {
          selected_date: null,
          min_year: 2014,
          min_date: null,
          max_date: null,
        },
        has_legend: false,
        legend_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/Surface_Wetness_from_API_analysis_window_2014.nc?REQUEST=GetLegendGraphic&LAYER=wetness&PALETTE=anu_fmc_rdylbu_9&colorscalerange=0,1',
        info: {
          title: '',
          text: ''
        }
      },
    },

    WMS_layers_zonal_stat: {
      GRAFS_API_analysis: {
        group_name: 'zonal_stat',
        group_display_name: 'Zonal Stat',
        layer_name: 'GRAFS_API_analysis',
        layer_display_name: 'API analysis',
        nc_variable: 'API',
        nc_file: 'API_analysis_window',
        wms_url_base: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/zonal_stats_wms',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/zonal_stats_wms/admin/FRA__API_analysis_window__API.nc',
        wms_options: {
          layers: 'API',
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          styles: 'boxfill/anu_fmc_rdylbu_9',
          colorscalerange: '0,100',
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        date_dict: {
          selected_date: null,
          min_year: 2014,
          min_date: null,
          max_date: null,
        },
        has_legend: false,
        legend_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/API_analysis_window_2019.nc?REQUEST=GetLegendGraphic&LAYER=API&PALETTE=anu_fmc_rdylbu_9&colorscalerange=0,100',
        info: {
          title: '',
          text: ''
        }
      },
      GRAFS_SWI_1m_analysis: {
        group_name: 'zonal_stat',
        group_display_name: 'Zonal Stat',
        layer_name: 'GRAFS_SWI_1m_analysis',
        layer_display_name: 'SWI 1m analysis',
        nc_variable: 'wetness',
        nc_file: 'SWI_1m_analysis_window',
        wms_url_base: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/zonal_stats_wms',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/zonal_stats_wms/admin/FRA__SWI_1m_analysis_window__wetness.nc',
        wms_options: {
          layers: 'wetness',
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          styles: 'boxfill/anu_fmc_rdylbu_9',
          colorscalerange: '0,1',
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        date_dict: {
          selected_date: null,
          min_year: 2014,
          min_date: null,
          max_date: null,
        },
        has_legend: false,
        legend_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/SWI_1m_analysis_window_2019.nc?REQUEST=GetLegendGraphic&LAYER=wetness&PALETTE=anu_fmc_rdylbu_9&colorscalerange=0,1',
        info: {
          title: '',
          text: ''
        }
      },
      Surface_Wetness_from_API_analysis: {
        group_name: 'zonal_stat',
        group_display_name: 'Zonal Stat',
        layer_name: 'Surface_Wetness_from_API_analysis',
        layer_display_name: 'Wetness from API analysis',
        nc_variable: 'wetness',
        nc_file: 'Surface_Wetness_from_API_analysis_window',
        wms_url_base: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/zonal_stats_wms',
        wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/zonal_stats_wms/admin/FRA__Surface_Wetness_from_API_analysis_window__wetness.nc',
        wms_options: {
          layers: 'wetness',
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          styles: 'boxfill/anu_fmc_rdylbu_9',
          colorscalerange: '0,1',
        },
        crs: 'EPSG3857',
        is_selected: false,
        opacity: 0.5,
        show_controls: false,
        has_dates: false,
        date_dict: {
          selected_date: null,
          min_year: 2014,
          min_date: null,
          max_date: null,
        },
        has_legend: false,
        legend_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/Surface_Wetness_from_API_analysis_window_2014.nc?REQUEST=GetLegendGraphic&LAYER=wetness&PALETTE=anu_fmc_rdylbu_9&colorscalerange=0,1',
        info: {
          title: '',
          text: ''
        }
      },
    },

    WMS_layers_zonal_stat_settings: {
      base: 'admin',
      bases: [
        {value: 'admin', view_value: 'World & Countries'},
        {value: 'basin', view_value: 'HydroSHD Basins'}
      ],

      admin_layer: 'gadm36_0',
      admin_layers: name_dict.admin,
      // admin_layers: [
      //   {value: 'gadm36_0', view_value: 'World'},
      //   {value: 'AUS', view_value: 'Australia'},
      //   {value: 'FRA', view_value: 'France'},
      // ],

      basin_layer: 'hybas_world_lev03_v1c',
      basin_layer_name: 'World',
      basin_layers: name_dict.basin,
      // basin_layers: [
      //   {value: 'hybas_world_lev03_v1c', view_value: 'Global Basins'},
      //   {value: '1030000010', view_value: '1030000010'},
      //   ],
    },

    zonal_stat_ts_setting: {

      type: 'admin',
      types: [
        {value: 'admin', view_value: 'World & Countries'},
        {value: 'basin', view_value: 'HydroSHD Basins'}
      ],
      admin_layer: 'gadm36_0',
      admin_layers: name_dict.admin,
      // admin_layers: [
      //   {value: 'gadm36_0', view_value: 'World'},
      //   {value: 'AUS', view_value: 'Australia'},
      //   {value: 'FRA', view_value: 'France'},
      // ],

      basin_layer: 'hybas_world_lev03_v1c',
      basin_layer_name: 'World',
      basin_layers: name_dict.basin,
      // basin_layers: [
      //   {value: 'hybas_world_lev03_v1c', view_value: 'Global Basins'},
      //   {value: '1030000010', view_value: '1030000010'},
      //   ],

      grid_layer: 'API',
      grid_layers: [
        {value: 'API', view_value: 'API analysis'},
        {value: 'SWI', view_value: 'SWI 1m analysis'},
        {value: 'Surface Wetness', view_value: 'Wetness from API analysis'},
      ],
      plg_id: 1,
      plg_ids: [
        {value: 1, view_value: 'State 1'},
        {value: 2, view_value: 'State 2'},
      ],

      grid_params: {
        'API': {},
        'SWI': {},
        'Surface Wetness': {},

      }

    },

    Point_layers: {
      Major_Streams: {
        group_name: 'point_layers',
        group_display_name: 'Point Layers',
        layer_name: 'Major_streams',
        layer_display_name: 'Major streams',
        is_selected: false,
        opacity: 0.5,
        style: {
          color: 'blue',
          radius: 5
        },
        plot_config: {
          'plot_title': 'Time Series of River Discharge',
          'left_axis_title': 'River Discharge'
        },
        show_controls: false,
        has_legend: false,
        legend_url: null,
        info: {
          title: '',
          text: ''
        }

      },
      Storages: {
        group_name: 'point_layers',
        group_display_name: 'Point Layers',
        layer_name: 'Storages',
        layer_display_name: 'Storages',
        is_selected: false,
        opacity: 0.5,
        style: {
          color: 'brown',
          radius: 7
        },
        plot_config: {
          'plot_title': 'Time Series of Storage',
          'left_axis_title': 'Storage'
        },
        show_controls: false,
        has_legend: false,
        legend_url: null,
        info: {
          title: '',
          text: ''
        }

      },
    },

    gui_controls: {
      nav_left: {
        opened: true,
      },
      nav_right: {
        opened: false,
      },
    },

  };
  OBJ = {
    current_base_layer: null,
    map: null as L.Map,
    WMS_layers: {},
    WMS_layers_dynamic: {},
    WMS_layers_zonal_stat: {},
    Point_layers: {},
  };

  ngOnInit() {

    // this.data.currentMessage.subscribe(message => this.message = message);

    this.OBJ.map = L.map('map', {
      continuousWorld: false, noWrap: true,
    } as L.MapOptions).setView([this.DAT.map_init_lat,
      this.DAT.map_init_lon], this.DAT.map_init_zoom);

    this.DAT.mapbox_baseLayers = {
      Streets: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
      Satellite: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
      Dark: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
      Light: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
    };


    this.OBJ.current_base_layer = this.DAT.mapbox_baseLayers[this.DAT.base_layer_name];
    this.OBJ.current_base_layer.addTo(this.OBJ.map);

    this.vectorData.getLayer('Countries').subscribe(countries=>{
      L.geoJSON(countries).addTo(this.OBJ.map);

      this.vectorData.getSubLayer('Countries','AUS').subscribe(australia=>{
        L.geoJSON(australia).addTo(this.OBJ.map);
      })
    });

    for (const wms_key in this.DAT.WMS_layers) {
      const layer_dict = this.DAT.WMS_layers[wms_key];

      if (!this.OBJ.WMS_layers.hasOwnProperty(layer_dict.group_name)) {
        this.OBJ.WMS_layers[layer_dict.group_name] = {
          group_name: layer_dict.group_name,
          group_display_name: layer_dict.group_display_name,
          layers: {}
        };
      }

      this.OBJ.WMS_layers[layer_dict.group_name].layers[layer_dict.layer_name] = layer_dict;
      this.OBJ.WMS_layers[layer_dict.group_name].layers[layer_dict.layer_name].layer_obj =
        L.tileLayer.wms(layer_dict.wms_url, layer_dict.wms_options);
      this.OBJ.WMS_layers[layer_dict.group_name].layers[layer_dict.layer_name].layer_obj.setOpacity(
        layer_dict.opacity
      );
    }

    // set last date for dynamic layers
    const today = new Date();
    const cur_year = today.getFullYear();
    for (const wms_key in this.DAT.WMS_layers_dynamic) {

      this.OBJ.WMS_layers_dynamic[wms_key] = null;

      const layer_dict = this.DAT.WMS_layers_dynamic[wms_key];
      const wms_url = null;
      const dods_url = null;
      const min_year = layer_dict.date_dict.min_year;
      // min date
      const datesMin$ = this.getDates(layer_dict.wms_url, {
        year: min_year
      });
      const datesMax$ = this.getDates(layer_dict.wms_url, {
        year: cur_year
      });

      forkJoin([datesMin$, datesMax$]).subscribe(allDates => {
        const mins = allDates[0];
        const maxs = allDates[1];
        layer_dict.date_dict.min_date = mins[0];
        layer_dict.date_dict.max_date = maxs[maxs.length - 1];
        layer_dict.date_dict.selected_date = layer_dict.date_dict.max_date;

      });
    }

    // set last date for zonal stat wms layers
    for (const wms_key in this.DAT.WMS_layers_zonal_stat) {

      this.OBJ.WMS_layers_zonal_stat[wms_key] = null;

      const layer_dict = this.DAT.WMS_layers_zonal_stat[wms_key];
      const wms_url = null;
      const dods_url = null;
      const min_year = layer_dict.date_dict.min_year;
      // min date
      const datesMin$ = this.getDates(layer_dict.wms_url, {});

      forkJoin([datesMin$]).subscribe(allDates => {
        const datesList = allDates[0];
        const mins = datesList[0];
        const maxs = datesList[datesList.length - 1];
        layer_dict.date_dict.min_date = mins;
        layer_dict.date_dict.max_date = maxs;
        layer_dict.date_dict.selected_date = layer_dict.date_dict.max_date;
      });
    }

    // adding point layers to the system
    for (const layer_key in this.DAT.Point_layers) {
      console.log('layer_key', layer_key);
      const pointLayer = this.DAT.Point_layers[layer_key].layer_display_name; // 'Major streams';
      const plot_config = this.DAT.Point_layers[layer_key].plot_config;
      // this.pointData.getSites(pointLayer, {admin_country: 'AUS'}).subscribe(features => {
      this.pointData.getSites(pointLayer).subscribe(features => {

        this.OBJ.Point_layers[layer_key] = [];
        let cnt = -1;
        features.features.forEach(f => {
          cnt += 1;
          const lyr = L.geoJSON(f, {
            pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, this.DAT.Point_layers[layer_key].style);
            }
          });
          lyr.on('click', (_) => {
            this.pointSelected(pointLayer, f, plot_config);

          });
          this.OBJ.Point_layers[layer_key].push(lyr);
        });

      });

    }

  }

  getDates(baseUrl: string, config): Observable<Date[]> {
    const url = InterpolationService.interpolate(baseUrl, config);
    const dodsUrl = url.replace('/wms/', '/dodsC/');
    return this.metadata.getTimeDimensionForURL(dodsUrl);
  }

  set_base_map(base_layer) {
    this.DAT.base_layer_name = base_layer;

    this.OBJ.map.removeLayer(this.OBJ.current_base_layer);

    this.OBJ.current_base_layer = this.DAT.mapbox_baseLayers[this.DAT.base_layer_name];

    this.OBJ.current_base_layer.addTo(this.OBJ.map).bringToBack();

  }

  set_wms_layer(group_name, layer_name) {

    if (this.DAT.WMS_layers[layer_name].is_selected) {
      this.OBJ.WMS_layers[group_name].layers[layer_name].layer_obj.addTo(this.OBJ.map);
      this.DAT.WMS_layers[layer_name].show_controls = true;

    } else {

      this.OBJ.map.removeLayer(this.OBJ.WMS_layers[group_name].layers[layer_name].layer_obj);
      this.DAT.WMS_layers[layer_name].show_controls = false;
    }


  }

  set_wms_layer_dynamic(layer_name) {
    console.log('in map');

    if (this.DAT.WMS_layers_dynamic[layer_name].is_selected) {

      if (this.OBJ.WMS_layers_dynamic[layer_name] !== null) {
        this.OBJ.map.removeLayer(this.OBJ.WMS_layers_dynamic[layer_name]);
        this.DAT.WMS_layers_dynamic[layer_name].show_controls = false;
      }

      let layer_date = this.DAT.WMS_layers_dynamic[layer_name].date_dict.selected_date;

      layer_date = new Date(Date.UTC(layer_date.getFullYear(), layer_date.getMonth(), layer_date.getDate(), 0, 0, 0));

      const wms_url = InterpolationService.interpolate(this.DAT.WMS_layers_dynamic[layer_name].wms_url, {
        year: layer_date.getFullYear()
      });
      this.DAT.WMS_layers_dynamic[layer_name].wms_options.time = layer_date.toISOString();

      this.OBJ.WMS_layers_dynamic[layer_name] = L.tileLayer.wms(wms_url, this.DAT.WMS_layers_dynamic[layer_name].wms_options);
      this.OBJ.WMS_layers_dynamic[layer_name].addTo(this.OBJ.map);


    } else {
      console.log('not selected');
      if (this.OBJ.WMS_layers_dynamic[layer_name] !== null) {
        this.OBJ.map.removeLayer(this.OBJ.WMS_layers_dynamic[layer_name]);
        this.DAT.WMS_layers_dynamic[layer_name].show_controls = false;
      }
    }
  }

  set_wms_layer_zonal_stat(layer_name) {

    console.log(this.DAT.WMS_layers_zonal_stat_settings.base);
    console.log(this.DAT.WMS_layers_zonal_stat_settings.admin_layer);

    const url_base = this.DAT.WMS_layers_zonal_stat_settings.base;
    let url_feature = null;
    if (url_base === 'admin') {
      url_feature = this.DAT.WMS_layers_zonal_stat_settings.admin_layer;
    } else {
      url_feature = this.DAT.WMS_layers_zonal_stat_settings.basin_layer;
    }


    if (this.DAT.WMS_layers_zonal_stat[layer_name].is_selected) {
      if (this.OBJ.WMS_layers_zonal_stat[layer_name] !== null) {
        this.OBJ.map.removeLayer(this.OBJ.WMS_layers_zonal_stat[layer_name]);
        this.DAT.WMS_layers_zonal_stat[layer_name].show_controls = false;
      }

      let layer_date = this.DAT.WMS_layers_zonal_stat[layer_name].date_dict.selected_date;

      layer_date = new Date(Date.UTC(layer_date.getFullYear(), layer_date.getMonth(), layer_date.getDate(), 0, 0, 0));
      const nc_variable = this.DAT.WMS_layers_zonal_stat[layer_name].nc_variable;
      const nc_file = this.DAT.WMS_layers_zonal_stat[layer_name].nc_file;
      const wms_url = this.DAT.WMS_layers_zonal_stat[layer_name].wms_url_base + '/' + url_base + '/' + url_feature + '__' + nc_file + '__' + nc_variable + '.nc';
      console.log(wms_url);
      this.DAT.WMS_layers_zonal_stat[layer_name].wms_options.time = layer_date.toISOString();

      this.OBJ.WMS_layers_zonal_stat[layer_name] = L.tileLayer.wms(wms_url, this.DAT.WMS_layers_zonal_stat[layer_name].wms_options);
      this.OBJ.WMS_layers_zonal_stat[layer_name].addTo(this.OBJ.map);


    } else {
      console.log('not selected');
      if (this.OBJ.WMS_layers_zonal_stat[layer_name] !== null) {
        this.OBJ.map.removeLayer(this.OBJ.WMS_layers_zonal_stat[layer_name]);
        this.DAT.WMS_layers_zonal_stat[layer_name].show_controls = false;
      }
    }
  }

  set_point_layer(layer_name) {

    if (this.DAT.Point_layers[layer_name].is_selected) {
      this.DAT.Point_layers[layer_name].show_controls = true;

      for (const lyr_index in this.OBJ.Point_layers[layer_name]) {
        this.OBJ.Point_layers[layer_name][lyr_index].addTo(this.OBJ.map);
      }

    } else {

      this.DAT.Point_layers[layer_name].show_controls = false;
      for (const lyr_index in this.OBJ.Point_layers[layer_name]) {
        this.OBJ.map.removeLayer(this.OBJ.Point_layers[layer_name][lyr_index]);
      }
    }

  };

  map_exe_cmd($event) {

    switch ($event.func) {
      case 'set_base_map':
        this.set_base_map($event.params.base_layer);
        break;
      case 'zoom_in':
        this.OBJ.map.zoomIn();
        break;
      case 'zoom_out':
        this.OBJ.map.zoomOut();
        break;
      case 'set_wms_layer':
        this.set_wms_layer($event.params.group_name, $event.params.layer_name);
        break;
      case 'set_wms_layer_dynamic':
        this.set_wms_layer_dynamic($event.params.layer_name);
        break;
      case 'set_wms_layer_zonal_stat':
        this.set_wms_layer_zonal_stat($event.params.layer_name);
        break;
      case 'plot_zonal_stat_ts':
        this.plotZonalStatTs();
        break;
      case 'set_point_layer':
        this.set_point_layer($event.params.layer_name);
        break;
      default:
        break;
    }
  }

  pointSelected(layer: string, point: Feature, plot_config) {
    console.log('in pointSelected');

    this.pointData.getTimeSeries(layer, point).subscribe(ts => {
      console.log(ts);

      this.plotData.sendCmd({
        plot_app: 'point_plot',
        data: {
          layer,
          plot_config,
          point,
          dates: ts.dates,
          values: ts.values
        }
      });

    });
  }

  plotZonalStatTs() {
    const layer_type = this.DAT.zonal_stat_ts_setting.type;

    let vectorLayer;
    let region;
    const grid_layer = this.DAT.zonal_stat_ts_setting.grid_layer;
    const plg_id = this.DAT.zonal_stat_ts_setting.plg_id;


    switch (layer_type) {
      case 'admin':
        vectorLayer = 'Admin Boundaries';
        region = this.DAT.zonal_stat_ts_setting.admin_layer;
        break;
      case 'basin':
        vectorLayer = 'Basins';
        region = this.DAT.zonal_stat_ts_setting.basin_layer;
        break;
      default:
        break;
    }

    this.DAT.zonal_stat_ts_setting.plg_ids = row_id_dict[layer_type][region];

    console.log(layer_type, region, grid_layer, plg_id);
    this.zonalData.getTimeSeries(vectorLayer, grid_layer, {
        type: 'Feature',
        geometry: null,
        properties: {
          plg_id
        },
      },
      { // New parameter
        region,
      }).subscribe(ts => {
      console.log('Time series from zonal stats', region, plg_id);
      console.log(ts);

      this.plotData.sendCmd({
        plot_app: 'zonal_stat_ts_plot',
        data: {
          dates: ts.dates,
          values: ts.values
        }
      });

    });


  }


}
