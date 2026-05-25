import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';
window.addEventListener('scroll', () => {
    document.getElementById('mainNav')
        .classList.toggle('scrolled', window.scrollY > 60);
});
const track = document.getElementById('track');
const wrapper = document.getElementById('wrapper');
const btnToggle = document.getElementById('btnToggle');
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
let isPlaying = true;
let animOffset = 0;
const STEP = 200;
function getAnimOffset() {
  const style = window.getComputedStyle(track);
  const matrix = new DOMMatrix(style.transform);
  return matrix.m41;
}
function stopAuto() {
  if (!isPlaying) return;
  animOffset = getAnimOffset();
  isPlaying = false;
  track.classList.remove('playing');
  track.style.transform = `translateX(${animOffset}px)`;
  btnToggle.textContent = '▶ Play';
  btnToggle.classList.remove('active');
}
function startAuto() {
  isPlaying = true;
  track.classList.add('playing');
  track.style.transform = '';
  animOffset = 0;
  btnToggle.textContent = '⏸ Pause';
  btnToggle.classList.add('active');
}
btnToggle.addEventListener('click', () => {
  isPlaying ? stopAuto() : startAuto();
});
btnLeft.addEventListener('click', () => {
  stopAuto();
  animOffset = Math.min(animOffset + STEP, 0);
  track.style.transform = `translateX(${animOffset}px)`;
});
btnRight.addEventListener('click', () => {
  stopAuto();
  const half = track.scrollWidth / 2;
  animOffset = Math.max(animOffset - STEP, -half);
  track.style.transform = `translateX(${animOffset}px)`;
});
let isDragging = false;
let startX = 0;
let startOffset = 0;
wrapper.addEventListener('mousedown', e => {
  stopAuto();
  isDragging = true;
  startX = e.clientX;
  startOffset = animOffset;
  wrapper.style.cursor = 'grabbing';
});
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const delta = e.clientX - startX;
  const half = track.scrollWidth / 2;
  animOffset = Math.min(0, Math.max(startOffset + delta, -half));
  track.style.transform = `translateX(${animOffset}px)`;
});
window.addEventListener('mouseup', () => {
  isDragging = false;
  wrapper.style.cursor = '';
});
const joinForm = document.querySelector('#joinModal form');
const joinBtn = joinForm.querySelector('.join-btn');
joinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    parentName: joinForm.querySelector('input[placeholder="Enter your name"]').value.trim(),
    childName: joinForm.querySelector('input[placeholder="Enter child name"]').value.trim(),
    childAge: joinForm.querySelector('input[placeholder="Age"]').value.trim(),
    program: joinForm.querySelector('select').value,
    phone: joinForm.querySelector('input[placeholder="Phone number"]').value.trim(),
    email: joinForm.querySelector('input[placeholder="Email address"]').value.trim(),
    message: joinForm.querySelector('textarea').value.trim(),
    submittedAt: serverTimestamp()
  };
  if (!data.parentName || !data.email || !data.phone) {
    showModalMessage('Please fill in your name, email and phone.', 'error');
    return;
  }
  joinBtn.textContent = 'Sending...';
  joinBtn.disabled = true;
  try {
    await addDoc(collection(db, 'enrollments'), data);
    joinForm.reset();
    showModalMessage('🎉 Thank you! We\'ll be in touch soon.', 'success');
  } catch (err) {
    console.error(err);
    showModalMessage('Something went wrong. Please try again.', 'error');
  } finally {
    joinBtn.textContent = 'Submit';
    joinBtn.disabled = false;
  }
});
function showModalMessage(msg, type) {
  const existing = document.getElementById('join-msg');
  if (existing) existing.remove();
  const el = document.createElement('p');
  el.id = 'join-msg';
  el.textContent = msg;
  el.style.cssText = `
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    margin-top: 12px;
    color: ${type === 'success' ? '#2d8a4e' : '#e84868'};
  `;
  joinForm.appendChild(el);
  setTimeout(() => el.remove(), 5000);
}
const submitBtn = document.querySelector('.submit-btn');
const contactForm = document.querySelector('.form-card');
submitBtn.addEventListener('click', async () => {
  const nameEl  = contactForm.querySelector('input[placeholder="e.g. Priya Ramesh"]');
  const emailEl = contactForm.querySelector('input[type="email"]');
  const phoneEl = contactForm.querySelector('input[type="tel"]');
  const ageEl   = contactForm.querySelector('select');
  const msgEl   = contactForm.querySelector('textarea');
  const data = {
    parentName: nameEl.value.trim(),
    email: emailEl.value.trim(),
    phone: phoneEl.value.trim(),
    childAge: ageEl.value,
    message: msgEl.value.trim(),
    submittedAt: serverTimestamp()
  };
  if (!data.parentName || !data.email || !data.phone) {
    showContactMessage('Please fill in your name, email and phone.', 'error');
    return;
  }
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  try {
    await addDoc(collection(db, 'contacts'), data);
    nameEl.value = '';
    emailEl.value = '';
    phoneEl.value = '';
    ageEl.selectedIndex = 0;
    msgEl.value = '';
    showContactMessage('✅ Message sent! We\'ll get back to you soon.', 'success');
  } catch (err) {
    console.error(err);
    showContactMessage('Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.textContent = 'Send message';
    submitBtn.disabled = false;
  }
});
function showContactMessage(msg, type) {
  const existing = document.getElementById('contact-msg');
  if (existing) existing.remove();
  const el = document.createElement('p');
  el.id = 'contact-msg';
  el.textContent = msg;
  el.style.cssText = `
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    margin-top: 12px;
    color: ${type === 'success' ? '#2d8a4e' : '#e84868'};
  `;
  submitBtn.insertAdjacentElement('afterend', el);
  setTimeout(() => el.remove(), 5000);
}