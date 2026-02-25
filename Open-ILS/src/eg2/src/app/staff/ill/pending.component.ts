import {Component, OnInit, Input} from '@angular/core';
import {HoldsGridComponent} from  '@eg/staff/share/holds/grid.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Location} from '@angular/common';
import {OrgService} from '@eg/core/org.service';
import {NetService} from '@eg/core/net.service';
import {StoreService} from '@eg/core/store.service';
import {NgbNav, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {ILLService} from './ill.service';

@Component({
    templateUrl: 'pending.component.html',
    selector: 'ff-ill-requests'
})
export class PendingRequestsComponent {

    @Input() contextOrg: number;
    @Input() ill_role: string;

    customActions: any[];

    constructor(
        private router: Router,
        private ill: ILLService,
        private ngLocation: Location,
        private org: OrgService,
        private net: NetService,
        private store: StoreService
    ) {
        this.customActions = [{
            group: 'ILL',
            label: $localize`Activate Requests`,
            method: (rows) => this.activate_holds(rows)
        },{
            group: 'ILL',
            label: $localize`Suspend Requests`,
            method: (rows) => this.suspend_holds(rows)
        }];
    }

    // Navigate, opening new tabs when requested via control-click.
    // NOTE: The nav items have routerLinks, but for some reason,
    // control-click on the links does not open them in a new tab.
    // Mouse middle-click does, though.  *shrug*
    navItemClick(tab: string, evt: PointerEvent) {
        evt.preventDefault();
        this.routeToTab(tab, evt.ctrlKey);
    }

    toggleHoldActive(rows: any[], frozen_value: string): Promise<any> {
        return this.ill.circAPIRequest(
            'open-ils.circ.hold.update.batch',
            null, rows.map(r => { return {id: r.id, frozen: frozen_value} })
        );
    }

    activate_holds(rows: any[]): Promise<any> {
        return this.toggleHoldActive(rows, 'f');
    }

    suspend_holds(rows: any[]): Promise<any> {
        return this.toggleHoldActive(rows, 't');
    }

    beforeTabChange(evt: NgbNavChangeEvent) {
        // Prevent the nav component from changing tabs so we can
        // control the behaviour.
        evt.preventDefault();
    }

    routeToTab(tab?: string, newWindow?: boolean) {
        let url = `/staff/ill/pending/${tab}`;

        if (newWindow) {
            url = this.ngLocation.prepareExternalUrl(url);
            window.open(url);
        } else {
            this.router.navigate([url]);
        }
    }

    newHold() {
        this.router.navigate(['/staff/catalog/search']);
    }
}

