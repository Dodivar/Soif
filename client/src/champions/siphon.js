import Champion from './champion'

const id = 'siphon'

export default class Siphon extends Champion {
  constructor() {
    super(id, 'Le siphon', 'Boit tous les soif à distribuer des autres joueurs', '', 1)
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
