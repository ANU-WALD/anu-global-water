import {Component, OnInit} from '@angular/core';
import {timeout} from 'rxjs/operators';

declare let L;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

    public data_sent_to_child = 'ali';

    constructor() {
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
            AUS_NSW_Cadastre_Lots: {
                group_name: 'base_maps',
                group_display_name: 'Base Maps',
                layer_name: 'AUS_NSW_Cadastre_Lots',
                layer_display_name: 'NSW Cadastre - Lots',
                wms_url: 'http://maps.six.nsw.gov.au/arcgis/services/public/NSW_Cadastre/MapServer/WMSServer?',
                wms_options: {
                    layers: '1',
                    transparent: true,
                    format: 'image/png',
                },
                crs: 'EPSG3857',
                is_selected: false,
                opacity: 0.5,
                show_controls: false,
                has_dates: false,
                has_legend: true,
                legend_url: 'images/legend_lots.png',
                info: {
                    title: 'NSW Cadastre Mayer',
                    text: 'This layers shows lots from the The Digital Cadastral Database (DCDB) of NSW. Lot is a parcel of land created on a plan of subdivison or title e.g Lot 10 DP12345. For more information see https://www.spatial.nsw.gov.au/mapping_and_imagery/cadastral_data'
                }
            },

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

            GRAFS_API_analysis: {
                    group_name: 'base_maps',
                    group_display_name: 'Base Maps',
                    layer_name: 'GRAFS_API_analysis',
                    layer_display_name: 'GRAFS API analysis',
                    wms_url: 'http://dapds00.nci.org.au/thredds/wms/ub8/global/GRAFS/API_analysis_window_2019.nc',
                    wms_options: {
                        layers: 'API',
                        transparent: true,
                        format: 'image/png',
                        version: '1.3.0',
                        styles: 'boxfill/nrm_rainfall',
                        // numcolorbands: '20',
                        // colorscalerange: '1,20',
                        // belowmincolor: 'transparent',
                        // abovemaxcolor: 'transparent'
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
        }

    };
    OBJ = {
        current_base_layer: null,
        map: null,
        WMS_layers: {}
    };


    ngOnInit() {

        // this.data.currentMessage.subscribe(message => this.message = message);

        this.OBJ.map = L.map('map', {
            continuousWorld: false, noWrap: true,
        }).setView([this.DAT.map_init_lat,
            this.DAT.map_init_lon], this.DAT.map_init_zoom);

        this.DAT.mapbox_baseLayers = {
            Streets: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
            Satellite: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
            Dark: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
            Light: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token=' + this.DAT.mapbox_token),
        };


        this.OBJ.current_base_layer = this.DAT.mapbox_baseLayers[this.DAT.base_layer_name];
        this.OBJ.current_base_layer.addTo(this.OBJ.map);


        for (let wms_key in this.DAT.WMS_layers) {
            let layer_dict = this.DAT.WMS_layers[wms_key];

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
            console.log(wms_key);
        }

    }


    set_base_map(base_layer) {

        this.DAT.base_layer_name = base_layer;

        this.OBJ.map.removeLayer(this.OBJ.current_base_layer);

        this.OBJ.current_base_layer = this.DAT.mapbox_baseLayers[this.DAT.base_layer_name];

        this.OBJ.current_base_layer.addTo(this.OBJ.map).bringToBack();

    }

    set_wms_layer(group_name, layer_name) {

        console.log(layer_name, this.DAT.WMS_layers[layer_name].is_selected);

        if (this.DAT.WMS_layers[layer_name].is_selected) {
            console.log('adding');
            this.OBJ.WMS_layers[group_name].layers[layer_name].layer_obj.addTo(this.OBJ.map);
            this.DAT.WMS_layers[layer_name].show_controls = true;

        } else {
            console.log('removing');
            this.OBJ.map.removeLayer(this.OBJ.WMS_layers[group_name].layers[layer_name].layer_obj);
            this.DAT.WMS_layers[layer_name].show_controls = false;
        }


    }


    exe_cmd($event) {

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
            default:
                break;


        }


    }


}
