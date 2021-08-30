import { NgModule } from '@angular/core';
import { CloseLoanModalComponent } from './close-loan-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        CloseLoanModalComponent
    ],
    imports: [
        MatIconModule,        
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule
    ],
    exports: [
        CloseLoanModalComponent
    ],
    providers: [],
    bootstrap: [CloseLoanModalComponent]
})
export class CloseLoanModalModule { }