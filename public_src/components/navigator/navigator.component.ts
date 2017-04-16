import {Component} from '@angular/core';
import {GeocodingService} from '../../services/geocoding.service';
import {MapService} from '../../services/map.service';
import {Location} from '../../core/location.class';
import {Map, Popup} from 'mapbox-gl';
import {FoursquareService} from '../../services/foursquare.service';

@Component({
    selector: 'navigator',
    template: require<any>('./navigator.component.html'),
    styles: [
        require<any>('./navigator.component.less'),
        require<any>('../../styles/main.less')
    ],
    providers: []
})
export class NavigatorComponent {
    private address: string;
    private map: Map;
    private lnlt: [number, number];

    constructor(private geocoder: GeocodingService, private mapService: MapService, private foursquareService: FoursquareService) {
        this.address = '';
    }

    ngOnInit() {
        this.map = this.mapService.map;
    }

    goto() {
        if (!this.address) { return; }

        this.geocoder.geocode(this.address)
            .subscribe(location => {
                this.lnlt = [location.latitude, location.longitude];
                this.map.fitBounds(location.viewBounds, {});
                this.address = location.address;

                this.foursquareService.retrieveRecommendedVenus(this.lnlt).subscribe( value => {
                    this.foursquareService.emitRecommendedLocation(value);
                }, error => {
                    console.log(error);
                });

            }, error => {
                console.error(error);
        });
    }
}
