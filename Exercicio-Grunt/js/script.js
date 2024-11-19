let editIndex = null; // Índice do item sendo editado, null se for novo

// Início da implementação de verificação e bloqueio de sistema após 3 dias de testes
/* function iniciarSessao() {
    if (!localStorage.getItem('horaInicio')) {
        const agora = new Date().getTime();
        localStorage.setItem('horaInicio', agora);
    }
}

function verificarTempoRestante() {
    const horaInicio = localStorage.getItem('horaInicio');
    if (horaInicio) {
        const agora = new Date().getTime();
        const tempoDecorrido = (agora - horaInicio) / 1000 / 60; // Converte para minutos
        const limiteMinutos = 3 * 24 * 60; // 3 dias em minutos (4320)

        if (tempoDecorrido >= limiteMinutos) {
            bloquearAcesso();
        } else {
            const minutosRestantes = Math.ceil(limiteMinutos - tempoDecorrido);
            console.log(`Tempo restante: ${minutosRestantes} minutos`);
        }
    }
}

function bloquearAcesso() {
    alert('Seu tempo de teste expirou. Entre em contato para obter acesso completo.');
    localStorage.removeItem('horaInicio'); // Limpa o registro de início de sessão
    window.location.href = '/bloqueado.html'; // Redireciona para uma página de bloqueio
    clearInterval(timerVerificacao); // Cancela o timer de verificação
}

iniciarSessao();

const timerVerificacao = setInterval(() => {
    verificarTempoRestante();
}, 1000 * 60); */ // Verifica a cada 1 minuto
// Fim da implementação de verificação e bloqueio de sistema após 3 dias de testes

document.getElementById("vehicleForm").addEventListener("submit", function (event) {
   event.preventDefault();

   const vehicleType = document.getElementById("vehicleType").value;
   const plate = document.getElementById("plate").value;
   const color = document.getElementById("color").value;
   const owner = document.getElementById("owner").value;
   const apartment = document.getElementById("apartment").value;
   const block = document.getElementById("block").value;
   const parkingSpot = document.getElementById("parkingSpot").value;
   const entryTime = document.getElementById("entryTime").value;
   const entryDate = document.getElementById("entryDate").value;
   const parkingDuration = parseInt(document.getElementById("parkingDuration").value);

   const vehicle = { vehicleType, plate, color, owner, apartment, block, parkingSpot, entryTime, entryDate, parkingDuration };

   let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

   if (editIndex !== null) {
       vehicles[editIndex] = vehicle; // Atualiza o item existente
       editIndex = null;
   } else {
       vehicles.push(vehicle); // Adiciona novo item
   }

   localStorage.setItem("vehicles", JSON.stringify(vehicles));
   updateVehicleTable();
   document.getElementById("vehicleForm").reset();
});

// Calcula o tempo excedido
function calculateExceededTime(entryTime, entryDate, duration) {
   const entryDateTime = new Date(`${entryDate}T${entryTime}`);
   const currentTime = new Date();
   const allowedEndTime = new Date(entryDateTime.getTime() + duration * 60000);

   if (currentTime > allowedEndTime) {
       const exceededTime = Math.floor((currentTime - allowedEndTime) / 60000);
       return exceededTime; // Tempo excedido em minutos
   }
   return 0; // Não excedeu
}

// Atualiza os tempos excedidos
function updateExceededTimes() {
   const rows = document.querySelectorAll("#vehicleTable tr");
   const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

   rows.forEach((row, index) => {
       if (index < vehicles.length) {
           const vehicle = vehicles[index];
           const exceededTime = calculateExceededTime(
               vehicle.entryTime,
               vehicle.entryDate,
               vehicle.parkingDuration
           );

           const exceededCell = row.cells[10];
           exceededCell.innerText = exceededTime > 0 ? `${exceededTime} min` : "No prazo";
           exceededCell.className = exceededTime > 0 ? "text-danger" : "text-success";
       }
   });
}

// Atualiza a tabela de veículos
function updateVehicleTable() {
   const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
   const vehicleTable = document.getElementById("vehicleTable");
   vehicleTable.innerHTML = "";

   vehicles.forEach((vehicle, index) => {
       const row = vehicleTable.insertRow();

       row.insertCell(0).innerText = vehicle.vehicleType;
       row.insertCell(1).innerText = vehicle.plate;
       row.insertCell(2).innerText = vehicle.color;
       row.insertCell(3).innerText = vehicle.owner;
       row.insertCell(4).innerText = vehicle.apartment;
       row.insertCell(5).innerText = vehicle.block;
       row.insertCell(6).innerText = vehicle.parkingSpot;
       row.insertCell(7).innerText = vehicle.entryTime;
       row.insertCell(8).innerText = vehicle.entryDate;
       row.insertCell(9).innerText = `${vehicle.parkingDuration} min`;

       // Calcula e exibe o tempo excedido inicialmente
       const exceededTime = calculateExceededTime(
           vehicle.entryTime,
           vehicle.entryDate,
           vehicle.parkingDuration
       );
       const exceededCell = row.insertCell(10);
       exceededCell.innerText = exceededTime > 0 ? `${exceededTime} min` : "No prazo";
       exceededCell.className = exceededTime > 0 ? "text-danger" : "text-success";

       // Cria os botões de ações
       const actionsCell = row.insertCell(11);
       actionsCell.className = "actions-cell";

       const editButton = document.createElement("button");
       editButton.className = "btn btn-warning btn-sm";
       editButton.innerText = "Editar";
       editButton.onclick = function () {
           loadVehicleData(index);
       };
       actionsCell.appendChild(editButton);

       const deleteButton = document.createElement("button");
       deleteButton.className = "btn btn-danger btn-sm";
       deleteButton.innerText = "Excluir";
       deleteButton.onclick = function () {
           deleteVehicle(index);
       };
       actionsCell.appendChild(deleteButton);
   });
}

// Carrega os dados no formulário para edição
function loadVehicleData(index) {
   const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
   const vehicle = vehicles[index];

   document.getElementById("vehicleType").value = vehicle.vehicleType;
   document.getElementById("plate").value = vehicle.plate;
   document.getElementById("color").value = vehicle.color;
   document.getElementById("owner").value = vehicle.owner;
   document.getElementById("apartment").value = vehicle.apartment;
   document.getElementById("block").value = vehicle.block;
   document.getElementById("parkingSpot").value = vehicle.parkingSpot;
   document.getElementById("entryTime").value = vehicle.entryTime;
   document.getElementById("entryDate").value = vehicle.entryDate;
   document.getElementById("parkingDuration").value = vehicle.parkingDuration;


   editIndex = index;
}

// Exclui um veículo
function deleteVehicle(index) {
   const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
   vehicles.splice(index, 1);
   localStorage.setItem("vehicles", JSON.stringify(vehicles));
   updateVehicleTable();
}

// Filtro de veículos na tabela
function filterVehicles() {
   const searchInput = document.getElementById("searchInput").value.toLowerCase();
   const rows = document.querySelectorAll("#vehicleTable tr");


   rows.forEach(row => {
       const [vehicleType, plate, , owner] = row.cells;
       const text = `${vehicleType.textContent} ${plate.textContent} ${owner.textContent}`.toLowerCase();
       row.style.display = text.includes(searchInput) ? "" : "none";
   });
}

document.getElementById("btnCancelar").addEventListener("click", function () {
   document.getElementById("vehicleForm").reset();
   editIndex = null;
});

document.getElementById("searchInput").addEventListener("input", filterVehicles);

// Atualiza a tabela e o tempo excedido periodicamente
updateVehicleTable();
setInterval(updateExceededTimes, 60000);


