import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitiesDataComponent } from './cities/cities-data/cities-data.component';

const routes: Routes = [
  {path:'', component:CitiesDataComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
