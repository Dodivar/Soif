import Champion from './champion'

const id = 'schlag'
export default class Schlag extends Champion {
  constructor() {
    super(id, 'Le schlag', 'Te donne entre 1 et 3 soif à distribuer', '', 3)
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
