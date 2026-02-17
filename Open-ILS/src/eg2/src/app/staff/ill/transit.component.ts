import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {OrgService} from '@eg/core/org.service';
import {NetService} from '@eg/core/net.service';
import {StoreService} from '@eg/core/store.service';

@Component({
    templateUrl: 'transit.component.html',
    selector: 'ff-transits'
})
export class TransitComponent {

    constructor(
        private router: Router,
        private org: OrgService,
        private net: NetService,
        private store: StoreService
    ) {}

    newHold() {
        this.router.navigate(['/staff/catalog/search']);
    }
}
