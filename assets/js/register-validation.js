/**
 * Validación del formulario de registro con pregunta secreta
 * MAK PC Enterprise
 */

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitBtn = document.getElementById('submit-btn');

    if (!registerForm) return;

    // Elementos para validación de contraseña
    const passwordStrength = document.getElementById('password-strength');
    const lengthReq = document.getElementById('length-req');
    const upperReq = document.getElementById('upper-req');
    const numberReq = document.getElementById('number-req');
    const passwordMatch = document.getElementById('password-match');

    // Estados de validación
    let isPasswordStrong = false;
    let isPasswordMatch = false;

    // ==================== VALIDACIÓN DE CONTRASEÑA ====================
    function validatePasswordStrength(password) {
        let strength = 0;
        
        // Verificar longitud
        if (password.length >= 8) {
            strength++;
            lengthReq.innerHTML = '<i class="fas fa-check text-success"></i> Mínimo 8 caracteres';
            lengthReq.classList.add('met');
        } else {
            lengthReq.innerHTML = '<i class="fas fa-times text-danger"></i> Mínimo 8 caracteres';
            lengthReq.classList.remove('met');
        }
        
        // Verificar mayúsculas
        if (/[A-Z]/.test(password)) {
            strength++;
            upperReq.innerHTML = '<i class="fas fa-check text-success"></i> Al menos una mayúscula';
            upperReq.classList.add('met');
        } else {
            upperReq.innerHTML = '<i class="fas fa-times text-danger"></i> Al menos una mayúscula';
            upperReq.classList.remove('met');
        }
        
        // Verificar números
        if (/[0-9]/.test(password)) {
            strength++;
            numberReq.innerHTML = '<i class="fas fa-check text-success"></i> Al menos un número';
            numberReq.classList.add('met');
        } else {
            numberReq.innerHTML = '<i class="fas fa-times text-danger"></i> Al menos un número';
            numberReq.classList.remove('met');
        }

        // Actualizar barra de fortaleza
        updatePasswordStrengthBar(strength);
        
        isPasswordStrong = strength === 3;
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
            passwordMatch.innerHTML = '<i class="fas fa-check text-success"></i> Las contraseñas coinciden';
            passwordMatch.classList.add('met');
            isPasswordMatch = true;
        } else {
            passwordMatch.innerHTML = '<i class="fas fa-times text-danger"></i> Las contraseñas deben coincidir';
            passwordMatch.classList.remove('met');
            isPasswordMatch = false;
        }
    }

    // ==================== EVENT LISTENERS ====================
    passwordInput.addEventListener('input', function() {
        validatePasswordStrength(this.value);
        validatePasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // ==================== MANEJAR ENVÍO DEL FORMULARIO ====================
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar contraseñas
        if (!isPasswordStrong) {
            showNotification('La contraseña no cumple con los requisitos de seguridad', 'error');
            return;
        }

        if (!isPasswordMatch) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        // Validar pregunta secreta
        const securityQuestion = document.getElementById('security-question').value;
        const securityAnswer = document.getElementById('security-answer').value.trim();

        if (!securityQuestion) {
            showNotification('Por favor selecciona una pregunta de seguridad', 'error');
            return;
        }

        if (!securityAnswer) {
            showNotification('Por favor ingresa tu respuesta de seguridad', 'error');
            return;
        }

        // Recoger datos del formulario
        const formData = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            security_question: securityQuestion,
            security_answer: securityAnswer.toLowerCase()
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

        console.log('✅ USUARIO REGISTRADO:');
        console.log('Email:', formData.email);
        console.log('Teléfono:', formData.phone);
        console.log('Pregunta:', formData.security_question);
        console.log('Respuesta:', formData.security_answer);

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    // ==================== FUNCIÓN DE NOTIFICACIONES ====================
    function showNotification(message, type = 'success') {
        // Remover notificaciones anteriores
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'custom-notification';
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
            animation: slideInRight 0.3s ease;
        `;

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

    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Sistema de registro con pregunta secreta INICIALIZADO');
});