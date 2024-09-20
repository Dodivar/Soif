import Champion from './champion'

const id = 'boufon'

export default class Boufon extends Champion {
  constructor() {
    super(id, 'Le boufon', 'Lance la roue des jokers 2 fois', '', null)
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
