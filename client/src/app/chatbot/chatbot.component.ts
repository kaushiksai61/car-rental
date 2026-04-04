import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  isOpen:     boolean = false;
  isTyping:   boolean = false;
  isCustomer: boolean = false;
  userInput:  string  = '';
  messages:   Message[] = [];

  private apiUrl = environment.apiUrl;

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isCustomer = this.auth.getRole() === 'CUSTOMER';
    this.messages.push({
      role:    'assistant',
      content: `Hi there! 👋 I'm **NOVA**, your CarRental assistant.\n\nI can help you with booking a car, understanding your booking status, license requirements, and more.\n\nWhat can I help you with today? 🚗`,
      time:    this.getTime()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  getTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom(): void {
    try {
      if (this.messagesEnd) {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {}
  }

  async sendMessage(): Promise<void> {
    const text = this.userInput.trim();
    if (!text || this.isTyping) return;

    this.messages.push({ role: 'user', content: text, time: this.getTime() });
    this.userInput = '';
    this.isTyping  = true;

    try {
      // 🔥 CLEAN FIX: send ONLY user messages
      const trimmed = this.messages
        .filter(m => m.role === 'user')
        .slice(-5)
        .map(m => ({ role: 'user', content: m.content }));

      const payload = { messages: trimmed };

      const headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.auth.getToken()
      });

      const response: any = await this.http.post(
        `${this.apiUrl}/api/chat/message`,
        payload,
        { headers, responseType: 'text' }
      ).toPromise();

      const parsed = typeof response === 'string' ? JSON.parse(response) : response;

      if (parsed?.content && parsed.content[0]?.text) {
        this.messages.push({
          role:    'assistant',
          content: parsed.content[0].text,
          time:    this.getTime()
        });
      } else {
        this.messages.push({
          role:    'assistant',
          content: 'Sorry, I had trouble understanding that. Please try again! 🙏',
          time:    this.getTime()
        });
      }

    } catch (err: any) {
      console.error('Chat error:', err);

      let msg = 'Oops! Something went wrong. Please try again. 🔌';
      if (err?.status === 429) {
        msg = 'Too many messages! Please wait a moment and try again. ⏳';
      }

      this.messages.push({
        role:    'assistant',
        content: msg,
        time:    this.getTime()
      });
    }

    this.isTyping = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [{
      role:    'assistant',
      content: `Hi there! 👋 I'm **NOVA**, your CarRental assistant.\n\nI can help you with booking a car, understanding your booking status, license requirements, and more.\n\nWhat can I help you with today? 🚗`,
      time:    this.getTime()
    }];
  }

  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  getQuickReplies(): string[] {
    return [
      'How do I book a car?',
      'What is the license format?',
      'How to view my bookings?',
      'How does payment work?'
    ];
  }

  quickReply(text: string): void {
    this.userInput = text;
    this.sendMessage();
  }
}