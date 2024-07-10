import {
    typeRatingChanged, typeGetRandomIndexes, typeCalcEloRating, typeMapRatingStyles,
  } from './models'


export const getCreationDate = () => new Date().toLocaleDateString('ru-RU')

export const howRatingChanged = (currRaiting: number, prevRating: number): typeRatingChanged => {
  const diff = currRaiting - prevRating
  if (diff > 0) return 'up'
  if (diff < 0) return 'down'
  return 'none';
}

export const getRandomIndexes = (arrayLength: number): typeGetRandomIndexes => {
  let index1 = Math.floor(Math.random() * arrayLength)
  let index2;
  do {
    index2 = Math.floor(Math.random() * arrayLength);
  } while (index1 === index2);
  return {firstIndex: index1, secondIndex: index2}
};

export const getCoef = (currRaiting: number): number => {
  if (currRaiting >= 2400) 10
  if (currRaiting < 2400 && currRaiting >= 1200) 20
  return 30
}

export const calcEloRating = (winRating: number, losRating: number): typeCalcEloRating => {
  const expectWinRating = 1 / (1 + 10 ** ((losRating - winRating) / 400))
  const expectLosRating = 1 / (1 + 10 ** ((winRating - losRating) / 400))
  const newWinRating = Math.floor(winRating + getCoef(winRating) * (1 - expectWinRating))
  const newLosRating = Math.floor(losRating + getCoef(losRating) * (0 - expectLosRating))
  return {newWinRating, newLosRating}
};

export const mapRatingStyle: typeMapRatingStyles = {
  up: '#198754',
  down: '#dc3545',
  none: '#0d6efd',
}

export const mapRatingIcon: typeMapRatingStyles = {
  up: 'arrow-up',
  down: 'arrow-down',
  none: 'equals',
}
