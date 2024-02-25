import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor() { }

  async openUserDetails(user: any) {
    async function getUrlDetails(data: any): Promise<string> {
      const urlDetails = await Promise.all(Object.keys(data)
        .filter(key => ['name', 'location', 'email'].includes(key))
        .map(async key => {
          if (key === 'location') {
            const locationName = await getLocationName(data[key]);
            return `<strong>${key}:</strong> ${locationName}<br><br>`;
          } else {
            return `<strong>${key}:</strong> ${data[key]}<br><br>`;
          }
        }));
    
      return urlDetails.join(''); 
    }

    async function getLocationName(location: string): Promise<string> {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].display_name; // Retorna o nome da localização
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

    console.log(user);
    const userDetails = Object.keys(user)
      .map(key => {
        let value = user[key];
        if (typeof value === 'string' && value.startsWith('http')) {
          if (key === 'avatar_url') {
            value = `<img src="${value}" alt="Avatar" style="max-width: 100px; max-height: 100px;">`;
          } else {
            value = `<a href="${value}" target="_blank">${value}</a>`;
          }
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
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
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
