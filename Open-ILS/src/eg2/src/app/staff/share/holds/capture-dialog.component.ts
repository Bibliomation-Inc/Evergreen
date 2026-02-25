import {Component, Input, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {NetService} from '@eg/core/net.service';
import {EventService} from '@eg/core/event.service';
import {ToastService} from '@eg/share/toast/toast.service';
import {AuthService} from '@eg/core/auth.service';
import {DialogComponent} from '@eg/share/dialog/dialog.component';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {StringComponent} from '@eg/share/string/string.component';


/**
 * Dialog for capturing holds.
 */

@Component({
    selector: 'eg-hold-capture-dialog',
    templateUrl: 'capture-dialog.component.html'
})

export class HoldCaptureDialogComponent
    extends DialogComponent {

    @Input() copyIds: number | number[];
    @Input() ff_action: string;

    @ViewChild('successMsg', { static: true }) private successMsg: StringComponent;
    @ViewChild('errorMsg', { static: true }) private errorMsg: StringComponent;

    changesApplied: boolean;
    numSucceeded: number;
    numFailed: number;

    constructor(
        private modal: NgbModal, // required for passing to parent
        private toast: ToastService,
        private net: NetService,
        private evt: EventService,
        private auth: AuthService) {
        super(modal); // required for subclassing
    }

    open(args: NgbModalOptions): Observable<boolean> {
        this.numSucceeded = 0;
        this.numFailed = 0;
        this.copyIds = [].concat(this.copyIds); // array-ify ints
        return super.open(args);
    }

    async captureNext(ids: number[]): Promise<any> {
        if (ids.length === 0) {
            return Promise.resolve();
        }

        return this.net.request(
            'open-ils.circ', 'open-ils.circ.checkin.override',
            this.auth.token(), {
                copy_id: ids.pop(),
                circ_lib: this.auth.user().ws_ou(),
                ff_action: this.ff_action
            }
        ).toPromise().then(
            async(result) => {
                const resp = [].concat(result);
                if (this.evt.parse(resp[0])?.success) {
                    this.numSucceeded++;
                    this.toast.success(await this.successMsg.current());
                } else {
                    this.numFailed++;
                    console.error(this.evt.parse(resp[0]));
                    this.toast.warning(await this.errorMsg.current());
                }
                this.captureNext(ids);
            }
        );
    }

    async captureBatch(): Promise<any> {
        this.numSucceeded = 0;
        this.numFailed = 0;
        const ids = [].concat(this.copyIds);
        await this.captureNext(ids);
        this.close(this.numSucceeded > 0);
    }
}



