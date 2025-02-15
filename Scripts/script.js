document.addEventListener("DOMContentLoaded", () => {
    const plant = document.querySelector(".plant");
    const shadow = document.querySelector(".shadow");
    const shimmer = document.querySelector(".shimmer-text");
    const programmingIcon = document.querySelector(".programming-icon");

    plant.style.animationPlayState = "running";
    shadow.style.animationPlayState = "running";
    shimmer.style.animationPlayState = "running";
    programmingIcon.style.animationPlayState = "running";
});

document.addEventListener("DOMContentLoaded", () => {
    fetch('realisations.json')
        .then(response => response.json())
        .then(data => {
            const realisationsContent = document.getElementById('realisations-content');
            realisationsContent.innerHTML = ""; // On vide pour éviter des duplications
            
            data.forEach(realisation => {
                const realisationElement = document.createElement('div');
                realisationElement.classList.add('realisation-item');
                realisationElement.innerHTML = `
                    <h3>${realisation.titre}</h3>
                    <p><strong>Durée:</strong> ${realisation.duree}</p>
                    <p><strong>Personnes impliquées:</strong> ${realisation.personnes}</p>
                    <p><strong>Technologies:</strong> ${realisation.technologies.join(', ')}</p>
                    <div class="video-container">
                        <iframe src="${realisation.video}" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
                realisationsContent.appendChild(realisationElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des réalisations:', error));
});

