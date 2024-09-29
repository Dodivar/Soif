import Champion from './champion'

const id = 'taze'

export default class Taze extends Champion {
  constructor() {
    super(id, 'Le tazé', "Floute l'écran d'un adversaire durant tout le prochain round", '', 3)
    this.canTarget = true
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
