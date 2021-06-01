import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LoanInProgressComponent} from './loan-in-progress.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Common } from '../../common/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    LoanInProgressComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatCheckboxModule,
    MatBadgeModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,

  ],
  exports: [
    LoanInProgressComponent],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: Common.MY_FORMATS},
  ],
  bootstrap: [LoanInProgressComponent]
})
export class LoanInProgressModule { }
