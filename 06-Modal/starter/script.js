'use strict';

const modal =document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnsOpenModal = document.querySelectorAll('.show-modal');
const btnCloseModal = document.querySelector('.close-modal');

const closeModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

const OpenModal = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

for ( let i=0;i<btnsOpenModal.length; i++){
    btnsOpenModal[i].addEventListener('click', OpenModal );
}

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click',closeModal);

document.addEventListener('keydown', function(e){
    if (e.key === "Escape" && !modal.classList.contains('hidden')){
        closeModal();
    }
})