import Champion from './champion'

export default class Victime extends Champion {
  constructor() {
    super('victime', 'La victime', 'Réduit tes soifs de 2', '', 3)
    this.isDisabled = false
  }
}
