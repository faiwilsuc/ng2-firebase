import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

import { MessageModalComponent } from '../../components/message-modal/message-modal.component';

@NgModule({
  declarations: [
    MessageModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterializeModule
  ],

  exports: [
    MessageModalComponent
  ]
})
export class SharedModule { }
