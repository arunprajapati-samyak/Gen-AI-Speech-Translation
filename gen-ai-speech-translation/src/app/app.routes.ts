import { Routes } from '@angular/router';
import { HostComponent } from './features/host/host.component';
import { ReceiverComponent } from './features/receiver/receiver.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "receiver", component: ReceiverComponent },
    { path: "host", component: HostComponent }
];
