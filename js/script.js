// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
      });
    }
    
    // Установка текущего года в футере
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Модальное окно "Связаться с нами"
    const contactModal = document.getElementById('contactModal');
    const contactBtn = document.getElementById('contactBtn');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    const ctaContactBtn = document.getElementById('ctaContactBtn');
    const closeModal = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');
    
    // Функция открытия модального окна
    const openModal = function() {
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
    };
    
    // Функция закрытия модального окна
    const closeModalFunc = function() {
      contactModal.classList.remove('active');
      document.body.style.overflow = ''; // Разрешаем прокрутку страницы
    };
    
    // Обработчики открытия модального окна
    if (contactBtn) contactBtn.addEventListener('click', openModal);
    if (mobileContactBtn) mobileContactBtn.addEventListener('click', openModal);
    if (ctaContactBtn) ctaContactBtn.addEventListener('click', openModal);
    
    // Обработчик закрытия модального окна
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        closeModalFunc();
      }
    });
    
    // Обработка отправки формы
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Здесь можно добавить логику отправки данных на сервер
        console.log('Отправка формы:', { name, phone, email, message });
        
        // Показываем сообщение об успешной отправке
        alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
        
        // Очищаем форму и закрываем модальное окно
        contactForm.reset();
        closeModalFunc();
      });
    }
    
    // Анимация появления элементов при прокрутке
    const animateOnScroll = function() {
      const elements = document.querySelectorAll('.category-card, .product-card, .service-card, .testimonial-card');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };
    
    // Инициализация стилей для анимации
    const initAnimationStyles = function() {
      const elements = document.querySelectorAll('.category-card, .product-card, .service-card, .testimonial-card');
      
      elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
      
      // Запускаем анимацию первый раз
      animateOnScroll();
    };
    
    // Запускаем инициализацию анимации
    initAnimationStyles();
    
    // Добавляем обработчик прокрутки
    window.addEventListener('scroll', animateOnScroll);
    
    // Форма подписки
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
      subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email && isValidEmail(email)) {
          alert(`Спасибо за подписку! Мы отправили подтверждение на ${email}`);
          emailInput.value = '';
        } else {
          alert('Пожалуйста, введите корректный email');
        }
      });
    }
    
    // Проверка валидности email
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  });