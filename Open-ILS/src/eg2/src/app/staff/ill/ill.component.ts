import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap, RoutesRecognized} from '@angular/router';
import {Location} from '@angular/common';
import {ILLModule} from './ill.module';
import {NgbNav, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {filter, pairwise} from 'rxjs';
import {NetService} from '@eg/core/net.service';
import {AuthService} from '@eg/core/auth.service';
import {PcrudService} from '@eg/core/pcrud.service';
import {EventService} from '@eg/core/event.service';
import {StoreService} from '@eg/core/store.service';
import {ServerStoreService} from '@eg/core/server-store.service';
import {SingleScanComponent} from './singlescan.component';
import {PendingRequestsComponent} from './pending.component';
import {TransitComponent} from './transit.component';
import {OnShelfComponent} from './onshelf.component';
import {CirculatingComponent} from './circulating.component';

@Component({
    templateUrl: 'ill.component.html',
    styleUrls: ['ill.component.css'],
})
export class ILLComponent implements OnInit {

    activeTab: string;
    ill_role = 'borrower';
    route_barcode: string;
    contextOrg: number;

    showNav = true;
    loading = true;
    statusMode = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private ngLocation: Location,
        private net: NetService,
        private auth: AuthService,
        private pcrud: PcrudService,
        private evt: EventService,
        private store: StoreService,
        private serverStore: ServerStoreService,
    ) {}

    ngOnInit() {
        this.contextOrg = this.auth.user().ws_ou();

        this.activeTab ||= this.route.snapshot.params.activeTab || 'singlescan';
        this.ill_role ||= this.route.snapshot.params.ill_role || 'borrower';
        this.route_barcode ||= this.route.snapshot.params.barcode;

        if (['singlescan','status'].includes(this.activeTab)) {
            this.statusMode = this.activeTab === 'status';
        }

        this.watchForTabChange();
        this.load();
    }

    load() {
        this.loading = true;
        this.fetchSettings()
            .then(_ => this.loading = false);
    }

    fetchSettings(): Promise<any> {

        return this.serverStore.getLocalItem('ff.ill.nav.collapse')
            .then(pref => this.showNav = !pref);
    }

    watchForTabChange() {

        this.route.paramMap.subscribe((params: ParamMap) => {
            this.activeTab = params.get('activeTab');
            this.ill_role = params.get('ill_role') || 'borrower';
            this.route_barcode = params.get('barcode');

            // set the statusMode flag as necessary, assuming
            // we will reuse SingleScanComponent
            if (['singlescan','status'].includes(this.activeTab)) {
                this.statusMode = this.activeTab === 'status';
            }

        });
    }

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
        let url = '/staff/ill/';
        tab = tab || this.activeTab;

        url += tab;

        switch (tab) {
            case 'singlescan':
            case 'status':
                if (this.route_barcode) {
                    url += `/${this.route_barcode}`;
                }
                break;
            default:
                url += `/${this.ill_role}`;
        }

        if (newWindow) {
            url = this.ngLocation.prepareExternalUrl(url);
            window.open(url);
        } else {
            this.router.navigate([url]);
        }
    }

    toggleNavPane() {
        this.serverStore.setLocalItem( // collapse is the opposite of show
            'ff.ill.nav.collapse', this.showNav);
        this.showNav = !this.showNav;
    }

}

