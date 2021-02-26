import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    HeaderComponent],
  providers: [],
  bootstrap: [HeaderComponent]
})
export class HeaderModule { }
