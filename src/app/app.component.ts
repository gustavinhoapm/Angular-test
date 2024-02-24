import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
import { UserDetailsService } from './user-details.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})

export class AppComponent {
  usersData: any[] = [];

  constructor(private userDetails: UserDetailsService) {
    this.fetchUserData();
  }

  fetchUserData() {
    const token = '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';
    const headers = {
      Authorization: `token ${token}`
    };

    fetch('https://api.github.com/users', { headers })
      .then(data => data.json())
      .then((data: any[]) => {
        this.usersData = data;
        console.log(data);
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error);
      });
  }

  openUserDetails(user: any) {
    this.userDetails.openUserDetails(user);
  }

  confirmAndDeleteUser(event: Event, user: any) {
    event.stopPropagation(); // Evita a propagação do evento de clique para o elemento pai
    if (this.confirmDelete(user.login)) {
      const index = this.usersData.indexOf(user);
      if (index !== -1) {
        this.usersData.splice(index, 1);
      }
    }
  }


confirmDelete(username: string): boolean {
  return confirm(`Você deseja excluir o usuário ${username}?`);
}
}