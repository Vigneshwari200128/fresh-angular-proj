import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/chat';
  private historyUrl = 'http://localhost:3000/chats';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<{ reply: string }> {
    return this.http
      .post<any>(this.apiUrl, { message }, { responseType: 'text' as 'json' })
      .pipe(
        map((raw: any) => {
          let data: any = raw;
          if (typeof raw === 'string') {
            try {
              data = JSON.parse(raw);
            } catch {
              // plain text response
              return { reply: raw };
            }
          }

          let reply = '';
          if (typeof data === 'string') {
            reply = data;
          } else if (data?.reply) {
            reply = data.reply;
          } else if (data?.response) {
            reply = data.response;
          } else if (data?.message) {
            reply = data.message;
          } else if (data?.choices?.[0]?.message?.content) {
            reply = data.choices.message.content;
          }
          return { reply };
        }),
        catchError((error) => { throw error; })
      );
  }

  // New method to get the complete chat history
  getHistory(): Observable<{ sender: string; text: string }[]> {
    return this.http.get<{ sender: string; text: string }[]>(this.historyUrl);
  }
}
