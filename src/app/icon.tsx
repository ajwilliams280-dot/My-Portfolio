import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    { contentType: 'image/png', size: { width: 16, height: 16 }, id: '16' },
    { contentType: 'image/png', size: { width: 32, height: 32 }, id: '32' },
    { contentType: 'image/png', size: { width: 48, height: 48 }, id: '48' },
    { contentType: 'image/png', size: { width: 512, height: 512 }, id: '512' },
  ]
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const sizeString = await id
  const size = parseInt(sizeString, 10)
  
  // Proportional font sizing
  const fontSize = size * 0.55

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
      width: size,
      height: size,
    }
  )
}
