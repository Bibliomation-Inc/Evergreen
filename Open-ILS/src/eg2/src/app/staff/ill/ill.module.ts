import {NgModule} from '@angular/core';
import {StaffCommonModule} from '@eg/staff/common.module';
import {ILLComponent} from './ill.component';
import {ILLRoutingModule} from './routing.module';
import {SingleScanComponent} from './singlescan.component';
import {PendingRequestsComponent} from './pending.component';
import {TransitComponent} from './transit.component';
import {OnShelfComponent} from './onshelf.component';
import {CirculatingComponent} from './circulating.component';
import {BarcodesModule} from '@eg/staff/share/barcodes/barcodes.module';
import {HoldsModule} from '@eg/staff/share/holds/holds.module';
import {CircModule} from '@eg/staff/share/circ/circ.module';

@NgModule({
    declarations: [
        ILLComponent,
        SingleScanComponent,
        PendingRequestsComponent,
        TransitComponent,
        OnShelfComponent,
        CirculatingComponent
    ],
    imports: [
        StaffCommonModule,
        ILLRoutingModule,
        HoldsModule,
        CircModule,
    ],
    providers: []
})

export class ILLModule {}

