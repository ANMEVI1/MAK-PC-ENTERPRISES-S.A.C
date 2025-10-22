/**
 * Validación del formulario de registro con checklist de requerimientos
 * MAK PC Enterprise - Versión Actualizada
 */

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitBtn = document.getElementById('submit-btn');

    if (!registerForm) return;

    // Elementos para validación de contraseña
    const passwordStrength = document.getElementById('password-strength');
    const passwordRequirements = document.getElementById('password-requirements');
    const passwordMatchFeedback = document.getElementById('password-match-feedback');

    // Elementos del checklist
    const lengthReq = document.getElementById('length-req');
    const upperReq = document.getElementById('upper-req');
    const numberReq = document.getElementById('number-req');

    // Mapeo de preguntas de seguridad (SOLO 3)
    const questionMap = {
        'color': '¿Cuál es tu color favorito?',
        'mascota': '¿Cuál es el nombre de tu primera mascota?',
        'apodo': '¿Cuál era tu apodo de infancia?'
    };

    // Estados de validación
    let isPasswordStrong = false;
    let isPasswordMatch = false;
    let isFormValid = false;

    // ==================== VALIDACIÓN DE CAMPOS ====================
    function validateFullName() {
        const fullname = document.getElementById('fullname').value.trim();
        const feedback = document.getElementById('fullname-feedback');
        
        if (fullname.length < 2) {
            setFieldStatus('fullname', false);
            feedback.textContent = 'El nombre debe tener al menos 2 caracteres';
            feedback.className = 'form-text text-danger';
            return false;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(fullname)) {
            setFieldStatus('fullname', false);
            feedback.textContent = 'El nombre solo puede contener letras y espacios';
            feedback.className = 'form-text text-danger';
            return false;
        } else {
            setFieldStatus('fullname', true);
            feedback.textContent = '✓ Nombre válido';
            feedback.className = 'form-text text-success';
            return true;
        }
    }

    function validateEmail() {
        const email = document.getElementById('email').value.trim();
        const feedback = document.getElementById('email-feedback');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            setFieldStatus('email', false);
            feedback.textContent = 'Por favor ingresa un correo electrónico válido';
            feedback.className = 'form-text text-danger';
            return false;
        } else {
            setFieldStatus('email', true);
            feedback.textContent = '✓ Correo electrónico válido';
            feedback.className = 'form-text text-success';
            return true;
        }
    }

    function validatePhone() {
        const phone = document.getElementById('phone').value.trim();
        const feedback = document.getElementById('phone-feedback');
        
        if (phone === '') {
            setFieldStatus('phone', true);
            feedback.textContent = 'Campo opcional';
            feedback.className = 'form-text text-muted';
            return true;
        } else if (!/^[\d\s\-\+\(\)]{8,15}$/.test(phone)) {
            setFieldStatus('phone', false);
            feedback.textContent = 'Formato de teléfono inválido';
            feedback.className = 'form-text text-danger';
            return false;
        } else {
            setFieldStatus('phone', true);
            feedback.textContent = '✓ Teléfono válido';
            feedback.className = 'form-text text-success';
            return true;
        }
    }

    function validateSecurityQuestion() {
        const question = document.getElementById('security-question').value;
        const select = document.getElementById('security-question');
        
        if (question !== '') {
            setFieldStatus('security-question', true);
            return true;
        } else {
            setFieldStatus('security-question', false);
            return false;
        }
    }

    function validateSecurityAnswer() {
        const answer = document.getElementById('security-answer').value.trim();
        const feedback = document.getElementById('security-answer-feedback');
        
        if (answer.length >= 2) {
            setFieldStatus('security-answer', true);
            feedback.textContent = '✓ Respuesta válida';
            feedback.className = 'form-text text-success';
            return true;
        } else {
            setFieldStatus('security-answer', false);
            feedback.textContent = 'La respuesta debe tener al menos 2 caracteres';
            feedback.className = 'form-text text-danger';
            return false;
        }
    }

    function validateTerms() {
        const terms = document.getElementById('terms');
        return terms.checked;
    }

    function setFieldStatus(fieldId, isValid) {
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

    // ==================== VALIDACIÓN DE CONTRASEÑA CON CHECKLIST ====================
    function validatePasswordStrength(password) {
        let strength = 0;
        
        // Verificar longitud
        const hasLength = password.length >= 8;
        if (hasLength) {
            strength++;
            lengthReq.innerHTML = '<i class="fas fa-check"></i> Mínimo 8 caracteres';
            lengthReq.classList.add('met');
        } else {
            lengthReq.innerHTML = '<i class="fas fa-times"></i> Mínimo 8 caracteres';
            lengthReq.classList.remove('met');
        }
        
        // Verificar mayúsculas
        const hasUpper = /[A-Z]/.test(password);
        if (hasUpper) {
            strength++;
            upperReq.innerHTML = '<i class="fas fa-check"></i> Al menos una mayúscula';
            upperReq.classList.add('met');
        } else {
            upperReq.innerHTML = '<i class="fas fa-times"></i> Al menos una mayúscula';
            upperReq.classList.remove('met');
        }
        
        // Verificar números
        const hasNumber = /[0-9]/.test(password);
        if (hasNumber) {
            strength++;
            numberReq.innerHTML = '<i class="fas fa-check"></i> Al menos un número';
            numberReq.classList.add('met');
        } else {
            numberReq.innerHTML = '<i class="fas fa-times"></i> Al menos un número';
            numberReq.classList.remove('met');
        }

        // Mostrar/ocultar requerimientos
        if (password.length > 0) {
            passwordRequirements.classList.add('show');
        } else {
            passwordRequirements.classList.remove('show');
        }

        // Actualizar barra de fortaleza
        updatePasswordStrengthBar(strength);
        
        // Actualizar estado del campo
        if (password.length > 0) {
            setFieldStatus('password', isPasswordStrong);
        } else {
            setFieldStatus('password', false);
        }
        
        isPasswordStrong = strength === 3;
        updateSubmitButton();
        return isPasswordStrong;
    }

    function updatePasswordStrengthBar(strength) {
        passwordStrength.className = 'password-strength';
        if (strength === 1) {
            passwordStrength.classList.add('strength-weak');
        } else if (strength === 2) {
            passwordStrength.classList.add('strength-medium');
        } else if (strength === 3) {
            passwordStrength.classList.add('strength-strong');
        }
    }

    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password === confirmPassword && confirmPassword !== '') {
            passwordMatchFeedback.innerHTML = '<i class="fas fa-check me-2"></i>Las contraseñas coinciden';
            passwordMatchFeedback.className = 'password-match-feedback show matching';
            setFieldStatus('confirm-password', true);
            isPasswordMatch = true;
        } else if (confirmPassword !== '') {
            passwordMatchFeedback.innerHTML = '<i class="fas fa-times me-2"></i>Las contraseñas no coinciden';
            passwordMatchFeedback.className = 'password-match-feedback show not-matching';
            setFieldStatus('confirm-password', false);
            isPasswordMatch = false;
        } else {
            passwordMatchFeedback.className = 'password-match-feedback';
            setFieldStatus('confirm-password', false);
            isPasswordMatch = false;
        }
        
        updateSubmitButton();
    }

    // ==================== ACTUALIZAR BOTÓN DE ENVÍO ====================
    function updateSubmitButton() {
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSecurityQuestionValid = validateSecurityQuestion();
        const isSecurityAnswerValid = validateSecurityAnswer();
        const isTermsValid = validateTerms();
        
        isFormValid = isFullNameValid && isEmailValid && isPhoneValid && 
                     isPasswordStrong && isPasswordMatch && 
                     isSecurityQuestionValid && isSecurityAnswerValid && isTermsValid;
        
        submitBtn.disabled = !isFormValid;
        
        if (isFormValid) {
            submitBtn.classList.remove('btn-secondary');
            submitBtn.classList.add('btn-success');
        } else {
            submitBtn.classList.remove('btn-success');
            submitBtn.classList.add('btn-secondary');
        }
    }

    // ==================== EVENT LISTENERS ====================
    document.getElementById('fullname').addEventListener('input', updateSubmitButton);
    document.getElementById('email').addEventListener('input', updateSubmitButton);
    document.getElementById('phone').addEventListener('input', updateSubmitButton);
    
    passwordInput.addEventListener('input', function() {
        validatePasswordStrength(this.value);
        validatePasswordMatch();
    });
    
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    document.getElementById('security-question').addEventListener('change', updateSubmitButton);
    document.getElementById('security-answer').addEventListener('input', updateSubmitButton);
    document.getElementById('terms').addEventListener('change', updateSubmitButton);

    // ==================== MANEJAR ENVÍO DEL FORMULARIO ====================
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isFormValid) {
            showNotification('Por favor completa todos los campos correctamente', 'error');
            return;
        }

        // Recoger datos del formulario
        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            security_question: document.getElementById('security-question').value,
            security_answer: document.getElementById('security-answer').value.toLowerCase()
        };

        // Guardar datos de seguridad en localStorage
        const securityData = {
            question: formData.security_question,
            answer: formData.security_answer,
            email: formData.email,
            phone: formData.phone || ''
        };
        
        localStorage.setItem('userSecurityData', JSON.stringify(securityData));

        // Mostrar mensaje de éxito
        showNotification('¡Cuenta creada exitosamente! Redirigiendo...', 'success');

        // Cambiar estado del botón
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creando cuenta...';
        submitBtn.disabled = true;

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    // ==================== FUNCIÓN DE NOTIFICACIONES ====================
    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification ${type === 'error' ? 'error' : ''}`;
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

    // Inicializar validación
    updateSubmitButton();
    console.log('✅ Sistema de registro con checklist INICIALIZADO');
    console.log('🔐 Preguntas de seguridad:', Object.values(questionMap));
});