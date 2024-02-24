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
    fetch('https://api.github.com/users')
      .then(data => data.json())      
      .then((data: any[]) => {
        this.usersData = data;

      })
      .catch(error => {
        console.error('Erro ao obter dados:', error);
      });
  }

  openUserDetails(user: any) {
    this.userDetails.openUserDetails(user);
  }
}