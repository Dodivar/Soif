import Champion from './champion'

export default class Camping extends Champion {
  constructor() {
    super(
      'camping',
      'Camping',
      'Possède le pouvoir de désigner une personne, si celle-ci gagne le prochain round ce sera à toi de distribuer ses soif',
      '',
      1
    )
  }
}
