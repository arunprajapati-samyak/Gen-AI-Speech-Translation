import { Routes } from '@angular/router';
import { HostComponent } from './features/host/host.component';
import { ReceiverComponent } from './features/receiver/receiver.component';

export const routes: Routes = [
    {path : "",component : ReceiverComponent},
    {path : "host",component : HostComponent}
];
