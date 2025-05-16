// Configuración de Firebase
var firebaseConfig = {
    apiKey: "AIzaSyC0TcCSmj6dQCs6L-tKEp1LjxX6XTOmMpw",
    authDomain: "topi-2a6aa.firebaseapp.com",
    databaseURL: "https://topi-2a6aa-default-rtdb.firebaseio.com",
    projectId: "topi-2a6aa",
    storageBucket: "topi-2a6aa.appspot.com",
    messagingSenderId: "507573337677",
    appId: "1:507573337677:web:83637974c940e1a1dee604"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Autenticación simple
function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;

    if (usuario === "admin270" && clave === "cbtis270.") {
        document.getElementById("login").classList.add("oculto");
        document.getElementById("admin").classList.remove("oculto");
        mostrarPedidos(); // Mostrar inmediatamente
        setInterval(mostrarPedidos, 30000); // Actualizar cada 5 segundos
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

// Mostrar pedidos en tabla
function mostrarPedidos() {
    const tabla = document.getElementById("tablaPedidos");
    tabla.innerHTML = "";

    db.ref("pedidos").once("value", (snapshot) => {
        snapshot.forEach((pedido) => {
            const data = pedido.val();
            const cliente = data.cliente || "Sin nombre";
            const estado = data.estado || "pendiente";
            const productos = data.productos || [];

            let productosTexto = "";
            Object.values(productos).forEach((item) => {
                if (item.producto && item.precio !== undefined) {
                    productosTexto += `${item.producto} ($${item.precio})<br>`;
                }
            });

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cliente}</td>
                <td>${productosTexto}</td>
                <td>$${calcularTotal(productos)}</td>
                <td>${estado}</td>
                <td>
                    <button onclick="marcarEntregado('${pedido.key}')">Entregado</button>
                    <button onclick="eliminarPedido('${pedido.key}')">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    });
}

function calcularTotal(productos) {
    let total = 0;
    Object.values(productos).forEach((item) => {
        total += item.precio || 0;
    });
    return total;
}

function marcarEntregado(idPedido) {
    db.ref("pedidos/" + idPedido).update({ estado: "entregado" }, (error) => {
        if (!error) {
            mostrarPedidos();
        }
    });
}

function eliminarPedido(idPedido) {
    if (confirm("¿Estás seguro de eliminar este pedido?")) {
        db.ref("pedidos/" + idPedido).remove((error) => {
            if (!error) {
                mostrarPedidos();
            }
        });
    }
}
