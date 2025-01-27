let overlay

document.addEventListener('click', function (event) {
  // First check if we need to close an existing overlay
  if (overlay) {
    closeOverlay()
    return // Stop here to prevent opening new overlay while closing
  }

  // Only proceed to create new overlay if clicking an original image
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

    // Create close button
    const closeButton = document.createElement('button')
    closeButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" role="img" aria-label="Close Icon"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`
    closeButton.setAttribute('aria-label', 'Close image viewer')
    closeButton.setAttribute('type', 'button')
    closeButton.setAttribute('title', 'ESC to close')
    closeButton.classList.add(
      'absolute',
      'top-4',
      'right-4',
      'p-2',
      'hover:bg-white/10',
      'rounded-full',
      'transition-colors'
    )
    closeButton.addEventListener('click', closeOverlay)
    const enlargedImg = event.target.cloneNode()
    enlargedImg.classList.add(
      'enlarged-image',
      'max-w-[95vw]',
      'max-h-[95vh]',
      'object-contain',
      'animate-pop-in',
      'rounded-md'
    )
    enlargedImg.setAttribute('title', 'ESC to close')

    overlay.appendChild(enlargedImg)
    overlay.appendChild(closeButton)
    document.body.appendChild(overlay)

    // Trigger reflow to ensure the transition applies
    overlay.offsetHeight
    overlay.classList.remove('opacity-0')
  }
})

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && overlay) {
    closeOverlay()
  }
})

function closeOverlay() {
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
