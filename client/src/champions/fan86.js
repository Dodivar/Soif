import Champion from './champion'

const id = 'fan86'

export default class Fan86 extends Champion {
  constructor() {
    super(
      id,
      'Le fan de 86',
      "Désigne quelqu'un pour être ta 8.6, chaque fois qu'il gagne un jeu, te donne +2 soif à distribuer",
      '',
      1
    )
    this.isDisabled = false
    this.canTarget = true
  }

  static getId() {
    return id
  }
}
