import Champion from './champion'

export default class Camping extends Champion {
  constructor() {
    super(
      'camping',
      'Camping',
      'Désigne une personne, si celle-ci gagne le prochain round ce sera à toi de distribuer ses soif',
      '',
      2
    )
    this.isDisabled = false
    this.canTarget = true
  }
}
