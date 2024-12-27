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
    private usersSubject = new BehaviorSubject<any[]>([]);


    // Observable streams for components to subscribe
    public messages$ = this.messagesSubject.asObservable();
    public users$ = this.usersSubject.asObservable();

    constructor() { }

    public startConnection(userName: any, type: any, lang: any): void {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            console.log('SignalR connection already established');
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
                    console.log('SignalR connected');
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
            console.log([...currentMessages, { user, message }])

            // this.messages.push({ time, user, message });
            // console.log(this.messages);
        });

        // Listen for updated user list
        this.hubConnection?.on('UpdateUserList', (users: any) => {
            // this.loggedInUsers = users;
            console.log(users)
            this.usersSubject.next(users);
        });

        // Listen for user login notifications
        this.hubConnection?.on('UserLoggedIn', (username: string) => {
            console.log(`${username} logged in`);
        });

        // Listen for user logout notifications
        this.hubConnection?.on('UserLoggedOut', (username: string) => {
            console.log(`${username} logged out`);
        });
    }

    public login(userName: any, type: any, lang: any): void {
        this.hubConnection?.invoke('Login', userName, type, lang).then((a) => console.log(a)
        ).catch((err) => console.error(err, 'login'));
    }

    public sendMessage(user: string, message: string): void {
        this.hubConnection?.invoke('SendMessage', user, message).catch((err) => console.error(err));
    }
}
