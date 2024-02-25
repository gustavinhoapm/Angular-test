import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserDetailsService } from './user-details.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'

})

export class AppComponent implements OnInit {
  usersData: any[] = [];

  constructor(private userDetails: UserDetailsService) { }

  ngOnInit() {
    this.loadUserDataFromLocalStorage();
    this.fetchUserData();
  }

  fetchUserData() {
    fetch('https://api.github.com/users')
      .then(data => data.json())
      .then((data: any[]) => {
        this.usersData = data;
        this.saveUserDataToLocalStorage();
        console.log(data)
      })
      .catch(error => {
        console.error('Erro ao obter dados:', error);
      });
  }

  openUserDetails(user: any) {
    this.userDetails.openUserDetails(user);
  }

  confirmAndDeleteUser(event: Event, user: any) {
    event.stopPropagation();
    if (this.confirmDelete(user.login)) {
      const index = this.usersData.indexOf(user);
      if (index !== -1) {
        this.usersData.splice(index, 1);
        this.saveUserDataToLocalStorage();
      }
    }
  }

  confirmDelete(username: string): boolean {
    return confirm(`Você deseja excluir o usuário ${username}?`);
  }

  saveUserDataToLocalStorage() {
    localStorage.setItem('usersData', JSON.stringify(this.usersData));
  }

  loadUserDataFromLocalStorage() {
    const savedData = localStorage.getItem('usersData');
    if (savedData) {
      this.usersData = JSON.parse(savedData);
    }
  }
}