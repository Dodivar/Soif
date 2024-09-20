import Champion from './champion'

export default class Boufon extends Champion {
  constructor() {
    super(
      'victime',
      'La victime',
      'Si tu reçoies le plus de soif à boire, donne 1 soif aux autres joueurs',
      '',
      null
    )
  }
}
