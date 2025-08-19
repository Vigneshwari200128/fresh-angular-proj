import { Component, ElementRef, ViewChild, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../chat-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot implements OnInit {

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;

  messages: { from: 'user' | 'bot', text: string }[] = [];
  userInput: string = '';
  isSending = false;

  private readonly isBrowser: boolean;

  constructor(
    private chatService: ChatService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const link = this.doc.getElementById('theme-link') as HTMLLinkElement | null;
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('theme-href') : null;
    if (link && saved) {
      link.setAttribute('href', saved);
    }

    // Load chat history on init
    this.chatService.getHistory().subscribe(history => {
      this.messages = history.map(msg => ({
        from: msg.sender === 'user' ? 'user' : 'bot',
        text: msg.text
      }));
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  sendMessage() {
    const trimmed = this.userInput.trim();
    if (!trimmed || this.isSending) return;

    this.messages.push({ from: 'user', text: trimmed });
    this.scrollToBottom();
    this.userInput = '';
    this.isSending = true;

    this.chatService
      .sendMessage(trimmed)
      .pipe(finalize(() => (this.isSending = false)))
      .subscribe(
        response => {
          if (response && response.reply) {
            this.messages.push({ from: 'bot', text: response.reply });
          } else {
            this.messages.push({ from: 'bot', text: 'No response from bot.' });
          }
          this.scrollToBottom();
        },
        error => {
          const message = error?.error?.message || error?.message || 'Backend issue.';
          this.messages.push({ from: 'bot', text: `Error: ${message}` });
          this.scrollToBottom();
        }
      );
  }

  toggleTheme(): void {
    if (!this.isBrowser) return;
    const link = this.doc.getElementById('theme-link') as HTMLLinkElement | null;
    if (!link) return;
    const current = link.getAttribute('href') || '';
    const dark = 'https://cdn.jsdelivr.net/npm/@angular/material@20.1.6/prebuilt-themes/purple-green.css';
    const light = 'https://cdn.jsdelivr.net/npm/@angular/material@20.1.6/prebuilt-themes/indigo-pink.css';
    const next = current.includes('purple-green') ? light : dark;
    link.setAttribute('href', next);
    try { localStorage.setItem('theme-href', next); } catch {}
  }
}
