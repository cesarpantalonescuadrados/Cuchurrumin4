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
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const previewContainer = document.getElementById('previewContainer');
        const imagePreview = document.getElementById('imagePreview');
        const submitBtn = document.getElementById('submitBtn');
        const titleInput = document.getElementById('title');
        const descriptionInput = document.getElementById('description');
        const statusMessage = document.getElementById('statusMessage');

        let selectedFile = null;
        let base64String = '';

        // Eventos para el área de upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#FF6B6B';
            uploadArea.style.background = '#e9f9f7';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#4ECDC4';
            uploadArea.style.background = '#f8f9fa';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#4ECDC4';
            uploadArea.style.background = '#f8f9fa';
            
            if (e.dataTransfer.files.length) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        // Evento para selección de archivo
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileSelect(e.target.files[0]);
            }
        });

        // Función para manejar la selección de archivo
        function handleFileSelect(file) {
            if (!file.type.startsWith('image/')) {
                showStatus('Por favor, selecciona una imagen válida', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showStatus('La imagen es demasiado grande (máx. 5MB)', 'error');
                return;
            }
            
            selectedFile = file;
            
            // Mostrar vista previa
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';
                base64String = e.target.result; // Guardar como base64
                submitBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }

        // Evento para subir la foto
        submitBtn.addEventListener('click', async () => {
            if (!base64String || !titleInput.value.trim()) {
                showStatus('Por favor, completa el título y selecciona una imagen', 'error');
                return;
            }
            
            submitBtn.innerHTML = '<div class="loading"></div> Subiendo...';
            submitBtn.disabled = true;
            
            try {
                // Crear documento en Firestore
                await db.collection('Fotitos').add({
                    titulo: titleInput.value.trim(),
                    descripcion: descriptionInput.value.trim(),
                    imagen: base64String, // Guardamos como string base64
                    fecha: firebase.firestore.FieldValue.serverTimestamp(),
                    fechaString: new Date().toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                });
                
                showStatus('¡Foto subida exitosamente!', 'success');
                
                // Limpiar formulario
                titleInput.value = '';
                descriptionInput.value = '';
                previewContainer.style.display = 'none';
                base64String = '';
                selectedFile = null;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Subir Foto';
                
                // Auto-redirección después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'visualizar.html';
                }, 2000);
                
            } catch (error) {
                console.error('Error al subir:', error);
                showStatus('Error al subir la foto. Intenta nuevamente.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Subir Foto';
            }
        });

        // Función para mostrar mensajes de estado
        function showStatus(message, type) {
            statusMessage.textContent = message;
            statusMessage.className = 'status-message ' + type;
            statusMessage.style.display = 'block';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);

        }

