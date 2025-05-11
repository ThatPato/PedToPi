// Credenciales para acceder
const credenciales = {
    usuario: "admin",
    contrasena: "12345"
};

// Verifica si el usuario está autenticado
if (window.location.pathname.includes("pedidos.html")) {
    if (!sessionStorage.getItem("autenticado")) {
        window.location.href = "index.html";
    } else {
        cargarPedidos();
    }
}

// Autenticación de usuario
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const usuario = document.getElementById("username").value;
            const contrasena = document.getElementById("password").value;

            if (usuario === credenciales.usuario && contrasena === credenciales.contrasena) {
                sessionStorage.setItem("autenticado", "true");
                window.location.href = "pedidos.html";
            } else {
                document.getElementById("error-msg").innerText = "Usuario o contraseña incorrectos.";
            }
        });
    }
});

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem("autenticado");
    window.location.href = "index.html";
}

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0TcCSmj6L-tKEp1LjxX6XTOmMpw",
    authDomain: "topi-2a6aa.firebaseapp.com",
    databaseURL: "https://topi-2a6aa-default-rtdb.firebaseio.com",
    projectId: "topi-2a6aa",
    storageBucket: "topi-2a6aa.appspot.com",
    messagingSenderId: "507573337677",
    appId: "1:507573337677:web:83637974c940e1a1dee604",
    measurementId: "G-1007T26KF8"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Cargar pedidos desde Firebase
function cargarPedidos() {
    const pedidosRef = database.ref("orders");
    pedidosRef.on("value", (snapshot) => {
        const pedidosBody = document.getElementById("pedidos-body");
        pedidosBody.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            const pedido = childSnapshot.val();
            const pedidoKey = childSnapshot.key;
            const productos = pedido.items.map(p => `${p.name} - $${p.price}`).join("<br>");
            const estado = pedido.estado || "Pendiente";  // Estado por defecto
            const fecha = new Date(pedido.timestamp).toLocaleString();

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>#${pedido.orderNumber}</td>
                <td>${productos}</td>
                <td>$${pedido.total}</td>
                <td>${estado}</td>
                <td>
                    <button onclick="marcarPedido('${pedidoKey}', 'Listo')">Listo</button>
                    <button onclick="marcarPedido('${pedidoKey}', 'Entregado')">Entregado</button>
                </td>
            `;

            pedidosBody.appendChild(row);
        });
    });
    function marcarPedido(key, estado) {
        firebase.database().ref("orders/" + key).update({
            estado: estado
        }).then(() => {
            console.log("Pedido actualizado a:", estado);
        }).catch((error) => {
            alert("Error al actualizar el pedido: " + error.message);
        });
    }
   
}
