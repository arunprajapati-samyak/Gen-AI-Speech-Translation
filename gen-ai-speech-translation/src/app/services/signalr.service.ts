import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root',
})
export class SignalRService {
    private hubConnection: signalR.HubConnection | undefined;
    public loggedInUsers: string[] = [];
    public messages: { time: string; user: string; message: string }[] = [];

    constructor() { }

    public startConnection(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://10.100.111.106:7096/signalRConnection', {
                transport: signalR.HttpTransportType.WebSockets, // Force WebSockets for testing
                skipNegotiation: true, // Required when forcing WebSockets
            })
            .configureLogging(signalR.LogLevel.Information) // Enable detailed logging
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('SignalR connected'))
            .catch((err) => console.error('SignalR connection error:', err));

        this.listenForServerEvents();
    }

    public listenForServerEvents(): void {
        // Listen for new messages
        this.hubConnection?.on('ReceiveMessage', (time: string, user: string, message: string) => {
            this.messages.push({ time, user, message });
            console.log(this.messages);
        });

        // Listen for updated user list
        this.hubConnection?.on('UpdateUserList', (users: string[]) => {
            this.loggedInUsers = users;
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

    public login(username: string): void {
        this.hubConnection?.invoke('Login', username).catch((err) => console.error(err));
    }

    public sendMessage(user: string, message: string): void {
        this.hubConnection?.invoke('SendMessage', user, message).catch((err) => console.error(err));
    }
}
