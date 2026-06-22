import titanLogoFull from './images/titan-logo.png'
import titanShieldIcon from './images/titan-shield-icon.png'

// Real Titan Institute of Technology & Applied Networks crest.
// Used everywhere the logo appears (landing page + teacher sidebar)
// from this one place, so it only ever needs to be swapped here.
//
// variant="full"   -> full crest + "TAJ Institute..." name (landing page)
// variant="icon"   -> shield only, no name text (small sidebar sizes)
function TitanLogoMark({ size = 64, variant = 'full' }) {
  const src = variant === 'icon' ? titanShieldIcon : titanLogoFull
  const altText =
    variant === 'icon'
      ? 'Titan logo'
      : 'Titan Institute of Technology & Applied Networks logo'

  return (
    <img
      src={src}
      alt={altText}
      width={size}
      style={{ width: size, height: 'auto', display: 'block' }}
    />
  )
}

export default TitanLogoMark
