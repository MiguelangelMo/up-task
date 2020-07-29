export const avance = () => {
    const avance = document.querySelectorAll('li.tarea');

    if (avance.length > 0) {
        const tareasCompletadas = document.querySelectorAll('i.fa-check-circle');
        const avancecalc = Math.round((tareasCompletadas.length / avance.length) * 100);
        console.log(avancecalc);
        const porcentaje = document.getElementById('porcentaje');
        porcentaje.style.width = avancecalc + '%';
    }
}