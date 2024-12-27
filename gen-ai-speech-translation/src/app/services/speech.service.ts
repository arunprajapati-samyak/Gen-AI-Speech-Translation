import { Injectable } from '@angular/core';
import { SignalRService } from './signa-r.service';

@Injectable({
    providedIn: 'root',
})
export class SpeechService {
    constructor(private signalRService: SignalRService) {

    }
    private recognition: any | null = null;

    initializeRecognition(
        language: string = 'en-US',
        onResult: (text: string) => void,
        onError?: (error: string) => void
    ) {
        const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'];
        if (!SpeechRecognition) {
            console.error('Web Speech API is not supported in this browser.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = language;
        this.recognition.continuous = true; // Keep recognizing speech in real-time
        this.recognition.interimResults = true; // Provide partial (interim) results
        let fullTranscription = ''; // Keep track of the full transcript
        this.recognition.onresult = (event: any) => {
            let interimTranscription = '';
            let finalTranscription = '';
            console.log('event',event);
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    fullTranscription += result[0].transcript + ' ';
                    finalTranscription += result[0].transcript;
                } else {
                    interimTranscription += result[0].transcript;
                }
            }
            this.signalRService.sendMessage("Arun", finalTranscription);
            console.log('fullTranscription', fullTranscription, 'interimTranscription', interimTranscription, 'combine', fullTranscription + interimTranscription);
            onResult(fullTranscription + interimTranscription);
        };

        this.recognition.onerror = (event: any) => {
            if (onError) {
                onError(event.error);
            }
        };
    }

    startRecognition() {
        if (this.recognition) {
            this.recognition.start();
        }
    }

    stopRecognition() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
