        // Configuración de Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyClvGsln3Xo9Gr5wcnkU5lMdXXE3KeUXcw",
            authDomain: "amor-f437b.firebaseapp.com",
            projectId: "amor-f437b",
            storageBucket: "amor-f437b.firebasestorage.app",
            messagingSenderId: "614121584515",
            appId: "1:614121584515:web:10acada1fd5bbe36e628b6",
            measurementId: "G-QXKHRN9CZJ"
        };

        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Elementos del DOM
        const gallery = document.getElementById('gallery');
        const loading = document.getElementById('loading');
        const emptyState = document.getElementById('emptyState');
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        let allPhotos = [];

        // Cargar fotos al iniciar
        document.addEventListener('DOMContentLoaded', loadPhotos);

        async function loadPhotos() {
            try {
                loading.style.display = 'block';
                emptyState.style.display = 'none';
                
                const snapshot = await db.collection('Fotitos')
                    .orderBy('fecha', 'desc')
                    .get();
                
                allPhotos = [];
                gallery.innerHTML = '';
                
                if (snapshot.empty) {
                    loading.style.display = 'none';
                    emptyState.style.display = 'block';
                    return;
                }
                
                snapshot.forEach(doc => {
                    const photo = {
                        id: doc.id,
                        ...doc.data()
                    };
                    allPhotos.push(photo);
                    renderPhoto(photo);
                });
                
                loading.style.display = 'none';
                
            } catch (error) {
                console.error('Error al cargar fotos:', error);
                loading.style.display = 'none';
                gallery.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #FF6B6B;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 50px; margin-bottom: 20px;"></i>
                        <h3>Error al cargar las fotos</h3>
                        <p>Por favor, intenta nuevamente más tarde.</p>
                    </div>
                `;
            }
        }

        function renderPhoto(photo) {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';
            
            photoCard.innerHTML = `
                <img src="${photo.imagen}" alt="${photo.titulo}" class="photo-img" 
                     onclick="openModal('${photo.imagen}')">
                <div class="photo-info">
                    <h3 class="photo-title">${photo.titulo || 'Sin título'}</h3>
                    <p class="photo-desc">${photo.descripcion || 'Sin descripción'}</p>
                    <div class="photo-date">
                        <i class="far fa-calendar-alt"></i>
                        ${photo.fechaString || 'Fecha no disponible'}
                    </div>
                </div>
            `;
            
            gallery.appendChild(photoCard);
        }

        function filterPhotos(type) {
            const buttons = document.querySelectorAll('.filter-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            let sortedPhotos = [...allPhotos];
            
            if (type === 'recent') {
                sortedPhotos.sort((a, b) => {
                    return (b.fecha?.seconds || 0) - (a.fecha?.seconds || 0);
                });
            } else if (type === 'oldest') {
                sortedPhotos.sort((a, b) => {
                    return (a.fecha?.seconds || 0) - (b.fecha?.seconds || 0);
                });
            }
            
            gallery.innerHTML = '';
            sortedPhotos.forEach(photo => renderPhoto(photo));
        }

        function openModal(imageSrc) {
            modalImage.src = imageSrc;
            imageModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Cerrar modal al hacer clic fuera de la imagen
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });

        // Cerrar modal con la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });