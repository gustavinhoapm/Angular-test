import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }

  openUserDetails(user: any, deleteUserCallback: () => void) {
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
                max-width: 50%;
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

              .buttons-container {
                margin-top: 20px;
              }

              .button {
                margin-right: 10px;
                padding: 10px 15px;
                background-color: #ccc;
                color: #000;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease, color 0.3s ease;
                font-size: 18px;
              }

              .button:hover {
                transform: scale(1.1);
                transition: all 0.4s;
                background-color: #000;
                color: #fff;
              }
            </style>
          </head>
          <body>
            <div class="user-details">
              <h2>Detalhes do Usuário</h2>
              <p>${userDetails}</p>
              <div class="buttons-container">
                <button class="button" onclick="window.close()">Voltar</button>
                <button class="button" onclick="deleteUser()">Excluir usuário</button>
              </div>
            </div>
            <script>
              function deleteUser() {
                if (confirm('Tem certeza que deseja excluir este usuário?')) {
                  ${deleteUserCallback()}
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      userDetailsWindow.document.close();
    } else {
      alert('Por favor, habilite pop-ups para ver os detalhes do usuário.');
    }
  }
}
