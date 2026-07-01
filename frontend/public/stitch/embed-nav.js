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

document.addEventListener('DOMContentLoaded', () => {
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

  document.querySelectorAll('a[href="#"]').forEach((element) => {
    element.addEventListener('click', (event) => event.preventDefault())
  })
})
