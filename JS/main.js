document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop(); // archivo actual

    // -------------------- VERIFICAR SESIÓN --------------------
    if (path !== 'login.html' && !localStorage.getItem('loggedIn')) {
        // Si no está logueado y no está en login.html → enviar a login
        window.location.href = 'login.html';
        return;
    }

    // -------------------- LOGIN --------------------
    const loginForm = document.getElementById('loginform');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const rut = document.getElementById('rut').value.trim();
            const password = document.getElementById('password').value.trim();

            // Usuario fijo
            const validRut = '20555432-6';
            const validPassword = 'pass123';

            if (rut === validRut && password === validPassword) {
                localStorage.setItem('username', 'Juan Pérez');
                localStorage.setItem('cta', '11223344555');
                localStorage.setItem('saldo', 1250000);
                localStorage.setItem('loggedIn', 'true');

                // Redirigir al menú después del login correcto
                window.location.href = 'menu.html';
            } else {
                alert('RUT o contraseña incorrectos.');
            }
        });
    }

    // -------------------- LOGOUT --------------------
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('cta');
            localStorage.removeItem('saldo');
            window.location.href = 'login.html';
        });
    }

    // -------------------- MENU.HTML --------------------
    const usernameEl = document.getElementById('username');
    const ctaEl = document.getElementById('cta');
    const saldoEl = document.getElementById('saldo');

    if (usernameEl && ctaEl && saldoEl) {
        usernameEl.textContent = localStorage.getItem('username') || 'Usuario';
        ctaEl.textContent = localStorage.getItem('cta') || '000000000';
        saldoEl.textContent = `$${Number(localStorage.getItem('saldo') || 0).toLocaleString()}`;
    }

    // -------------------- DEPOSITOS --------------------
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('amount').value.replace(/\$/g, '').replace(/,/g, ''));
            if (!isNaN(amount) && amount > 0) {
                let saldoActual = Number(localStorage.getItem('saldo') || 0) + amount;
                localStorage.setItem('saldo', saldoActual);

                let transacciones = JSON.parse(localStorage.getItem('transactions') || '[]');
                transacciones.push({ tipo: 'Depósito', monto: amount, fecha: new Date().toLocaleString(), cuenta: localStorage.getItem('cta') });
                localStorage.setItem('transactions', JSON.stringify(transacciones));

                alert(`Depósito de $${amount.toLocaleString()} realizado con éxito!`);
                window.location.href = 'menu.html';
            } else {
                alert('Ingrese un monto válido.');
            }
        });
    }

    // -------------------- TRANSFERENCIAS --------------------
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('amount').value.replace(/\$/g, '').replace(/,/g, ''));
            const destinatario = document.getElementById('exampleDataList').value.trim();
            if (!destinatario) return alert('Seleccione un contacto.');
            if (!isNaN(amount) && amount > 0) {
                let saldoActual = Number(localStorage.getItem('saldo') || 0);
                if (amount > saldoActual) return alert('Saldo insuficiente.');

                saldoActual -= amount;
                localStorage.setItem('saldo', saldoActual);

                let transacciones = JSON.parse(localStorage.getItem('transactions') || '[]');
                transacciones.push({ tipo: 'Transferencia', monto: amount, fecha: new Date().toLocaleString(), cuenta: destinatario });
                localStorage.setItem('transactions', JSON.stringify(transacciones));

                alert(`Transferencia de $${amount.toLocaleString()} a ${destinatario} realizada con éxito!`);
                window.location.href = 'menu.html';
            } else alert('Ingrese un monto válido.');
        });
    }

    // -------------------- CONTACTOS --------------------
    window.guardarContacto = function() {
        const name = document.getElementById('contactName').value.trim();
        const rut = document.getElementById('contactRut').value.trim();
        if (!name || !rut) return alert('Complete ambos campos.');

        const datalist = document.getElementById('datalistOptions');
        const option = document.createElement('option');
        option.value = `${name} RUT: ${rut}`;
        datalist.appendChild(option);

        const modalEl = document.getElementById('contactModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        document.getElementById('contactName').value = '';
        document.getElementById('contactRut').value = '';
    }

    // -------------------- TRANSACTIONS.HTML --------------------
    const transactionsContainer = document.getElementById('transactionsContainer');
    if (transactionsContainer) {
        const transacciones = JSON.parse(localStorage.getItem('transactions') || '[]');
        if (transacciones.length === 0) {
            transactionsContainer.innerHTML = '<p>No hay transacciones registradas.</p>';
        } else {
            const table = document.createElement('table');
            table.className = 'table table-striped';
            table.innerHTML = `
                <thead>
                    <tr><th>Tipo</th><th>Monto</th><th>Cuenta / Destinatario</th><th>Fecha</th></tr>
                </thead>
                <tbody>
                    ${transacciones.map(t => `
                        <tr>
                            <td>${t.tipo}</td>
                            <td>$${Number(t.monto).toLocaleString()}</td>
                            <td>${t.cuenta}</td>
                            <td>${t.fecha}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            transactionsContainer.appendChild(table);
        }
    }
});
