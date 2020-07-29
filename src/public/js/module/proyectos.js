import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.getElementById('eliminar-proyecto');
btnDelete.onclick = (event) => {
    const btnEliminar = event.target.dataset.eliminar;
    const url = `${location.origin}${location.pathname}`;
    Swal.fire({
        title: '¿Estas seguro de eliminarlo?',
        text: "No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro!',
        cancelButtonText: 'No, estoy seguro'
    }).then((result) => {
        if (result.value) {
            axios.delete(url, { params: { btnEliminar } })
                .then(resp => {
                    Swal.fire(
                        'Eliminado!',
                        resp.data,
                        'success'
                    );
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000)
                })
                .catch(() => {
                    Swal.fire({
                        type: 'error',
                        title: 'Ha ocurrido un error en sistema',
                        text: 'No se puede eliminar el proyecto'
                    })
                })
        }
    })
}

export default btnDelete;