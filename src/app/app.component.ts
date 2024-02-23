import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule aqui
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Adicione o CommonModule aqui
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  usersData: any[] = [];

  constructor() {
    this.fetchUserData();
  }

  fetchUserData() {
    fetch('https://api.github.com/users')
      .then(data => data.json())
      
      .then((data: any[]) => {
        this.usersData = data;
        console.log(data)
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error);
      });
  }

  openUserDetails(user: any) {
    const userDetails = Object.keys(user).map(key => `${key}: ${user[key]}`).join('\n');
    const userDetailsWindow = window.open('', '_blank');
    if (userDetailsWindow) {
      userDetailsWindow.document.write('<pre>' + userDetails + '</pre>');
      userDetailsWindow.document.close();
    } else {
      alert('Por favor, habilite pop-ups para ver os detalhes do usuário.');
    }
  }
}