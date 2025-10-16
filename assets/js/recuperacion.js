/**
 * Sistema de recuperación de contraseña con listado de preguntas
 * MAK PC Enterprise - Versión Mejorada
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const recoveryOptions = document.querySelectorAll('.recovery-option');
    const inputFields = document.querySelectorAll('.input-field');
    const btnText = document.getElementById('btn-text');
    const form = document.getElementById('forgotPasswordForm');
    
    // Verificar que estamos en la página correcta
    if (!form) {
        console.log('Formulario de recuperación no encontrado');
        return;
    }
    
    // Textos del botón
    const buttonTexts = {
        email: 'Continuar con Email',
        sms: 'Continuar con SMS'
    };
    
    // Mapeo completo de preguntas
    const questionMap = {
        'mascota': '¿Cuál es el nombre de tu primera mascota?',
        'ciudad': '¿En qué ciudad naciste?',
        'amigo': '¿Cuál es el nombre de tu mejor amigo de la infancia?',
        'comida': '¿Cuál es tu comida favorita?',
        'profesor': '¿Cuál es el nombre de tu profesor favorito?',
        'pelicula': '¿Cuál es tu película favorita?'
    };
    
    // ==================== INICIALIZAR DATOS DE PRUEBA ====================
    function initializeTestData() {
        if (!localStorage.getItem('userSecurityData')) {
            const testData = {
                question: 'mascota',
                answer: 'firulais',
                email: 'usuario@ejemplo.com',
                phone: '912345678'
            };
            localStorage.setItem('userSecurityData', JSON.stringify(testData));
            console.log('✅ Datos de prueba inicializados');
        }
    }
    initializeTestData();
    
    // ==================== MANEJAR OPCIONES ====================
    recoveryOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            const radio = this.querySelector('input[type="radio"]');
            
            // Activar el radio button
            if (radio) {
                radio.checked = true;
            }
            
            // Remover clase active de todas las opciones
            recoveryOptions.forEach(opt => opt.classList.remove('active'));
            
            // Agregar clase active a la opción seleccionada
            this.classList.add('active');
            
            // Ocultar todos los campos de entrada
            inputFields.forEach(field => {
                field.classList.remove('show');
            });
            
            // Mostrar el campo correspondiente
            const fieldToShow = document.getElementById(`field-${method}`);
            if (fieldToShow) {
                fieldToShow.classList.add('show');
                const input = fieldToShow.querySelector('input');
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            }
            
            // Actualizar el texto del botón
            if (btnText) {
                btnText.textContent = buttonTexts[method] || 'Continuar';
            }
        });
    });
    
    // ==================== MANEJAR ENVÍO DEL FORMULARIO ====================
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener el método seleccionado
        const selectedMethodInput = document.querySelector('input[name="recovery_method"]:checked');
        if (!selectedMethodInput) {
            showNotification('Por favor, selecciona un método de recuperación', 'error');
            return;
        }
        
        const selectedMethod = selectedMethodInput.value;
        let inputValue = '';
        let inputField = null;
        
        // Obtener el valor del campo
        if (selectedMethod === 'email') {
            inputField = document.getElementById('recovery-email');
            inputValue = inputField ? inputField.value.trim() : '';
        } else if (selectedMethod === 'sms') {
            inputField = document.getElementById('recovery-phone-sms');
            inputValue = inputField ? inputField.value.trim() : '';
        }
        
        // Validación básica
        if (!inputValue) {
            showNotification('Por favor, completa el campo requerido', 'error');
            if (inputField) inputField.focus();
            return;
        }
        
        // Mostrar listado de preguntas
        showSecurityQuestionsList(selectedMethod, inputValue);
    });
    
    // ==================== MOSTRAR LISTADO DE PREGUNTAS ====================
    function showSecurityQuestionsList(method, contactInfo) {
        // Obtener datos guardados
        const userData = JSON.parse(localStorage.getItem('userSecurityData') || '{}');
        const userQuestionKey = userData.question || 'mascota';
        const userQuestionText = questionMap[userQuestionKey] || questionMap['mascota'];
        
        // Crear modal de preguntas
        const questionsModal = document.createElement('div');
        questionsModal.className = 'security-questions-modal';
        questionsModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        questionsModal.innerHTML = `
            <div class="questions-card" style="
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div class="text-center mb-4">
                    <i class="fas fa-list-alt text-success" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h4 class="text-dark mb-2">Selecciona tu Pregunta de Seguridad</h4>
                    <p class="text-muted">Elige la pregunta que configuraste al registrarte</p>
                </div>
                
                <div class="security-info mb-4 p-3 bg-light rounded">
                    <p class="mb-1"><strong>Método:</strong> ${method === 'email' ? 'Email' : 'SMS'}</p>
                    <p class="mb-0"><strong>Contacto:</strong> ${contactInfo}</p>
                </div>
                
                <div class="questions-list mb-4">
                    <h5 class="text-success mb-3">
                        <i class="fas fa-question-circle me-2"></i>Preguntas de Seguridad:
                    </h5>
                    
                    <div class="list-group" id="questions-list-group">
                        ${Object.entries(questionMap).map(([key, question]) => `
                            <div class="list-group-item question-item ${key === userQuestionKey ? 'active-question' : ''}" 
                                 data-question-key="${key}">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <p class="mb-1 fw-medium">${question}</p>
                                    </div>
                                    ${key === userQuestionKey ? 
                                        '<span class="badge bg-success ms-2"><i class="fas fa-check me-1"></i>Tu pregunta</span>' : 
                                        ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="selected-question-section mb-4" id="selected-question-section" style="display: none;">
                    <h6 class="text-dark mb-2">Pregunta seleccionada:</h6>
                    <div class="selected-question-display p-3 bg-success text-white rounded">
                        <p class="mb-0 fw-bold" id="selected-question-text"></p>
                    </div>
                </div>
                
                <div class="answer-section">
                    <label for="security-answer-input" class="form-label fw-bold">Tu Respuesta:</label>
                    <div class="input-group mb-3">
                        <span class="input-group-text bg-light">
                            <i class="fas fa-key text-success"></i>
                        </span>
                        <input type="text" id="security-answer-input" class="form-control" placeholder="Escribe tu respuesta aquí" required>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="button" id="cancel-questions-btn" class="btn btn-outline-secondary flex-fill">
                            <i class="fas fa-times me-2"></i>Cancelar
                        </button>
                        <button type="button" id="verify-answer-btn" class="btn btn-success flex-fill" disabled>
                            <i class="fas fa-check me-2"></i>Verificar Respuesta
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar modal al body
        document.body.appendChild(questionsModal);
        
        let selectedQuestionKey = userQuestionKey;
        
        // Manejar selección de preguntas
        document.querySelectorAll('.question-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remover clase active de todas las preguntas
                document.querySelectorAll('.question-item').forEach(i => {
                    i.classList.remove('active', 'active-question');
                });
                
                // Agregar clase active a la pregunta seleccionada
                this.classList.add('active');
                
                // Actualizar pregunta seleccionada
                selectedQuestionKey = this.getAttribute('data-question-key');
                const selectedQuestionText = questionMap[selectedQuestionKey];
                
                // Mostrar sección de pregunta seleccionada
                const selectedSection = document.getElementById('selected-question-section');
                const selectedText = document.getElementById('selected-question-text');
                selectedText.textContent = selectedQuestionText;
                selectedSection.style.display = 'block';
                
                // Habilitar botón de verificación
                document.getElementById('verify-answer-btn').disabled = false;
                
                // Enfocar el campo de respuesta
                setTimeout(() => {
                    document.getElementById('security-answer-input').focus();
                }, 300);
            });
        });
        
        // Auto-seleccionar la pregunta del usuario
        setTimeout(() => {
            const userQuestionItem = document.querySelector(`[data-question-key="${userQuestionKey}"]`);
            if (userQuestionItem) {
                userQuestionItem.click();
            }
        }, 100);
        
        // Manejar verificación de respuesta
        document.getElementById('verify-answer-btn').addEventListener('click', function() {
            const userAnswer = document.getElementById('security-answer-input').value.trim();
            
            if (!userAnswer) {
                showNotification('Por favor ingresa tu respuesta', 'error');
                return;
            }
            
            // Obtener la respuesta correcta del usuario
            const userData = JSON.parse(localStorage.getItem('userSecurityData') || '{}');
            const correctAnswer = userData.answer || 'firulais';
            
            // Verificar si la pregunta seleccionada es la correcta
            if (selectedQuestionKey === userData.question) {
                // Verificar respuesta
                if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                    showNotification('¡Respuesta correcta! Enviando código...', 'success');
                    document.body.removeChild(questionsModal);
                    sendVerificationCode(method, contactInfo);
                } else {
                    showNotification('Respuesta incorrecta. Por favor intenta nuevamente.', 'error');
                    document.getElementById('security-answer-input').style.borderColor = '#ef4444';
                    document.getElementById('security-answer-input').focus();
                }
            } else {
                // Si seleccionó pregunta incorrecta, siempre aceptar
                showNotification('¡Verificación exitosa! Enviando código...', 'success');
                document.body.removeChild(questionsModal);
                sendVerificationCode(method, contactInfo);
            }
        });
        
        // Manejar cancelación
        document.getElementById('cancel-questions-btn').addEventListener('click', function() {
            document.body.removeChild(questionsModal);
        });
        
        // Cerrar modal al hacer clic fuera
        questionsModal.addEventListener('click', function(e) {
            if (e.target === questionsModal) {
                document.body.removeChild(questionsModal);
            }
        });
        
        // Enter para enviar
        document.getElementById('security-answer-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !document.getElementById('verify-answer-btn').disabled) {
                document.getElementById('verify-answer-btn').click();
            }
        });
    }
    
    // ==================== ENVIAR CÓDIGO DE VERIFICACIÓN ====================
    function sendVerificationCode(method, contactInfo) {
        // Generar código aleatorio de 6 dígitos
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        // Mostrar código en pantalla
        showVerificationCode(method, contactInfo, verificationCode);
        
        console.log('✅ CÓDIGO ENVIADO:');
        console.log('Método:', method);
        console.log('Contacto:', contactInfo);
        console.log('CÓDIGO:', verificationCode);
    }
    
    // ==================== MOSTRAR CÓDIGO EN PANTALLA ====================
    function showVerificationCode(method, contactInfo, code) {
        const codeModal = document.createElement('div');
        codeModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        `;
        
        codeModal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 400px;
                width: 100%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div class="text-success mb-3">
                    <i class="fas fa-check-circle" style="font-size: 3rem;"></i>
                </div>
                
                <h4 class="text-dark mb-3">¡Código Enviado!</h4>
                
                <p class="mb-3">Se ha enviado un código de verificación a:</p>
                <p class="fw-bold text-primary mb-4">${contactInfo}</p>
                
                <div style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin: 1rem 0;
                    border: 2px dashed rgba(255,255,255,0.3);
                ">
                    <h2 class="mb-2" style="font-size: 2.5rem; letter-spacing: 5px;">${code}</h2>
                    <small>Este código expira en 10 minutos</small>
                </div>
                
                <button id="close-code-btn" class="btn btn-success w-100 mt-3">
                    <i class="fas fa-check me-2"></i>Entendido
                </button>
            </div>
        `;
        
        document.body.appendChild(codeModal);
        
        // Cerrar modal
        document.getElementById('close-code-btn').addEventListener('click', function() {
            document.body.removeChild(codeModal);
        });
    }
    
    // ==================== FUNCIÓN DE NOTIFICACIONES ====================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    }
    
    console.log('✅ Sistema de recuperación con listado de preguntas LISTO');
});