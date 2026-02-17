import {Component, OnInit, Input} from '@angular/core';
import {HoldsGridComponent} from  '@eg/staff/share/holds/grid.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {OrgService} from '@eg/core/org.service';
import {NetService} from '@eg/core/net.service';
import {StoreService} from '@eg/core/store.service';
import {NgbNav, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
    templateUrl: 'onshelf.component.html',
    selector: 'ff-ill-onshelf'
})
export class OnShelfComponent {

    @Input() contextOrg: number;
    @Input() ill_role: string;

    constructor(
        private router: Router,
        private ngLocation: Location,
        private org: OrgService,
        private net: NetService,
        private store: StoreService
    ) {}

    // Navigate, opening new tabs when requested via control-click.
    // NOTE: The nav items have routerLinks, but for some reason,
    // control-click on the links does not open them in a new tab.
    // Mouse middle-click does, though.  *shrug*
    navItemClick(tab: string, evt: PointerEvent) {
        evt.preventDefault();
        this.routeToTab(tab, evt.ctrlKey);
    }

    beforeTabChange(evt: NgbNavChangeEvent) {
        // Prevent the nav component from changing tabs so we can
        // control the behaviour.
        evt.preventDefault();
    }

    routeToTab(tab?: string, newWindow?: boolean) {
        let url = `/staff/ill/onshelf/${tab}`;

        if (newWindow) {
            url = this.ngLocation.prepareExternalUrl(url);
            window.open(url);
        } else {
            this.router.navigate([url]);
        }
    }
}

