import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PostModule {
  title: string;
  content: string;
  id?: string;
}
