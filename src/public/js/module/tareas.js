import axios from 'axios';
import Swal from 'sweetalert2';
import { avance } from '../funcions/avance';
const tarea = document.querySelector('.listado-pendientes');

if (tarea) {
    tarea.addEventListener('click', (event) => {
        if (event.target.classList.contains('fa-minus-circle')) {
            const id = event.target.parentElement.parentElement.dataset.tarea;
            axios.patch(`/pyt/${id}`)
                .then(resp => {
                    if (resp.status === 200) {
                        /**
                         * event.target.classList.remove('fa-minus-circle');
                        event.target.classList.add('fa-check-circle');
                         */
                        event.target.classList.toggle('fa-check-circle');
                        avance();
                    }
                });
        }
        if (event.target.classList.contains('fa-trash')) {
            const nodo = event.target.parentElement.parentElement.dataset.tarea;
            const nodoPadre = event.target.parentElement.parentElement;
            const url = `${location.origin}/tarea/${nodo}`;
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
                    axios.delete(url, nodo)
                        .then(resp => {
                            if (resp.status === 200) {
                                nodoPadre.parentElement.removeChild(nodoPadre);
                                Swal.fire(
                                    'Eliminado!',
                                    resp.data,
                                    'success'
                                );
                                avance();
                            }
                            
                        }).catch(() => {
                            Swal.fire({
                                type: 'error',
                                title: 'Ha ocurrido un error en sistema',
                                text: 'No se puede eliminar el proyecto'
                            })
                        })
                }
            });
        }
    })
}

export default tarea;