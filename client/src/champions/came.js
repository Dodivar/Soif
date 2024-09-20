import Champion from './champion'

export default class Boufon extends Champion {
  constructor() {
    super(
      'came',
      'Le camé',
      'Donne une seringue à un joueur, si il ne clic pas dessus passé 5 secondes il reçoit 5 soif',
      '',
      3
    )
  }
}
