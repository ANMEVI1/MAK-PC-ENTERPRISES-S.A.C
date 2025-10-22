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
    const verificationForm = document.getElementById('verificationForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    const successMessage = document.getElementById('success-message');
    
    // Variables de estado
    let selectedMethod = null;
    let contactInfo = '';
    let currentStep = 1; // 1: método, 2: verificación, 3: nueva contraseña, 4: éxito

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
                answer: 'firulais', // RESPUESTA POR DEFECTO
                email: 'usuario@ejemplo.com',
                phone: '912345678'
            };
            localStorage.setItem('userSecurityData', JSON.stringify(testData));
            console.log('✅ Datos de prueba inicializados');
        }
    }
    initializeTestData();
    
    // ==================== VALIDACIÓN DE CONTRASEÑA PARA RECUPERACIÓN ====================
    function initializePasswordValidation() {
        const newPasswordInput = document.getElementById('new-password');
        const confirmNewPasswordInput = document.getElementById('confirm-new-password');
        const newPasswordStrength = document.getElementById('new-password-strength');
        const newPasswordRequirements = document.getElementById('new-password-requirements');
        const newPasswordMatchFeedback = document.getElementById('new-password-match-feedback');
        const newPasswordSubmitBtn = document.getElementById('new-password-submit-btn');

        // Elementos del checklist
        const newLengthReq = document.getElementById('new-length-req');
        const newUpperReq = document.getElementById('new-upper-req');
        const newNumberReq = document.getElementById('new-number-req');

        // Estados de validación
        let isNewPasswordStrong = false;
        let isNewPasswordMatch = false;

        if (!newPasswordInput) return;

        function validateNewPasswordStrength(password) {
            let strength = 0;
            
            // Verificar longitud
            const hasLength = password.length >= 8;
            if (hasLength) {
                strength++;
                newLengthReq.innerHTML = '<i class="fas fa-check"></i> Mínimo 8 caracteres';
                newLengthReq.classList.add('met');
            } else {
                newLengthReq.innerHTML = '<i class="fas fa-times"></i> Mínimo 8 caracteres';
                newLengthReq.classList.remove('met');
            }
            
            // Verificar mayúsculas
            const hasUpper = /[A-Z]/.test(password);
            if (hasUpper) {
                strength++;
                newUpperReq.innerHTML = '<i class="fas fa-check"></i> Al menos una mayúscula';
                newUpperReq.classList.add('met');
            } else {
                newUpperReq.innerHTML = '<i class="fas fa-times"></i> Al menos una mayúscula';
                newUpperReq.classList.remove('met');
            }
            
            // Verificar números
            const hasNumber = /[0-9]/.test(password);
            if (hasNumber) {
                strength++;
                newNumberReq.innerHTML = '<i class="fas fa-check"></i> Al menos un número';
                newNumberReq.classList.add('met');
            } else {
                newNumberReq.innerHTML = '<i class="fas fa-times"></i> Al menos un número';
                newNumberReq.classList.remove('met');
            }

            // Mostrar/ocultar requerimientos
            if (password.length > 0) {
                newPasswordRequirements.classList.add('show');
            } else {
                newPasswordRequirements.classList.remove('show');
            }

            // Actualizar barra de fortaleza
            updateNewPasswordStrengthBar(strength);
            
            // Actualizar estado del campo
            if (password.length > 0) {
                setNewFieldStatus('new-password', isNewPasswordStrong);
            } else {
                setNewFieldStatus('new-password', false);
            }
            
            isNewPasswordStrong = strength === 3;
            updateNewPasswordSubmitButton();
            return isNewPasswordStrong;
        }

        function updateNewPasswordStrengthBar(strength) {
            newPasswordStrength.className = 'password-strength';
            if (strength === 1) {
                newPasswordStrength.classList.add('strength-weak');
            } else if (strength === 2) {
                newPasswordStrength.classList.add('strength-medium');
            } else if (strength === 3) {
                newPasswordStrength.classList.add('strength-strong');
            }
        }

        function validateNewPasswordMatch() {
            const password = newPasswordInput.value;
            const confirmPassword = confirmNewPasswordInput.value;
            
            if (password === confirmPassword && confirmPassword !== '') {
                newPasswordMatchFeedback.innerHTML = '<i class="fas fa-check me-2"></i>Las contraseñas coinciden';
                newPasswordMatchFeedback.className = 'password-match-feedback show matching';
                setNewFieldStatus('confirm-new-password', true);
                isNewPasswordMatch = true;
            } else if (confirmPassword !== '') {
                newPasswordMatchFeedback.innerHTML = '<i class="fas fa-times me-2"></i>Las contraseñas no coinciden';
                newPasswordMatchFeedback.className = 'password-match-feedback show not-matching';
                setNewFieldStatus('confirm-new-password', false);
                isNewPasswordMatch = false;
            } else {
                newPasswordMatchFeedback.className = 'password-match-feedback';
                setNewFieldStatus('confirm-new-password', false);
                isNewPasswordMatch = false;
            }
            
            updateNewPasswordSubmitButton();
        }

        function setNewFieldStatus(fieldId, isValid) {
            const field = document.getElementById(fieldId);
            const inputGroup = field.closest('.input-group');
            
            if (isValid) {
                field.classList.add('field-valid');
                field.classList.remove('field-invalid');
                if (inputGroup) {
                    inputGroup.querySelector('.input-group-text').style.borderColor = 'var(--success-color)';
                    inputGroup.querySelector('.input-group-text').style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
                }
            } else {
                field.classList.add('field-invalid');
                field.classList.remove('field-valid');
                if (inputGroup) {
                    inputGroup.querySelector('.input-group-text').style.borderColor = 'var(--danger-color)';
                    inputGroup.querySelector('.input-group-text').style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                }
            }
        }

        function updateNewPasswordSubmitButton() {
            const isFormValid = isNewPasswordStrong && isNewPasswordMatch;
            
            newPasswordSubmitBtn.disabled = !isFormValid;
            
            if (isFormValid) {
                newPasswordSubmitBtn.classList.remove('btn-secondary');
                newPasswordSubmitBtn.classList.add('btn-success');
            } else {
                newPasswordSubmitBtn.classList.remove('btn-success');
                newPasswordSubmitBtn.classList.add('btn-secondary');
            }
        }

        // Event listeners para validación de nueva contraseña
        newPasswordInput.addEventListener('input', function() {
            validateNewPasswordStrength(this.value);
            validateNewPasswordMatch();
        });
        
        confirmNewPasswordInput.addEventListener('input', validateNewPasswordMatch);

        // Inicializar estado del botón
        updateNewPasswordSubmitButton();
    }
    
    // ==================== MANEJAR BOTONES DE VOLVER ====================
    
    // Botón para volver al inicio
    document.getElementById('back-to-home')?.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Botón para volver al inicio de sesión desde el éxito
    document.getElementById('back-to-login')?.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    
    // Botón para volver al método desde verificación
    document.getElementById('back-to-method-from-verification')?.addEventListener('click', function() {
        showMethodSelectionForm();
    });
    
    // Botón para volver al método desde nueva contraseña
    document.getElementById('back-to-verification')?.addEventListener('click', function() {
        showMethodSelectionForm();
    });
    
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

            selectedMethod = method;
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

        // Validaciones específicas
        if (selectedMethod === 'email' && !validateEmail(inputValue)) {
            showNotification('Por favor, ingresa un correo electrónico válido', 'error');
            inputField.focus();
            return;
        }

        if (selectedMethod === 'sms' && !validatePhone(inputValue)) {
            showNotification('Por favor, ingresa un número de teléfono válido (9 dígitos)', 'error');
            inputField.focus();
            return;
        }
        
        contactInfo = inputValue;
        
        // Mostrar listado de preguntas
        showSecurityQuestionsList(selectedMethod, inputValue);
    });

    // ==================== MANEJAR VERIFICACIÓN DE CÓDIGO ====================
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredCode = document.getElementById('verification-code').value.trim();
            
            if (!enteredCode) {
                showNotification('Por favor ingresa el código de verificación', 'error');
                return;
            }
            
            // ✅ ACEPTAR CUALQUIER CÓDIGO DE 6 DÍGITOS
            if (enteredCode.length === 6 && /^\d+$/.test(enteredCode)) {
                // Código válido - Mostrar interfaz para restablecer contraseña
                showNotification('¡Código verificado correctamente!', 'success');
                setTimeout(() => {
                    showNewPasswordForm();
                }, 1500);
            } else {
                showNotification('El código debe tener exactamente 6 dígitos', 'error');
                document.getElementById('verification-code').style.borderColor = '#ef4444';
                document.getElementById('verification-code').focus();
                
                // Efecto de vibración en el campo
                document.getElementById('verification-code').classList.add('shake');
                setTimeout(() => {
                    document.getElementById('verification-code').classList.remove('shake');
                }, 500);
            }
        });

        // Manejar reenvío de código
        document.getElementById('resend-code')?.addEventListener('click', function(e) {
            e.preventDefault();
            sendVerificationCode(selectedMethod, contactInfo);
            showNotification('Se ha enviado un nuevo código de verificación', 'success');
        });

        // Auto-tabulación para código de 6 dígitos
        document.getElementById('verification-code')?.addEventListener('input', function(e) {
            const code = this.value.replace(/\D/g, '');
            this.value = code.slice(0, 6);
            
            // Auto-enviar si está completo
            if (code.length === 6) {
                this.form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        });
    }

    // ==================== MANEJAR NUEVA CONTRASEÑA ====================
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;
            
            // Validaciones de contraseña
            if (!isNewPasswordStrong(newPassword)) {
                showNotification('La contraseña no cumple con todos los requerimientos', 'error');
                document.getElementById('new-password').focus();
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                document.getElementById('confirm-new-password').focus();
                return;
            }
            
            // Simular cambio de contraseña exitoso
            simulatePasswordChange(newPassword);
        });
    }
    
    // ==================== MOSTRAR LISTADO DE PREGUNTAS ====================
    function showSecurityQuestionsList(method, contactInfo) {
        // Obtener datos guardados
        const userData = JSON.parse(localStorage.getItem('userSecurityData') || '{}');
        const userQuestionKey = userData.question || 'mascota';
        const userQuestionText = questionMap[userQuestionKey] || questionMap['mascota'];
        
        // Crear modal de preguntas
        const questionsModal = document.createElement('div');
        questionsModal.className = 'security-questions-modal';
        
        questionsModal.innerHTML = `
            <div class="questions-card">
                <div class="text-center mb-4">
                    <i class="fas fa-list-alt text-success" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h4 class="text-dark mb-2">Selecciona tu Pregunta de Seguridad</h4>
                    <p class="text-muted">Elige la pregunta que configuraste al registrarte</p>
                </div>
                
                <div class="security-info mb-4 p-3 rounded">
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
                    <div class="selected-question-display p-3 rounded">
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
            
            // VERIFICACIÓN CORREGIDA - ACEPTAR SIEMPRE QUE HAYA RESPUESTA
            if (userAnswer && userAnswer.length > 0) {
                showNotification('¡Verificación exitosa! Enviando código...', 'success');
                document.body.removeChild(questionsModal);
                sendVerificationCode(method, contactInfo);
            } else {
                showNotification('Por favor ingresa una respuesta', 'error');
                document.getElementById('security-answer-input').focus();
            }
        });
        
        // Manejar cancelación
        document.getElementById('cancel-questions-btn').addEventListener('click', function() {
            document.body.removeChild(questionsModal);
            showMethodSelectionForm();
        });
        
        // Cerrar modal al hacer clic fuera
        questionsModal.addEventListener('click', function(e) {
            if (e.target === questionsModal) {
                document.body.removeChild(questionsModal);
                showMethodSelectionForm();
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
        // ✅ NO generar código - el usuario puede ingresar cualquier código de 6 dígitos
        
        // Mostrar formulario de verificación
        showVerificationForm(method, contactInfo);
        
        console.log('📧 Simulando envío de código a:', contactInfo);
        console.log('💡 El usuario puede ingresar CUALQUIER código de 6 dígitos');
    }

    // ==================== MOSTRAR FORMULARIO DE VERIFICACIÓN ====================
    function showVerificationForm(method, contactInfo) {
        currentStep = 2;
        
        // Ocultar formulario actual
        form.classList.add('d-none');
        
        // Ocultar otros formularios
        if (newPasswordForm) newPasswordForm.classList.add('d-none');
        if (successMessage) successMessage.classList.add('d-none');
        
        // Mostrar formulario de verificación
        if (verificationForm) {
            verificationForm.classList.remove('d-none');
            
            // Actualizar descripción
            const description = document.getElementById('verification-description');
            if (description) {
                description.textContent = method === 'email' 
                    ? `Hemos enviado un código de verificación a ${contactInfo}`
                    : `Hemos enviado un código de verificación al número ${contactInfo}`;
            }
            
            // Limpiar y enfocar campo de código
            document.getElementById('verification-code').value = '';
            setTimeout(() => {
                document.getElementById('verification-code').focus();
            }, 300);
        }
    }

    // ==================== MOSTRAR FORMULARIO DE NUEVA CONTRASEÑA ====================
    function showNewPasswordForm() {
        currentStep = 3;
        
        // Ocultar formulario de verificación
        if (verificationForm) {
            verificationForm.classList.add('d-none');
        }
        
        // Ocultar otros formularios
        if (form) form.classList.add('d-none');
        if (successMessage) successMessage.classList.add('d-none');
        
        // Mostrar formulario de nueva contraseña
        if (newPasswordForm) {
            newPasswordForm.classList.remove('d-none');
            
            // Limpiar campos
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
            
            // Inicializar validación de contraseña
            initializePasswordValidation();
            
            // Enfocar campo de nueva contraseña
            setTimeout(() => {
                document.getElementById('new-password').focus();
            }, 300);
        }
    }

    // ==================== MOSTRAR MENSAJE DE ÉXITO ====================
    function showSuccessMessage() {
        currentStep = 4;
        
        // Ocultar formulario de nueva contraseña
        if (newPasswordForm) {
            newPasswordForm.classList.add('d-none');
        }
        
        // Ocultar otros formularios
        if (form) form.classList.add('d-none');
        if (verificationForm) verificationForm.classList.add('d-none');
        
        // Mostrar mensaje de éxito
        if (successMessage) {
            successMessage.classList.remove('d-none');
        }
    }

    // ==================== VOLVER A SELECCIÓN DE MÉTODO ====================
    function showMethodSelectionForm() {
        currentStep = 1;
        
        // Ocultar todos los formularios
        if (verificationForm) verificationForm.classList.add('d-none');
        if (newPasswordForm) newPasswordForm.classList.add('d-none');
        if (successMessage) successMessage.classList.add('d-none');
        
        // Mostrar formulario principal
        form.classList.remove('d-none');
        
        // Limpiar campos
        document.getElementById('verification-code').value = '';
        document.getElementById('recovery-email').value = '';
        document.getElementById('recovery-phone-sms').value = '';
        
        // Deseleccionar opciones
        recoveryOptions.forEach(option => {
            option.classList.remove('active');
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
        });
        
        // Ocultar campos de entrada
        inputFields.forEach(field => {
            field.classList.remove('show');
        });
        
        // Resetear texto del botón
        if (btnText) {
            btnText.textContent = 'Selecciona un método';
        }
        
        // Resetear estado
        selectedMethod = null;
        contactInfo = '';
        
        console.log('🔄 Volviendo a selección de método');
    }

    // ==================== SIMULAR CAMBIO DE CONTRASEÑA ====================
    function simulatePasswordChange(newPassword) {
        // Mostrar estado de carga
        const submitBtn = newPasswordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Cambiando contraseña...';
        submitBtn.disabled = true;

        // Simular proceso de cambio (2 segundos)
        setTimeout(() => {
            // Actualizar en localStorage (simulación)
            const userData = JSON.parse(localStorage.getItem('userSecurityData') || '{}');
            userData.password = newPassword; // En realidad debería ser hash
            localStorage.setItem('userSecurityData', JSON.stringify(userData));
            
            // Mostrar éxito
            showNotification('¡Contraseña restablecida exitosamente!', 'success');
            showSuccessMessage();
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            console.log('🔐 CONTRASEÑA ACTUALIZADA para usuario:', userData.email || userData.phone);
            
        }, 2000);
    }
    
    // ==================== FUNCIONES AUXILIARES ====================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^\d{9}$/;
        return re.test(phone);
    }
    
    function isNewPasswordStrong(password) {
        // Mínimo 8 caracteres, al menos una mayúscula y un número
        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        return hasLength && hasUpper && hasNumber;
    }
    
    // ==================== FUNCIÓN DE NOTIFICACIONES ====================
    function showNotification(message, type = 'success') {
        // Remover notificaciones existentes
        document.querySelectorAll('.custom-notification').forEach(notification => {
            notification.remove();
        });
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        if (type === 'error') notification.classList.add('error');
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    console.log('✅ Sistema de recuperación completo LISTO');
    console.log('📱 Flujo: Método → Pregunta → Código → Nueva Contraseña → Éxito');
    console.log('💡 El sistema acepta CUALQUIER código de 6 dígitos');
    console.log('🔐 Requerimientos de contraseña implementados en recuperación');
});