export enum PilotGender {
  Female = 'Female',
  Male = 'Male'
}

export interface PilotPortrait {
  id: string
  gender: PilotGender
  label: string
  src: string
}

const portraitModules = import.meta.glob('../assets/pilot_portraits/*/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const toKebabCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()

const toLabel = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const parsePortraitPath = (path: string): { gender: PilotGender; filename: string } | null => {
  const match = path.match(/pilot_portraits\/(Female|Male)\/([^/]+)\.[^.]+$/i)
  if (!match) {
    return null
  }

  const folderGender = match[1]
  const filename = match[2]
  const gender = folderGender.toLowerCase() === 'female' ? PilotGender.Female : PilotGender.Male

  return { gender, filename }
}

export const PILOT_PORTRAITS: PilotPortrait[] = Object.entries(portraitModules)
  .map(([path, src]) => {
    const parsed = parsePortraitPath(path)
    if (!parsed) {
      return null
    }

    const slug = toKebabCase(parsed.filename)
    return {
      id: `${parsed.gender.toLowerCase()}-${slug}`,
      gender: parsed.gender,
      label: toLabel(parsed.filename),
      src
    }
  })
  .filter((portrait): portrait is PilotPortrait => portrait !== null)
  .sort((a, b) => a.label.localeCompare(b.label))

export const getPortraitsByGender = (gender: PilotGender): PilotPortrait[] =>
  PILOT_PORTRAITS.filter((portrait) => portrait.gender === gender)

export const getPortraitById = (portraitId: string): PilotPortrait | undefined =>
  PILOT_PORTRAITS.find((portrait) => portrait.id === portraitId)

export const getDefaultPortraitIdByGender = (gender: PilotGender): string => {
  const firstPortrait = getPortraitsByGender(gender)[0]
  if (firstPortrait) {
    return firstPortrait.id
  }

  return PILOT_PORTRAITS[0]?.id ?? ''
}

export const getRandomPilotGender = (): PilotGender =>
  Math.random() < 0.5 ? PilotGender.Female : PilotGender.Male

export const getRandomPortraitIdByGender = (gender: PilotGender): string => {
  const portraits = getPortraitsByGender(gender)
  if (portraits.length === 0) {
    return PILOT_PORTRAITS[0]?.id ?? ''
  }

  const index = Math.floor(Math.random() * portraits.length)
  return portraits[index].id
}
