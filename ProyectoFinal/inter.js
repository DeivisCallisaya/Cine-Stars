document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = 0;
  let slideWidth = document.querySelector('.carousel').clientWidth;

  function updateSlide() {
    track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
  }

  // Evento resize
  window.addEventListener('resize', function() {
    slideWidth = document.querySelector('.carousel').clientWidth;
    updateSlide();
  });

  // Botones del carrusel
  prevBtn.addEventListener('click', function() {
    currentIndex--;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    updateSlide();
  });

  nextBtn.addEventListener('click', function() {
    currentIndex++;
    if (currentIndex >= slides.length) currentIndex = 0;
    updateSlide();
  });

  // Carrusel automático
  let autoSlide = setInterval(function() {
    currentIndex++;
    if (currentIndex >= slides.length) currentIndex = 0;
    updateSlide();
  }, 5000);

  const carousel = document.querySelector('.carousel');
  carousel.addEventListener('mouseenter', function() {
    clearInterval(autoSlide);
  });
  carousel.addEventListener('mouseleave', function() {
    autoSlide = setInterval(function() {
      currentIndex++;
      if (currentIndex >= slides.length) currentIndex = 0;
      updateSlide();
    }, 5000);
  });

  // navegacion 
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(function(el) {
        el.classList.remove('active');
      });
      this.classList.add('active');
      const target = document.querySelector(this.getAttribute('href'));
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });

  // carrito
  window.adjustQty = function(btn, delta) {
    const input = btn.parentElement.querySelector('.qty-input');
    let val = parseInt(input.value) || 0;
    val += delta;
    if (val < 0) val = 0;
    input.value = val;
    updateTotal();
  };

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.qty-input').forEach(function(input) {
      const qty = parseInt(input.value) || 0;
      const price = parseFloat(input.dataset.price);
      total += qty * price;
    });
    document.getElementById('total-display').textContent = 'Total: ' + Math.round(total) + ' Bs.';
    window.currentTotal = Math.round(total);
  }

  document.querySelectorAll('.qty-input').forEach(function(input) {
    input.addEventListener('input', updateTotal);
  });

  window.currentCart = [];

  const originalUpdateTotal = updateTotal;
  updateTotal = function() {
    originalUpdateTotal();
    window.currentCart = [];
    document.querySelectorAll('.qty-input').forEach(function(input) {
      const qty = parseInt(input.value) || 0;
      if (qty > 0) {
        const name = input.dataset.name;
        const price = parseFloat(input.dataset.price);
        window.currentCart.push({ name: name, qty: qty, price: price, subtotal: qty * price });
      }
    });
  };

  // boton para abrir el watsap
  document.getElementById('pay-btn').addEventListener('click', function() {
    if (window.currentCart.length === 0) {
      alert('¡Tu carrito está vacío!');
      return;
    }


    const message = 'Hola, quiero pagar mi compra en CineStars. Por favor, envíame tu QR de Banca Móvil.';
    const whatsappUrl = 'https://wa.me/59171125885' + '?text=' + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank');
  });

  // boton mostrar compra
  const showBtn = document.createElement('button');
  showBtn.textContent = 'Mostrar Compra';
  showBtn.className = 'pay-btn';
  showBtn.style.marginLeft = '8px';
  showBtn.addEventListener('click', function() {
    if (window.currentCart.length === 0) {
      alert('¡Tu carrito está vacío!');
      return;
    }
    let msg = 'Resumen de tu compra:\n';
    window.currentCart.forEach(function(item) {
      msg += '- ' + item.name + ' x' + item.qty + ' = ' + item.subtotal + ' Bs.\n';
    });
    msg += '\nTOTAL: ' + window.currentTotal + ' Bs.';
    alert(msg);
  });

  // Añadir el botón al lado de "Pagar"
  const payBtn = document.getElementById('pay-btn');
  if (payBtn) {
    payBtn.parentNode.insertBefore(showBtn, payBtn.nextSibling);
  }
});