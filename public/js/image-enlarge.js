let overlay

document.addEventListener('mousedown', function (event) {
  if (event.target.tagName === 'IMG' && event.target.id !== 'splashimage') {
    event.preventDefault()

    overlay = document.createElement('div')
    overlay.classList.add(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-80',
      'z-50',
      'flex',
      'items-center',
      'justify-center',
      'transition-opacity',
      'duration-300',
      'ease-in-out',
      'opacity-0'
    )

    const enlargedImg = event.target.cloneNode()
    enlargedImg.classList.add(
      'enlarged-image',
      'max-w-[95vw]',
      'max-h-[95vh]',
      'object-contain',
      'animate-pop-in',
      'rounded-md'
    )

    overlay.appendChild(enlargedImg)
    document.body.appendChild(overlay)

    // Trigger reflow to ensure the transition applies
    overlay.offsetHeight;
    overlay.classList.remove('opacity-0');
  }
})
document.addEventListener('mouseup', function () {
  if (overlay) {
    const enlargedImg = overlay.querySelector('.enlarged-image')
    enlargedImg.classList.remove('animate-pop-in')
    enlargedImg.classList.add('animate-pop-out')

    overlay.classList.add('opacity-0')

    enlargedImg.addEventListener(
      'animationend',
      function () {
        document.body.removeChild(overlay)
        overlay = null
      },
      { once: true }
    )
  }
})
