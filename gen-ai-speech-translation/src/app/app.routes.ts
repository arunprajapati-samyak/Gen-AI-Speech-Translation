import { Routes } from '@angular/router';
import { HostComponent } from './features/host/host.component';
import { ReceiverComponent } from './features/receiver/receiver.component';
import { LoginComponent } from './features/login/login.component';
import { SpeechSummaryComponent } from './features/speech-summary/speech-summary.component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "receiver", component: ReceiverComponent },
    { path: "host", component: HostComponent },
    { path: "summary", component: SpeechSummaryComponent }
];
