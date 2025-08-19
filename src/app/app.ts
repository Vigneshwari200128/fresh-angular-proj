import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { ConversationList } from "./components/conversation-list/conversation-list";
import { Chatbot } from "./components/chatbot/chatbot";
import { EditConversation } from "./components/edit-conversation/edit-conversation";
// HttpClient is provided via application config; no need to import the module in standalone



@Component({
  selector: 'app-root',
  standalone: true, // <-- comma here
  imports: [Chatbot, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ai-chatbot');
}
