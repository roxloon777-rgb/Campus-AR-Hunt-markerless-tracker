window.XR8 ? setupScene() : window.addEventListener('xrloaded', setupScene)

function setupScene() {
  console.log('8th Wall ready — setupScene running')
  const urlParams = new URLSearchParams(window.location.search)
  const loc = urlParams.get('loc') || null

  const coords = {
    law:    { lat: -26.688730, lon: 27.091206, model: 'assets/models/medical_mask.glb' },
    lovers: { lat: -26.687913, lon: 27.092682, model: 'assets/models/medical_syringe.glb' },
    tree:   { lat: -26.688911, lon: 27.092593, model: 'assets/models/doctors_stethoscope.glb' }
  }

  function placeModel(entityId, lat, lon, modelUrl, scale = [3,3,3], rotY = 180, altitude = 0) {
    try {
      const anchor = new XR8.XrController.GeospatialAnchor({
        latitude: lat,
        longitude: lon,
        altitude: altitude
      })
      anchor.addToScene(entityId, {
        src: modelUrl,
        scale: scale,
        rotation: [0, rotY, 0],
        visible: true
      })
      console.log(`Placed ${entityId} at ${lat}, ${lon}`)
    } catch (err) {
      console.warn('Geospatial anchor failed:', err)
    }
  }

  if (loc && coords[loc]) {
    const c = coords[loc]
    placeModel(loc + 'Obj', c.lat, c.lon, c.model)
  } else {
    Object.keys(coords).forEach(k => {
      const c = coords[k]
      placeModel(k + 'Obj', c.lat, c.lon, c.model)
    })
  }

  const scene = document.querySelector('#ar-scene')
  const snapBtn = document.querySelector('#snapBtn')
  const downloadBtn = document.querySelector('#downloadBtn')
  const uploadBtn = document.querySelector('#uploadBtn')
  const preview = document.querySelector('#preview')
  let capturedData = null

  snapBtn.addEventListener('click', () => {
    try {
      const canvas = scene.renderer.domElement
      capturedData = canvas.toDataURL('image/png')
      if (capturedData) {
        preview.src = capturedData
        preview.style.display = 'block'
        downloadBtn.disabled = false
        uploadBtn.disabled = false
      }
    } catch (err) {
      console.error('Screenshot failed:', err)
      alert('Could not capture screenshot. Use your device screenshot instead.')
    }
  })

  downloadBtn.addEventListener('click', () => {
    if (!capturedData) return
    const a = document.createElement('a')
    a.href = capturedData
    a.download = 'campus-hunt-selfie.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
  })

  uploadBtn.addEventListener('click', () => {
    if (!capturedData) {
      alert('Please take a selfie first.')
      return
    }
    const padletUrl = 'https://padlet.com/roxloon777/campus-hunt-wall-of-fame-gkek97r08b9p9047'
    window.open(padletUrl, '_blank')
    alert('Padlet opened. Please upload your saved screenshot there.')
  })
}