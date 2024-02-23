import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoading: boolean = false;
  

  
  constructor() {
    this.getDate();
  }

  getDate(){
    this.isLoading = true;
    fetch('https://api.github.com/users')
    .then(data => data.json( ) ) 
    .then(data => {console.log(data)})
    .catch( _ => { console.log(_)})
    .finally( () => {
      this.isLoading = false;
    })
  }
}
