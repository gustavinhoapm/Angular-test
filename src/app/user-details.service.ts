import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }

  async openUserDetails(user: any) {
    async function getUrlDetails(data: any): Promise<string> {
      try {
        if (!data || typeof data !== 'object') {
          throw new Error('Dados inválidos. Esperava-se um objeto.');
        }

        const keysToShow = ['name', 'location', 'email'];
        const urlDetails = await Promise.all(
          Object.keys(data)
            .filter(key => keysToShow.includes(key))
            .map(async key => {
              if (key === 'location') {
                const locationName = await getLocationName(data[key]);
                return `<strong>${key}:</strong> ${locationName}<br><br>`;
              } else {
                return `<strong>${key}:</strong> ${data[key]}<br><br>`;
              }
            })
        );

        return urlDetails.join('');
      } catch (error) {
        console.error('Erro ao obter detalhes da URL:', error);
        throw new Error('Erro ao obter detalhes da URL. Por favor, tente novamente mais tarde.');
      }
    }

    async function getLocationName(location: string): Promise<string> {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].display_name;
      } else {
        throw new Error('Localização não encontrada');
      }
    }

    async function getLocationCoordinates(location: string): Promise<[number, number]> {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        throw new Error('Localização não encontrada');
      }
    }


    let userDetails = '';
    if (user.avatar_url && typeof user.avatar_url === 'string' && user.avatar_url.startsWith('http')) {
      userDetails += `<strong>avatar_url:</strong><br><img src="${user.avatar_url}" alt="Avatar" style="max-width: 100px; max-height: 100px;"><br><br>`;
    }
    userDetails += Object.keys(user)
      .filter(key => key !== 'avatar_url')
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
      try {
        const response = await fetch(user.url);
        const data = await response.json();
        const urlDetails = await getUrlDetails(data);

        const coordinates = await getLocationCoordinates(data['location']);
        const [latitude, longitude] = coordinates;

        userDetailsWindow.document.write(`
          <html>
            <head>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Noto+Sans+Linear+B&display=swap"
            rel="stylesheet">
            <link rel="shortcut icon" type="imagex/png" href="../assets/img/logo.png">
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
              <title>Detalhes do Usuário</title>
              
              <style>
              body {
                background-image: url("./assets/img/logosvg.svg");
                background-color: #353535;
                background-repeat: no-repeat;
                background-size: 70%;
                background-position: center;
                font-family: "Inter", sans-serif;
              }

              .user-details {
                background-color: #424242aa;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 50%;
                margin: 0 auto;
              }

              .user-details h2 {
                color: #28a745;
                margin-bottom: 10px;
              }

              .user-details p {
                color: #f2f2f2;
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

              #map {
                height: 350px;
                width: 100%;
              }
              </style>
              </head>
              <body>
                <div class="user-details">
                  <h2>Detalhes do Usuário</h2>
                  <p>${userDetails}</p>
                  <h3>Detalhes Pessoais:</h3>
                  <p>${urlDetails}</p>
                  <h3>localização:</h3>
                  <div id="map"></div>
                  <div class="buttons-container">
                    <button class="button" onclick="window.close()">Fechar</button>
                  </div>
                </div>
                <script>
                  var map = L.map('map').setView([${latitude}, ${longitude}], 13);

                  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  }).addTo(map);
                  
                  L.marker([${latitude}, ${longitude}]).addTo(map)
                      .bindPopup('${user.login}')
                      .openPopup();
                </script>
              </body>
            </html>
          `);
        userDetailsWindow.document.close();
      } catch (error) {
        console.error('Erro ao carregar detalhes do URL:', error);
        userDetailsWindow.close();
      }
    } else {
      alert('Por favor, habilite pop-ups para ver os detalhes do usuário.');
    }
  }
}
