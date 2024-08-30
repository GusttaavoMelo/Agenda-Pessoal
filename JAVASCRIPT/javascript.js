document.addEventListener('DOMContentLoaded', function() {
    const appointmentInput = document.getElementById('appointment-input');
    const appointmentDate = document.getElementById('appointment-date');
    const appointmentTime = document.getElementById('appointment-time');
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentList = document.getElementById('appointment-list');
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    const closeAlertBtn = document.getElementById('close-alert-btn');

    // Carregar compromissos do localStorage
    loadAppointments();

    // Adicionar novo compromisso
    addAppointmentBtn.addEventListener('click', function() {
        const appointmentText = appointmentInput.value.trim();
        const date = appointmentDate.value;
        const time = appointmentTime.value;

        if (appointmentText !== '' && date !== '' && time !== '') {
            const appointment = { text: appointmentText, date: date, time: time };
            addAppointment(appointment);
            saveAppointment(appointment);
            clearInputFields();

            // Verificar se o compromisso está próximo para exibir alerta
            checkAppointmentAlert(appointment);
        }
    });

    // Função para adicionar compromisso à lista
    function addAppointment(appointment) {
        const li = document.createElement('li');
        const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
        const now = new Date();

        li.innerHTML = `
            <span>${appointment.text} - ${appointment.date} às ${appointment.time}</span>
            <button class="edit-btn">Editar</button>
            <button class="remove-btn">Remover</button>
        `;

        // Verificar se o compromisso já passou e adicionar a classe de estilo
        if (now > appointmentDateTime) {
            li.classList.add('past-appointment');
        }

        const editBtn = li.querySelector('.edit-btn');
        const removeBtn = li.querySelector('.remove-btn');

        editBtn.addEventListener('click', function() {
            editAppointment(li, appointment);
        });

        removeBtn.addEventListener('click', function() {
            appointmentList.removeChild(li);
            removeAppointment(appointment);
        });

        appointmentList.appendChild(li);
    }

    // Função para salvar compromisso no localStorage
    function saveAppointment(appointment) {
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    // Função para remover compromisso do localStorage
    function removeAppointment(appointment) {
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments = appointments.filter(appt => appt.text !== appointment.text || appt.date !== appointment.date || appt.time !== appointment.time);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    // Função para carregar compromissos do localStorage
    function loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.forEach(appointment => {
            addAppointment(appointment);
            checkAppointmentAlert(appointment); // Verifica alertas para compromissos carregados
        });
    }

    // Função para editar compromisso
    function editAppointment(li, appointment) {
        appointmentInput.value = appointment.text;
        appointmentDate.value = appointment.date;
        appointmentTime.value = appointment.time;

        appointmentList.removeChild(li);
        removeAppointment(appointment);
    }

    // Função para limpar os campos de entrada
    function clearInputFields() {
        appointmentInput.value = '';
        appointmentDate.value = '';
        appointmentTime.value = '';
    }

    // Função para verificar e alertar compromissos próximos
    function checkAppointmentAlert(appointment) {
        const now = new Date();
        const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);

        // Defina um limite de tempo para alerta, por exemplo, 30 minutos antes do compromisso
        const alertTime = new Date(appointmentDateTime.getTime() - 30 * 60000); // 30 minutos antes

        if (now >= alertTime && now < appointmentDateTime) {
            // Exibe o modal personalizado em vez do alert padrão
            alertMessage.textContent = `Alerta: O compromisso "${appointment.text}" está próximo às ${appointment.time}.`;
            customAlert.classList.remove('hidden');
        }
    }

    // Fechar o modal personalizado
    closeAlertBtn.addEventListener('click', function() {
        customAlert.classList.add('hidden');
    });
});
