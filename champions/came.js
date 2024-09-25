import Champion from './champion'

const id = 'came'

export default class Came extends Champion {
  constructor() {
    super(
      id,
      'Le camé',
      'Donne une seringue à un joueur, si il ne clic pas dessus passé 5 secondes il reçoit 5 soif',
      '',
      3
    )
  }

  static getId() {
    return id
  }
}
