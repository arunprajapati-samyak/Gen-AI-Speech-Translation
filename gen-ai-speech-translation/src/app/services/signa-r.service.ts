import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | undefined;
    // public loggedInUsers: string[] = [];
    // public messages: { time: string; user: string; message: string }[] = [];

    // Subjects to track messages and logged-in users
    private messagesSubject = new BehaviorSubject<{ user: string; message: string }[]>([]);
    private usersSubject = new BehaviorSubject<{ userName: string, type: string, lang: string }[]>([]);


    // Observable streams for components to subscribe
    public messages$ = this.messagesSubject.asObservable();
    public users$ = this.usersSubject.asObservable();
    public login$ = this.usersSubject.asObservable();


    constructor() { }

    public startConnection(userName: any, type: any, lang: any): void {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            return;
        } else {
            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl('http://10.100.111.1:7096/signalRConnection', {
                    transport: signalR.HttpTransportType.WebSockets, // Force WebSockets for testing
                    skipNegotiation: true, // Required when forcing WebSockets
                })
                .configureLogging(signalR.LogLevel.Information) // Enable detailed logging
                .withAutomaticReconnect([500, 1000, 2500, 5000])
                .build();

            this.hubConnection
                .start()
                .then(() => {
                    this.login(userName, type, lang);
                }
                )
                .catch((err: any) => console.error('SignalR connection error:', err));

            this.listenForServerEvents();
        }
    }

    public listenForServerEvents(): void {
        // Listen for new messages
        this.hubConnection?.on('ReceiveMessage', async (date: string, user: string, message: string) => {
            const currentMessages = await firstValueFrom(this.messages$);
            this.messagesSubject.next([...currentMessages, { user, message }]);

            // this.messages.push({ time, user, message });
            // console.log(this.messages);
        });

        // Listen for updated user list
        this.hubConnection?.on('UpdateUserList', (users: { userName: string, type: string, lang: string }[]) => {
            // this.loggedInUsers = users;
            this.usersSubject.next(users);
        });

        // Listen for user login notifications
        this.hubConnection?.on('UserLoggedIn', (username: any) => {
        });

        // Listen for user logout notifications
        this.hubConnection?.on('UserLoggedOut', (username: string) => {
        });
    }

    public login(userName: any, type: any, lang: any): void {
        this.hubConnection?.invoke('Login', userName, type, lang).then((a) => {
            if (type == "Receiver") {
                sessionStorage.setItem("userName", userName);
                sessionStorage.setItem("type", type);
                sessionStorage.setItem("lang", lang);
            }
        }
        ).catch((err) => console.error(err, 'login'));
    }

    public sendMessage(user: string, message: string): void {
        this.hubConnection?.invoke('SendMessage', user, message).catch((err) => console.error(err));
    }
}
