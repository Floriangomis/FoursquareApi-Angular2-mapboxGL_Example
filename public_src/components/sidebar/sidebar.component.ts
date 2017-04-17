import {Component} from '@angular/core';
import {GeocodingService} from '../../services/geocoding.service';
import {MapService} from '../../services/map.service';
import {Location} from '../../core/location.class';
import {Map, Popup, LngLat} from 'mapbox-gl';
import {FoursquareService} from '../../services/foursquare.service';

@Component({
    selector: 'sidebar',
    template: require<any>('./sidebar.component.html'),
    styles: [
        require<any>('./sidebar.component.less'),
        require<any>('../../styles/main.less')
    ],
    providers: []
})
export class SidebarComponent {

    recommendedVenues: [any];
    lookup: object = {};
    popup: Popup;
    showLoadMoreBtn: boolean = true;
    loading = false;

    constructor(private geocoder: GeocodingService, private mapService: MapService, private foursquareService: FoursquareService) {}

    ngOnInit() {
        // We subscribe to the service which will notify and send a list of recommended Location to that component as soon as it's ready.
        this.foursquareService.getRecommendedLocation().subscribe( (value) => {
            this.recommendedVenues = value.response.groups[0].items;
            this.updateLookup();
            this.updateStateOfLoadMoreBtn(value.response);
            this.loading = false;
        }, (error) => {
            console.log(error);
            this.loading = false;
        }, () => {
            console.log('completed');
        });
    }

    pickRecommendation(referralId: any) {
        let LocationData = this.retrieveLocationById(referralId);
        this.popupOnMap(LocationData);
    }

    retrieveLocationById(referralId: any) {
        return this.lookup[referralId];
    }

    popupOnMap(locationData: any) {
        // remove previous one to avoid load of manu popup and then cause some slow.
        if (this.popup) {
            this.popup.remove();
        }

        this.mapService.map.setZoom(15);
        this.mapService.map.panTo( {lng: locationData.venue.location.lng, lat: locationData.venue.location.lat } as any );

        this.popup = new Popup({closeButton: true, closeOnClick: false})
            .setHTML(` <img src="` + this.getPicture(locationData, 'width250') + `" />  
                <div> ` + ((locationData.venue.location.address) ? locationData.venue.location.address : '')  + ` </div>
                <div> ` + ((locationData.venue.location.postalCode) ? locationData.venue.location.postalCode : '')  + ` </div>
                <div> ` + ((locationData.venue.location.state) ? locationData.venue.location.state : '')  + ` </div>
                <div> ` + ((locationData.venue.location.city) ? locationData.venue.location.city : '')  + ` </div>
                <div> ` + ((locationData.venue.location.country) ? locationData.venue.location.country : '') + ` </div>
            `)
            .setLngLat([locationData.venue.location.lng, locationData.venue.location.lat])
            .addTo(this.mapService.map);
    }

    updateLookup() {
        // reset
        this.lookup = {};
        for (let i = 0, len = this.recommendedVenues.length; i < len; i++) {
            this.lookup[this.recommendedVenues[i].referralId] = this.recommendedVenues[i];
        }
    }

    loadMore() {
        this.loading = true;
        this.foursquareService.retrieveRecommendedVenus().subscribe( value => {
            this.recommendedVenues = (this.recommendedVenues.concat(value.response.groups[0].items) as [any]);
            this.updateLookup();
            this.updateStateOfLoadMoreBtn(value.response);
            this.loading = false;
        });
    }

    updateStateOfLoadMoreBtn(response: any) {
        (response.totalResults > this.foursquareService.getOffset()) ? this.showLoadMoreBtn = true : this.showLoadMoreBtn = false;
    }

    getPicture(venue: any, size: string = '100x100') {
        let result;
        if (venue.venue.photos.count > 0) {
            result = venue.venue.photos.groups[0].items[0].prefix + size + venue.venue.photos.groups[0].items[0].suffix;
        } else {
            result = 'https://www.dermacessitygold.com/wp-content/plugins/ajax-search-pro/img/default.jpg';
        }
        return result;
    }

    getRating(rating: number): string {
        if (rating === undefined) {
            return 'No data';
        } else {
            return rating + '/10';
        }
    }
}
