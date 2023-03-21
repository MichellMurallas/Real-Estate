(function() {
  
  const lat = 4.7212732;
  const lng = -74.0410096;
  const mapa = L.map('mapa').setView([lat, lng ], 15);
  let marker;

  //Utilizar Provider y Geocode
  const geocodeService = L.esri.Geocoding.geocodeService()
  

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapa);


  //Pin:
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true
  })
  .addTo(mapa)
 
  //Detectar el movimiento del pin
  marker.on("moveend", function(e){
    marker = e.target
    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

    //Obtener la informacion de las calles al soltar el pin:
    geocodeService.reverse().latlng(posicion, 15).run(function(error, resultado){
      marker.bindPopup(resultado.address.LongLabel)
    })
    })

})()