import Champion from './champion'

const id = 'rat'

export default class Rat extends Champion {
  constructor() {
    super(id, 'Le rat', "Si tu n'as qu'un soif à distribuer, en rajoute un autre", '', null)
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
