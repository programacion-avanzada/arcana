// Plain JS module (no React/Quartz) to toggle left and right sidebars with F11
const initF11Sidebars = () => {
  let hidden = false

  const setSidebarsHidden = (hide: boolean) => {
    hidden = hide
  document.documentElement.setAttribute("sidebars-hidden", hidden ? "on" : "off")
  // also toggle the existing attribute used by the ToggleSidebar styles
  document.documentElement.setAttribute("toggle-sidebar", hidden ? "on" : "off")

    const update = (el: Element | null) => {
      if (!el) return
      // For accessibility, reflect visibility to assistive tech
      const htmlEl = el as HTMLElement
      if (hide) {
        el.setAttribute("aria-hidden", "true")
        // save previous inline display so we can restore it
        try {
          htmlEl.dataset.__sidebarsf11PrevDisplay = htmlEl.style.display || ""
          htmlEl.style.display = "none"
        } catch (e) {
          // ignore
        }
      } else {
        el.removeAttribute("aria-hidden")
        try {
          const prev = htmlEl.dataset.__sidebarsf11PrevDisplay ?? ""
          htmlEl.style.display = prev
          delete htmlEl.dataset.__sidebarsf11PrevDisplay
        } catch (e) {
          // ignore
        }
      }
    }

    const left = document.querySelector(".sidebar.left")
    const right = document.querySelector(".sidebar.right")
    update(left)
    update(right)
  }

  const toggleSidebars = () => setSidebarsHidden(!hidden)

  const onKeyDown = (e: KeyboardEvent) => {
    // Use F11 key code as requested. Avoid interfering with browser fullscreen when Meta/Alt is present.
    if (e.code === "F11" && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault()
      toggleSidebars()
    }
  }

  // allow programmatic toggle via custom event
  const onToggleEvent = () => toggleSidebars()

  window.addEventListener("keydown", onKeyDown)
  document.addEventListener("toggle-sidebars", onToggleEvent)
  window.addCleanup(() => {
    window.removeEventListener("keydown", onKeyDown)
    document.removeEventListener("toggle-sidebars", onToggleEvent)
  })

  // initialize attribute based on current state
  document.documentElement.setAttribute("sidebars-hidden", hidden ? "on" : "off")

  // expose a tiny debug API
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.__sidebarsF11 = {
    toggle: () => onToggleEvent(),
    get hidden() {
      return hidden
    },
  }
}

// init immediately and also when navigation occurs in case the app triggers 'nav'
try {
  initF11Sidebars()
} catch (e) {
  // ignore
}
document.addEventListener("nav", initF11Sidebars)
