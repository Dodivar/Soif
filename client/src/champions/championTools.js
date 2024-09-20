import Boufon from './boufon'
import Came from './came'
import Camping from './camping'
import CroixRouge from './croixRouge'
import Fan86 from './fan86'
import Rat from './rat'
import Schlag from './schlag'
import Siphon from './siphon'
import Taze from './taze'
import Victime from './victime'

const championsId = {
  boufon: Boufon.getId(),
  croixRouge: CroixRouge.getId(),
  schlag: Schlag.getId()
}

function GetAll() {
  return [
    new Boufon(), // DONE
    new Came(),
    new Camping(),
    new CroixRouge(), // DONE
    new Fan86(),
    new Rat(), // DONE
    new Schlag(),
    new Siphon(),
    new Taze(),
    new Victime()
  ]
}

function GetChampionById(id) {
  return GetAll().find((e) => e.id === id)
}

function GetChampionName(id) {
  return GetAll().find((e) => e.id === id).name
}

export { GetAll, GetChampionById, GetChampionName, championsId }
