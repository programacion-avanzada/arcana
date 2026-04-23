// @ts-ignore
import f11Script from "./scripts/f11-toggle-sidebars.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const SidebarsF11: QuartzComponent = () => {
  // this component renders nothing; it only injects the script via beforeDOMLoaded
  return null
}

SidebarsF11.beforeDOMLoaded = f11Script

export default (() => SidebarsF11) satisfies QuartzComponentConstructor
