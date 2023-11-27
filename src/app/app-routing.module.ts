import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridComponent} from "./components/grid/grid.component";

const routes: Routes = [
  {
    path:"home",
    component:GridComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
