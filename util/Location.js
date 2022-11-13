const GOOGLE_API_KEY = 'AIzaSyAghFZTwDwt1PDl3czUXPkex5Lx9WlBTeg'

export const getMapPreview = (lat, lng) => {
  const mapPreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`
  return mapPreviewUrl
}