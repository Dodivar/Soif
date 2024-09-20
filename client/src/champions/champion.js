export default class Champion {
  constructor(id, name, description, img, reloadPower) {
    this.id = id
    this.name = name
    this.description = description
    this.img = img
    this.reloadPower = reloadPower
    this.passif = reloadPower === null
    this.isDisabled = true
  }

  effect() {
    console.error(`Not implemented effect of ${this.name}`)
  }
}
