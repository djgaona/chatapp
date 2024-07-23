import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  messages: Observable<any[]>;
  newMessage: string = '';
  userId: string;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.messages = this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges();
      }
    });
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') return;

    await this.afs.collection('messages').add({
      text: this.newMessage,
      createdAt: new Date(),
      userId: this.userId
    });

    this.newMessage = '';
  }
}
