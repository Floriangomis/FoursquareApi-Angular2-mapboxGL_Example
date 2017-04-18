import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class FoursquareService {

    private subjetct: Subject<any> = new Subject<any>();
    private offset = 0;
    private limit = 50;
    private ltLng: [number, number];

    constructor(private http: Http) {
        this.http = http;
    }

    // Not a good practise ... but i don't have that much time now !
    getOffset() {
        return this.offset;
    }

    emitRecommendedLocation(recommendedLocations) {
        this.subjetct.next(recommendedLocations);
    }

    getRecommendedLocation() {
        return this.subjetct.asObservable();
    }

    retrieveRecommendedVenus(position: [number, number] = null) {
        // If new search via Navigator then reset all. ( Offset and Long/lat since this is not a search via Load more btn).
        if ( position !== null ) {
            this.ltLng = position;
            this.offset = 0;
        }

        return this.http.get(`https://api.foursquare.com/v2/venues/explore?ll=${this.ltLng[0]},${this.ltLng[1]}&&client_id=LLUXQC5VMIZOEQGCVGUG43LULN1EXZN0B2DZYEF2ICRHMXAJ&client_secret=XRKMWKLSVJ1PB0A1HZAV0GJZG534B4A3YTFISK231MDUEBRI&v=20170415&limit=${this.limit}&offset=${this.offset}&venuePhotos=1`)
            .map(res => {
                this.emitRecommendedLocation(res.json());
                // Update of the offset
                this.offset = this.offset + this.limit;
                return res.json();
            });
    }
}
