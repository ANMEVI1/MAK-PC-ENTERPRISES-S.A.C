// ==================== SISTEMA DE RECUPERACIÓN MULTI-OPCIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const recoveryOptions = document.querySelectorAll('.recovery-option');
    const inputFields = document.querySelectorAll('.input-field');
    const btnText = document.getElementById('btn-text');
    const form = document.getElementById('forgotPasswordForm');
    
    // Verificar que estamos en la página correcta
    if (!form || recoveryOptions.length === 0) {
        console.log('Página de recuperación no detectada');
        return;
    }
    
    // Textos del botón según el método seleccionado
    const buttonTexts = {
        email: 'Enviar Enlace de Recuperación',
        sms: 'Enviar Código por SMS',
        phone: 'Recibir Código por Llamada'
    };
    
    // ==================== MANEJAR CLIC EN LAS OPCIONES ====================
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
                const input = field.querySelector('input');
                if (input) {
                    input.removeAttribute('required');
                    input.value = ''; // Limpiar el campo
                    input.style.borderColor = ''; // Resetear borde
                }
            });
            
            // Mostrar el campo correspondiente al método seleccionado
            const fieldToShow = document.getElementById(`field-${method}`);
            if (fieldToShow) {
                fieldToShow.classList.add('show');
                const input = fieldToShow.querySelector('input');
                if (input) {
                    input.setAttribute('required', 'required');
                    // Enfocar el input después de un pequeño delay para la animación
                    setTimeout(() => input.focus(), 100);
                }
            }
            
            // Actualizar el texto del botón
            if (btnText) {
                btnText.textContent = buttonTexts[method] || 'Continuar';
            }
        });
    });
    
    // ==================== VALIDACIÓN DEL FORMULARIO ====================
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
        
        // Obtener el valor del campo correspondiente
        if (selectedMethod === 'email') {
            inputField = document.getElementById('recovery-email');
            inputValue = inputField ? inputField.value.trim() : '';
        } else if (selectedMethod === 'sms') {
            inputField = document.getElementById('recovery-phone-sms');
            inputValue = inputField ? inputField.value.trim() : '';
        } else if (selectedMethod === 'phone') {
            inputField = document.getElementById('recovery-phone-call');
            inputValue = inputField ? inputField.value.trim() : '';
        }
        
        // Validar que el campo no esté vacío
        if (!inputValue) {
            if (inputField) {
                inputField.style.borderColor = '#ef4444';
                inputField.focus();
            }
            showNotification('Por favor, completa el campo requerido', 'error');
            return;
        }
        
        // Validación específica para teléfono
        if ((selectedMethod === 'sms' || selectedMethod === 'phone') && !validateCode(inputValue)) {
    if (inputField) {
        inputField.style.borderColor = '#ef4444';
        inputField.focus();
    }
    showNotification('Ingresa un código válido (4-6 dígitos)', 'error');
    return;
}
        
        // Validación específica para email
        if (selectedMethod === 'email' && !validateEmail(inputValue)) {
            if (inputField) {
                inputField.style.borderColor = '#ef4444';
                inputField.focus();
            }
            showNotification('Ingresa un correo electrónico válido', 'error');
            return;
        }
        
        // Restablecer el color del borde si todo está correcto
        if (inputField) {
            inputField.style.borderColor = '';
        }
        
        // Mensajes de éxito según el método
        const messages = {
            email: `Se ha enviado un enlace de recuperación a ${inputValue}`,
            sms: `Se ha enviado un código SMS al número ${inputValue}`,
            phone: `Recibirás una llamada al número ${inputValue} con tu código de verificación`
        };
        
        showNotification(messages[selectedMethod], 'success');
        
        // Simular envío del formulario (loading)
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
        submitButton.disabled = true;
        
        // Simular tiempo de procesamiento
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // ⚠ IMPORTANTE: Descomenta la siguiente línea para enviar el formulario realmente
            // form.submit();
            
            // Console logs para debugging
            console.log('Método seleccionado:', selectedMethod);
            console.log('Valor ingresado:', inputValue);
            
            // Opcional: Redirigir después de 2 segundos
            // setTimeout(() => {
            //     window.location.href = 'verificar-codigo.html';
            // }, 2000);
        }, 2000);
    });
    
    // ==================== FUNCIONES DE VALIDACIÓN ====================
    
    /**
     * Valida formato de email
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }
    
    /**
     * Valida teléfono para Perú (9 dígitos comenzando con 9)
     * @param {string} phone - Teléfono a validar
     * @returns {boolean}
     */
function validateCode(code) {
    // Validar que sea un código de 4-6 dígitos
    const re = /^\d{4,6}$/;
    return re.test(code);
}
    
    // ==================== FUNCIÓN DE NOTIFICACIONES ====================
    
    /**
     * Muestra notificaciones en pantalla
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación ('success' o 'error')
     */
    function showNotification(message, type = 'success') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.textContent = message;
        
        // Colores según el tipo
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };
        
        // Estilos de la notificación
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = colors[type] || colors.success;
        notification.style.color = '#ffffff';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        notification.style.fontWeight = '500';
        notification.style.fontSize = '0.95rem';
        notification.style.maxWidth = '400px';
        notification.style.wordWrap = 'break-word';
        
        // Agregar al body
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // ==================== INICIALIZACIÓN ====================
    console.log('✅ Sistema de recuperación multi-opción inicializado correctamente');
    console.log('📧 Métodos disponibles: Email, SMS, Llamada');
});

// ==================== PREVENIR ERRORES DE CONSOLA ====================
window.addEventListener('error', function(e) {
    console.warn('⚠ Error capturado:', e.message);
    return true;
});