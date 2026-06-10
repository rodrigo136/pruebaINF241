document.addEventListener('DOMContentLoaded', function() {
    const zoomLevel = 2;
    const lensSize = 200;
    
    // Seleccionar TODOS los contenedores de lupa
    const containers = document.querySelectorAll('.lupa-container');
    
    containers.forEach(container => {
        const img = container.querySelector('img');
        const lens = container.querySelector('.lens');
        
        if (!img || !lens) return;
        
        // Configurar tamaño de la lupa
        lens.style.width = lensSize + 'px';
        lens.style.height = lensSize + 'px';
        
        let imgWidth, imgHeight;
        
        function initLupa() {
            imgWidth = img.clientWidth;
            imgHeight = img.clientHeight;
            lens.style.backgroundImage = `url(${img.src})`;
            lens.style.backgroundSize = `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`;
        }
        
        // Inicializar cuando la imagen cargue
        if (img.complete) {
            initLupa();
        } else {
            img.onload = initLupa;
        }
        
        // Evento de movimiento del mouse
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;
            
            // Limitar mouse a los bordes de la imagen
            mouseX = Math.min(Math.max(mouseX, 0), rect.width);
            mouseY = Math.min(Math.max(mouseY, 0), rect.height);
            
            // Posicionar la lupa centrada en el mouse
            let lensLeft = mouseX - (lensSize / 2);
            let lensTop = mouseY - (lensSize / 2);
            
            // Calcular posición del fondo
            let bgX = (mouseX / rect.width) * 100;
            let bgY = (mouseY / rect.height) * 100;
            
            // Ajustar si se sale por los bordes
            if (lensLeft < 0) {
                const offset = (-lensLeft) / lensSize;
                bgX = bgX * (1 - offset);
                lensLeft = 0;
            } else if (lensLeft + lensSize > rect.width) {
                const offset = (lensLeft + lensSize - rect.width) / lensSize;
                bgX = bgX + (100 - bgX) * offset;
                lensLeft = rect.width - lensSize;
            }
            
            if (lensTop < 0) {
                const offset = (-lensTop) / lensSize;
                bgY = bgY * (1 - offset);
                lensTop = 0;
            } else if (lensTop + lensSize > rect.height) {
                const offset = (lensTop + lensSize - rect.height) / lensSize;
                bgY = bgY + (100 - bgY) * offset;
                lensTop = rect.height - lensSize;
            }
            
            lens.style.display = 'block';
            lens.style.left = (lensLeft ) + 'px';
            lens.style.top = (lensTop )+ 'px';
            lens.style.backgroundPosition = `${bgX}% ${bgY}%`;
        });
        
        // Ocultar lupa cuando el mouse sale
        container.addEventListener('mouseleave', () => {
            lens.style.display = 'none';
        });
        
        // Actualizar en resize de ventana
        window.addEventListener('resize', () => {
            if (img.complete) {
                imgWidth = img.clientWidth;
                imgHeight = img.clientHeight;
                lens.style.backgroundSize = `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`;
            }
        });
    });
});