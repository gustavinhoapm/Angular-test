import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }

  openUserDetails(user: any) {
    const userDetails = Object.keys(user)
      .map(key => {
        let value = user[key];
        if (typeof value === 'string' && value.startsWith('http')) {
          value = `<a href="${value}" target="_blank">${value}</a>`;
        }
        return `<strong>${key}:</strong> ${value}<br><br>`;
      })
      .join('');
    const userDetailsWindow = window.open('', '_blank');
    if (userDetailsWindow) {
      userDetailsWindow.document.write(`
        <html>
          <head>
            <title>Detalhes do Usuário</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 20px;
              }

              .user-details {
                background-color: #fff;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                margin: 0 auto;
              }

              .user-details h2 {
                color: #333;
                margin-bottom: 10px;
              }

              .user-details p {
                color: #666;
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <div class="user-details">
              <h2>Detalhes do Usuário</h2>
              <p>${userDetails}</p>
            </div>
          </body>
        </html>
      `);
      userDetailsWindow.document.close();
    } else {
      alert('Por favor, habilite pop-ups para ver os detalhes do usuário.');
    }
  }
}
