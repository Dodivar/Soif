import Champion from './champion'

const id = 'victime'

export default class Victime extends Champion {
  constructor() {
    super(id, 'La victime', 'Réduit tes soifs de 2', '', 3)
    this.isDisabled = false
  }

  static getId() {
    return id
  }
}
