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
  loginsString: string = '';

  constructor() {
    this.getDate();
  }

  getDate() {
    fetch('https://api.github.com/users')
      .then(data => data.json())
      .then((data: { login: string }[]) => {
        this.loginsString = data.map(obj => obj.login).join('\n');
        console.log(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error);
      });
  }
}
