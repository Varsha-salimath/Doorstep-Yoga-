function doorstepNavigate(path) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'doorstep-navigate', path }, '*')
    return
  }
  window.location.assign(path)
}

function doorstepShare() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'doorstep-share' }, '*')
    return
  }
  if (navigator.share) {
    navigator.share({
      title: 'Doorstep Yoga Trainer',
      text: 'Check out this trainer profile on Doorstep Yoga.',
      url: window.location.href,
    })
  }
}

function doorstepLogout() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'doorstep-logout' }, '*')
    return
  }
  window.location.assign('/login')
}

function doorstepFavoriteToggle() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'doorstep-favorite-toggle' }, '*')
    return
  }
}

function doorstepToast(message) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'doorstep-toast', message }, '*')
    return
  }
  window.alert(message)
}

document.addEventListener('DOMContentLoaded', () => {
  const isEmbedded = window.parent && window.parent !== window

  function hideEmbedBottomChrome() {
    document.querySelectorAll('nav.fixed.bottom-0, .stitch-embed-nav').forEach((element) => {
      element.style.display = 'none'
    })
    document.body.style.paddingBottom = '0'
  }

  if (isEmbedded) {
    hideEmbedBottomChrome()
  }

  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return
    if (event.data.type === 'doorstep-booking-mode') {
      hideEmbedBottomChrome()
    }
  })

  document.querySelectorAll('[data-doorstep-nav]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      const path = element.getAttribute('data-doorstep-nav')
      if (path) doorstepNavigate(path)
    })
  })

  document.querySelectorAll('[data-doorstep-action="share"]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      doorstepShare()
    })
  })

  document.querySelectorAll('[data-doorstep-action="logout"]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (confirm('Are you sure you want to sign out?')) {
        doorstepLogout()
      }
    })
  })

  document.querySelectorAll('[data-doorstep-action="favorite-toggle"]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      doorstepFavoriteToggle()
    })
  })

  document.querySelectorAll('[data-doorstep-toast]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      const message = element.getAttribute('data-doorstep-toast')
      if (message) doorstepToast(message)
    })
  })

  document.querySelectorAll('a[href="#"]').forEach((element) => {
    element.addEventListener('click', (event) => event.preventDefault())
  })
})
