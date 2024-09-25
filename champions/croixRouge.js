import Champion from './champion'

const id = 'croixRouge'

export default class CroixRouge extends Champion {
  constructor() {
    super(id, 'La croix rouge', 'Boit maximum 3 soif par round', '', null)
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
