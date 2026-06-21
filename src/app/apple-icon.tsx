import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const fontSize = 180 * 0.55

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 100%)',
          color: 'white',
          fontSize: fontSize,
          fontWeight: 800,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        <div style={{ display: 'flex', position: 'relative' }}>
          <span style={{ color: '#ffffff' }}>A</span>
          <span style={{ color: '#3b82f6', marginLeft: '-0.05em' }}>W</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
