import { NgModule } from '@angular/core';
import { CloseLoanModalComponent } from './close-loan-modal.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        CloseLoanModalComponent
    ],
    imports: [
        MatIconModule
    ],
    exports: [
        CloseLoanModalComponent
    ],
    providers: [],
    bootstrap: [CloseLoanModalComponent]
})
export class CloseLoanModalModule { }